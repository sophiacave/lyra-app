/**
 * engine.js — Action execution engine for Pro MCP
 *
 * Executes step sequences defined in YAML profiles against Chrome browser.
 * Steps: click, type, wait, navigate, read, screenshot, sleep, assert
 */

import chrome from "./chrome.js";

/**
 * Execute a single step
 */
async function executeStep(step, context = {}) {
  const type = Object.keys(step).find(k => !k.startsWith("_"));
  const config = step[type];
  const log = { step: type, config };

  try {
    switch (type) {
      case "navigate": {
        const url = interpolate(config.url || config, context);
        const result = chrome.navigate(url);
        log.result = result;
        if (!result.ok) throw new Error(`Navigate failed: ${result.error}`);
        // Wait for page load
        if (config.wait !== false) {
          await sleep(config.wait_ms || 3000);
        }
        break;
      }

      case "click": {
        let result;
        if (config.text) {
          result = chrome.clickByText(interpolate(config.text, context));
        } else if (config.selector) {
          result = chrome.clickBySelector(interpolate(config.selector, context));
        } else if (typeof config === "string") {
          result = chrome.clickByText(interpolate(config, context));
        } else {
          throw new Error("click needs text or selector");
        }
        log.result = result;
        if (result.ok && result.result?.startsWith("not found")) {
          throw new Error(result.result);
        }
        break;
      }

      case "type": {
        const text = interpolate(config.value || config.text || config, context);
        const selector = config.selector ? interpolate(config.selector, context) : null;
        // If selector provided, click it first
        if (selector) {
          chrome.clickBySelector(selector);
          await sleep(300);
        }
        const result = chrome.typeText(text, selector);
        log.result = result;
        break;
      }

      case "wait": {
        let result;
        if (config.selector) {
          result = await chrome.waitForElement(
            interpolate(config.selector, context),
            config.timeout || 30000
          );
        } else if (config.text) {
          result = await chrome.waitForText(
            interpolate(config.text, context),
            config.timeout || 30000
          );
        } else if (config.ms || typeof config === "number") {
          await sleep(config.ms || config);
          result = { ok: true, result: `waited ${config.ms || config}ms` };
        }
        log.result = result;
        break;
      }

      case "sleep": {
        const ms = typeof config === "number" ? config : config.ms || 1000;
        await sleep(ms);
        log.result = { ok: true, result: `slept ${ms}ms` };
        break;
      }

      case "read": {
        const expr = interpolate(config.expression || config.js || config, context);
        const result = chrome.readPageData(expr);
        log.result = result;
        if (result.ok && config.store) {
          try {
            context[config.store] = JSON.parse(result.result);
          } catch (e) {
            context[config.store] = result.result;
          }
        }
        break;
      }

      case "js": {
        const code = interpolate(config.code || config, context);
        const isAsync = config.async !== false && (code.includes("await") || code.includes("async"));
        const result = isAsync
          ? await chrome.executeAsyncJS(code, config.timeout || 30000)
          : chrome.executeJS(code);
        log.result = result;
        if (config.store && result.ok) {
          context[config.store] = result.result;
        }
        break;
      }

      case "screenshot": {
        const path = config.path || config || "/tmp/pro-mcp-step.png";
        log.result = chrome.screenshot(interpolate(path, context));
        break;
      }

      case "systemType": {
        // Type text using macOS System Events (works with React)
        const text = interpolate(config.value || config.text || config, context);
        if (config.selectAll !== false) {
          const result = chrome.selectAllAndType(text);
          log.result = result;
        } else {
          const result = chrome.sendKeys(text);
          log.result = result;
        }
        break;
      }

      case "systemKey": {
        const key = config.key || config;
        const mods = config.modifiers || "";
        const result = chrome.sendSpecialKey(key, mods);
        log.result = result;
        break;
      }

      case "focusAndType": {
        // JS finds + focuses element, System Events types
        const findJS = interpolate(config.find || config.js, context);
        const text = interpolate(config.value || config.text, context);
        const result = chrome.clickElementAndType(findJS, text);
        log.result = result;
        break;
      }

      case "assert": {
        const expr = interpolate(config.expression || config, context);
        const result = chrome.executeJS(expr);
        if (!result.ok || result.result === "false" || result.result === "null" || result.result === "undefined") {
          throw new Error(`Assertion failed: ${expr} = ${result.result || result.error}`);
        }
        log.result = { ok: true, result: `assertion passed: ${result.result}` };
        break;
      }

      case "loop": {
        const items = context[config.over] || config.items || [];
        const varName = config.as || "item";
        const results = [];
        for (const item of items) {
          context[varName] = item;
          const stepResults = await executeSteps(config.steps, context);
          results.push({ item, steps: stepResults });
          if (config.delay) await sleep(config.delay);
        }
        log.result = { ok: true, iterations: results.length };
        break;
      }

      default:
        log.result = { ok: false, error: `Unknown step type: ${type}` };
    }
  } catch (e) {
    log.error = e.message;
    log.result = { ok: false, error: e.message };
    if (!step._optional) throw e;
  }

  return log;
}

/**
 * Execute a sequence of steps
 */
export async function executeSteps(steps, context = {}) {
  const results = [];
  for (const step of steps) {
    const result = await executeStep(step, context);
    results.push(result);
  }
  return results;
}

/**
 * Execute a named action from a profile
 */
export async function executeAction(profile, actionName, params = {}) {
  const action = profile.actions?.[actionName];
  if (!action) {
    throw new Error(`Action "${actionName}" not found in profile "${profile.name}". Available: ${Object.keys(profile.actions || {}).join(", ")}`);
  }

  // Ensure we're on the right page
  if (profile.url && action.navigate !== false) {
    const pageInfo = chrome.getPageInfo();
    if (!pageInfo.ok || !pageInfo.url?.includes(new URL(profile.url).hostname)) {
      chrome.navigate(profile.url);
      await sleep(3000);
    }
  }

  const context = { ...params, _profile: profile.name, _action: actionName };
  const results = await executeSteps(action.steps, context);

  return {
    ok: results.every(r => !r.error),
    action: actionName,
    profile: profile.name,
    steps: results,
    context,
  };
}

/**
 * Interpolate {{variable}} in strings
 */
function interpolate(str, context) {
  if (typeof str !== "string") return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return context[key] !== undefined ? String(context[key]) : `{{${key}}}`;
  });
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export default { executeSteps, executeAction };
