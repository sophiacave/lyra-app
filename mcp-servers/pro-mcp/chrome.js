/**
 * chrome.js — Chrome browser bridge for Pro MCP
 *
 * Dual-mode: AppleScript (reliable, always works) + Chrome MCP extension (when available)
 * AppleScript can navigate, execute JS, read page state, and control Chrome tabs.
 */

import { execSync } from "child_process";

const APPLESCRIPT_TIMEOUT = 30000;

/**
 * Execute AppleScript and return result
 */
function osascript(script, timeout = APPLESCRIPT_TIMEOUT) {
  try {
    const result = execSync(`osascript -e '${script.replace(/'/g, "'\"'\"'")}'`, {
      encoding: "utf8",
      timeout,
      shell: "/bin/zsh",
    }).trim();
    return { ok: true, result };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * Execute AppleScript from heredoc (for complex scripts with quotes)
 */
function osascriptHeredoc(script, timeout = APPLESCRIPT_TIMEOUT) {
  try {
    const result = execSync(`osascript << 'ENDSCRIPT'\n${script}\nENDSCRIPT`, {
      encoding: "utf8",
      timeout,
      shell: "/bin/zsh",
    }).trim();
    return { ok: true, result };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * Navigate Chrome to a URL (finds existing tab or creates new)
 */
export function navigate(url) {
  return osascriptHeredoc(`
tell application "Google Chrome"
    activate
    tell window 1
        set tabCount to count of tabs
        repeat with i from 1 to tabCount
            if URL of tab i contains "${url}" then
                set active tab index to i
                return "found:" & i
            end if
        end repeat
        set URL of active tab to "${url}"
        return "navigated"
    end tell
end tell
  `);
}

/**
 * Execute JavaScript in the active Chrome tab
 * For async code, stores result in window._proMcpResult
 */
export function executeJS(code) {
  // Escape for AppleScript embedding
  const escaped = code.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return osascriptHeredoc(`
tell application "Google Chrome"
    tell active tab of window 1
        return execute javascript "${escaped}"
    end tell
end tell
  `);
}

/**
 * Execute async JavaScript — stores result in window variable, polls for it
 */
export async function executeAsyncJS(code, timeoutMs = 30000) {
  const id = "_pm_" + Date.now();

  // Wrap in async IIFE that stores result
  const wrappedCode = `
    window.${id} = 'pending';
    (async () => {
      try {
        const result = await (async () => { ${code} })();
        window.${id} = JSON.stringify({ ok: true, result });
      } catch(e) {
        window.${id} = JSON.stringify({ ok: false, error: e.message });
      }
    })();
    'started';
  `;

  const startResult = executeJS(wrappedCode);
  if (!startResult.ok) return startResult;

  // Poll for result
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await new Promise(r => setTimeout(r, 500));
    const poll = executeJS(`window.${id}`);
    if (poll.ok && poll.result && poll.result !== "pending") {
      try {
        const parsed = JSON.parse(poll.result);
        // Cleanup
        executeJS(`delete window.${id}`);
        return parsed;
      } catch (e) {
        return { ok: true, result: poll.result };
      }
    }
  }
  return { ok: false, error: "Timeout waiting for async result" };
}

/**
 * Get current page info
 */
export function getPageInfo() {
  const result = executeJS(
    'JSON.stringify({ url: location.href, title: document.title })'
  );
  if (result.ok) {
    try { return { ok: true, ...JSON.parse(result.result) }; }
    catch(e) { return result; }
  }
  return result;
}

/**
 * Click element by text content
 */
export function clickByText(text) {
  return executeJS(`
    (function() {
      // Search ALL elements — web apps use spans, divs, etc. as buttons
      const all = document.querySelectorAll('button, [role="button"], a, [role="tab"], [role="menuitem"], span, div, label, li');
      // Exact match first (leaf nodes — no children with text)
      for (const el of all) {
        const t = el.innerText?.trim();
        if (t === '${text}' && el.offsetParent !== null) {
          el.click();
          return 'clicked: ${text}';
        }
      }
      // Exact match on elements that contain the text as direct child
      for (const el of all) {
        const directText = Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        if (directText === '${text}' && el.offsetParent !== null) {
          el.click();
          return 'clicked (direct): ${text}';
        }
      }
      // Partial match on visible elements
      for (const el of all) {
        const t = el.innerText?.trim();
        if (t && t.includes('${text}') && t.length < 50 && el.offsetParent !== null) {
          el.click();
          return 'clicked (partial): ' + t.substring(0, 30);
        }
      }
      return 'not found: ${text}';
    })()
  `);
}

/**
 * Click element by CSS selector
 */
export function clickBySelector(selector) {
  return executeJS(`
    (function() {
      const el = document.querySelector('${selector}');
      if (el) { el.click(); return 'clicked'; }
      return 'not found: ${selector}';
    })()
  `);
}

/**
 * Type text into the currently focused element or a specific selector
 */
export function typeText(text, selector = null) {
  const selectorPart = selector
    ? `const el = document.querySelector('${selector}'); if (el) { el.focus(); }`
    : "";

  return executeJS(`
    (function() {
      ${selectorPart}
      const active = document.activeElement;
      if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT' || active.contentEditable === 'true')) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          active.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
          'value'
        )?.set;
        if (nativeSetter) {
          nativeSetter.call(active, '${text.replace(/'/g, "\\'")}');
          active.dispatchEvent(new Event('input', { bubbles: true }));
          active.dispatchEvent(new Event('change', { bubbles: true }));
          return 'typed: ${text.substring(0, 30)}';
        }
      }
      return 'no input focused';
    })()
  `);
}

/**
 * Wait for an element to appear
 */
export async function waitForElement(selector, timeoutMs = 30000) {
  return executeAsyncJS(`
    const start = Date.now();
    while (Date.now() - start < ${timeoutMs}) {
      const el = document.querySelector('${selector}');
      if (el) return 'found: ${selector}';
      await new Promise(r => setTimeout(r, 500));
    }
    return 'timeout: ${selector}';
  `, timeoutMs + 5000);
}

/**
 * Wait for text to appear on page
 */
export async function waitForText(text, timeoutMs = 30000) {
  return executeAsyncJS(`
    const start = Date.now();
    while (Date.now() - start < ${timeoutMs}) {
      if (document.body.innerText.includes('${text}')) return 'found: ${text}';
      await new Promise(r => setTimeout(r, 500));
    }
    return 'timeout: ${text}';
  `, timeoutMs + 5000);
}

/**
 * Read structured data from the page
 */
export function readPageData(jsExpression) {
  return executeJS(`JSON.stringify(${jsExpression})`);
}

/**
 * Take a screenshot via macOS screencapture
 */
export function screenshot(savePath = "/tmp/pro-mcp-screenshot.png") {
  try {
    // Activate Chrome first
    execSync(`osascript -e 'tell application "Google Chrome" to activate'`, { timeout: 5000 });
    execSync(`sleep 0.5 && screencapture -w -x "${savePath}"`, { timeout: 10000, shell: "/bin/zsh" });
    return { ok: true, path: savePath };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * Get all open tab URLs
 */
export function getTabs() {
  const result = osascriptHeredoc(`
tell application "Google Chrome"
    set tabInfo to ""
    tell window 1
        set tabCount to count of tabs
        repeat with i from 1 to tabCount
            set tabInfo to tabInfo & i & "|" & title of tab i & "|" & URL of tab i & "\\n"
        end repeat
    end tell
    return tabInfo
end tell
  `);
  if (result.ok) {
    const tabs = result.result.split("\n").filter(Boolean).map(line => {
      const [index, title, url] = line.split("|");
      return { index: parseInt(index), title, url };
    });
    return { ok: true, tabs };
  }
  return result;
}

/**
 * Switch to tab by index
 */
export function switchTab(index) {
  return osascriptHeredoc(`
tell application "Google Chrome"
    tell window 1
        set active tab index to ${index}
        return title of active tab
    end tell
end tell
  `);
}

/**
 * Send real keystrokes to Chrome via System Events (works with React)
 */
export function sendKeys(text) {
  return osascriptHeredoc(`
tell application "Google Chrome" to activate
delay 0.3
tell application "System Events"
    tell process "Google Chrome"
        keystroke "${text.replace(/"/g, '\\"')}"
    end tell
end tell
return "typed"
  `);
}

/**
 * Send special key (e.g., "return", "tab", "delete")
 */
export function sendSpecialKey(keyName, modifiers = "") {
  const modMap = {
    cmd: "command down",
    shift: "shift down",
    alt: "option down",
    ctrl: "control down",
  };
  const modStr = modifiers
    ? ` using {${modifiers.split("+").map(m => modMap[m] || m).join(", ")}}`
    : "";
  return osascriptHeredoc(`
tell application "Google Chrome" to activate
delay 0.2
tell application "System Events"
    tell process "Google Chrome"
        key code ${getKeyCode(keyName)}${modStr}
    end tell
end tell
return "key sent: ${keyName}"
  `);
}

function getKeyCode(name) {
  const codes = {
    return: 36, tab: 48, delete: 51, escape: 53, space: 49,
    left: 123, right: 124, up: 126, down: 125,
    a: 0, c: 8, v: 9, x: 7, z: 6,
  };
  return codes[name.toLowerCase()] || 0;
}

/**
 * Click at screen coordinates via System Events
 */
export function clickAt(x, y) {
  return osascriptHeredoc(`
tell application "Google Chrome" to activate
delay 0.2
tell application "System Events"
    click at {${x}, ${y}}
end tell
return "clicked at ${x},${y}"
  `);
}

/**
 * Select all text in focused element and replace with new text
 * Uses Cmd+A, then types replacement — works with React
 */
export function selectAllAndType(text) {
  return osascriptHeredoc(`
tell application "Google Chrome" to activate
delay 0.3
tell application "System Events"
    tell process "Google Chrome"
        keystroke "a" using command down
        delay 0.2
        keystroke "${text.replace(/"/g, '\\"')}"
    end tell
end tell
return "replaced with: ${text.substring(0, 30)}"
  `);
}

/**
 * Click an element found by JS, then type into it using System Events
 * This is the reliable combo: JS finds element + System Events types
 */
export function clickElementAndType(findJS, text) {
  // First use JS to find and focus the element
  const findResult = executeJS(findJS);
  if (!findResult.ok) return findResult;

  // Small delay for focus
  execSync("sleep 0.5", { shell: "/bin/zsh" });

  // Select all and type via System Events
  return selectAllAndType(text);
}

export default {
  navigate,
  executeJS,
  executeAsyncJS,
  getPageInfo,
  clickByText,
  clickBySelector,
  typeText,
  waitForElement,
  waitForText,
  readPageData,
  screenshot,
  getTabs,
  switchTab,
  sendKeys,
  sendSpecialKey,
  clickAt,
  selectAllAndType,
  clickElementAndType,
};
