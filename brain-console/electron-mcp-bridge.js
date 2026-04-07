/**
 * electron-mcp-bridge.js — HTTP bridge inside Electron for MCP control
 *
 * Exposes the Electron app's internals via localhost HTTP API.
 * Claude Code's MCP server calls these endpoints to:
 * - Send chat messages programmatically
 * - Read UI state (panels, messages, errors)
 * - Execute JS in the renderer
 * - Switch panels, trigger actions
 *
 * This eliminates AppleScript coordinate hacking forever.
 *
 * 2026-04-07
 */

const http = require('http');

class ElectronMCPBridge {
  constructor(mainWindow, port = 17823) {
    this.mainWindow = mainWindow;
    this.port = port;
    this.server = null;
    this.pendingResponses = new Map();
    this.nextId = 0;
  }

  start() {
    this.server = http.createServer((req, res) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const result = await this.handleRequest(req.url, body ? JSON.parse(body) : {});
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } catch (e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    });

    this.server.listen(this.port, '127.0.0.1', () => {
      console.log(`[ElectronMCP] Bridge listening on http://127.0.0.1:${this.port}`);
    });

    this.server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.log('[ElectronMCP] Port in use, trying next...');
        this.port++;
        this.server.listen(this.port, '127.0.0.1');
      }
    });
  }

  async handleRequest(url, params) {
    const win = this.mainWindow;
    if (!win || win.isDestroyed()) return { error: 'Window not available' };

    switch (url) {
      case '/send-chat': {
        // Send a message through the chat — triggers SDK agent
        const msg = params.message;
        if (!msg) return { error: 'message required' };
        const result = await win.webContents.executeJavaScript(`
          (async () => {
            const input = document.getElementById('messageInput');
            const welcome = document.getElementById('welcomeScreen');
            if (welcome) welcome.style.display = 'none';
            input.value = ${JSON.stringify(msg)};
            input.dispatchEvent(new Event('input'));
            await sendMessage();
            return { sent: true, message: ${JSON.stringify(msg)} };
          })()
        `);
        return result;
      }

      case '/get-state': {
        // Get current UI state
        const state = await win.webContents.executeJavaScript(`
          (() => {
            const messages = document.querySelectorAll('.message');
            const lastMsg = messages[messages.length - 1];
            const lastText = lastMsg ? lastMsg.querySelector('.message-body')?.textContent?.slice(0, 200) : null;
            const lastProvider = lastMsg ? lastMsg.querySelector('.message-provider')?.textContent : null;
            return {
              activePanel: typeof activePanel !== 'undefined' ? activePanel : 'unknown',
              messageCount: messages.length,
              isStreaming: typeof isStreaming !== 'undefined' ? isStreaming : false,
              lastMessage: lastText,
              lastProvider: lastProvider,
              agentStatus: document.getElementById('agentStatus')?.classList.contains('active') ? document.getElementById('agentStatusText')?.textContent : null,
            };
          })()
        `);
        return state;
      }

      case '/get-messages': {
        // Get all chat messages
        const messages = await win.webContents.executeJavaScript(`
          (() => {
            return Array.from(document.querySelectorAll('.message')).map(m => ({
              role: m.querySelector('.message-avatar')?.classList.contains('user') ? 'user' :
                    m.querySelector('.message-avatar')?.classList.contains('brain') ? 'assistant' : 'unknown',
              text: m.querySelector('.message-body')?.textContent?.slice(0, 500),
              provider: m.querySelector('.message-provider')?.textContent,
              time: m.querySelector('.message-time')?.textContent,
            }));
          })()
        `);
        return { messages };
      }

      case '/switch-panel': {
        const panel = params.panel;
        if (!panel) return { error: 'panel required' };
        await win.webContents.executeJavaScript(`switchPanel('${panel}')`);
        return { switched: panel };
      }

      case '/execute-js': {
        // Execute arbitrary JS in renderer — power tool
        const code = params.code;
        if (!code) return { error: 'code required' };
        const result = await win.webContents.executeJavaScript(code);
        return { result };
      }

      case '/get-errors': {
        // Get console errors from renderer
        const errors = await win.webContents.executeJavaScript(`
          window.__electronMcpErrors || []
        `);
        return { errors };
      }

      case '/clear-chat': {
        await win.webContents.executeJavaScript(`
          document.getElementById('chatMessages').innerHTML = '';
          const welcome = document.getElementById('welcomeScreen');
          if (welcome) welcome.style.display = 'flex';
          window.brain.clearConversation();
        `);
        return { cleared: true };
      }

      case '/health': {
        return { status: 'ok', port: this.port, windowReady: !win.isDestroyed() };
      }

      default:
        return { error: 'Unknown endpoint', available: ['/send-chat', '/get-state', '/get-messages', '/switch-panel', '/execute-js', '/get-errors', '/clear-chat', '/health'] };
    }
  }

  stop() {
    if (this.server) {
      this.server.close();
      console.log('[ElectronMCP] Bridge stopped');
    }
  }
}

module.exports = { ElectronMCPBridge };
