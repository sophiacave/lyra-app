/**
 * Timbre for Mac — main process
 * Dual interface: GarageBand simplicity for humans, programmatic power for AI.
 * Embeds Suno Studio in BrowserView for native auth.
 */

const { app, BrowserWindow, BrowserView, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { execSync, exec } = require('child_process');
const fs = require('fs');
const os = require('os');

const HOME = os.homedir();
const TIMBRE_DIR = path.join(HOME, 'timbre');
const STEMS_DIR = path.join(TIMBRE_DIR, 'stems');
const REMIXES_DIR = path.join(TIMBRE_DIR, 'remixes');
const RAW_DIR = path.join(TIMBRE_DIR, 'raw');
const VENV = path.join(HOME, 'timbre-env');

let mainWindow;
let sunoView;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#08080a',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('ui/index.html');

  // Create Suno Studio BrowserView (hidden until needed)
  sunoView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'persist:suno', // Persistent session — auth survives restarts
    },
  });
  mainWindow.addBrowserView(sunoView);
  sunoView.setBounds({ x: 0, y: 0, width: 0, height: 0 }); // Hidden initially
  sunoView.webContents.loadURL('https://suno.com/create');
}

// ── IPC: Suno Integration ──────────────────────────────────────────
ipcMain.handle('suno:getToken', async () => {
  try {
    const token = await sunoView.webContents.executeJavaScript(`
      (async () => {
        if (window.Clerk && window.Clerk.session) {
          return await window.Clerk.session.getToken();
        }
        // Fallback to cookie
        const c = document.cookie.split(';').find(c => c.trim().startsWith('__session='));
        return c ? c.trim().replace('__session=', '') : null;
      })()
    `);
    return { ok: true, token };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('suno:generate', async (_, { prompt, title, uploadId }) => {
  try {
    const token = await sunoView.webContents.executeJavaScript(`
      (async () => {
        if (window.Clerk && window.Clerk.session) return await window.Clerk.session.getToken();
        const c = document.cookie.split(';').find(c => c.trim().startsWith('__session='));
        return c ? c.trim().replace('__session=', '') : null;
      })()
    `);

    const body = { prompt, title };
    if (uploadId) body.upload_id = uploadId;

    const result = await sunoView.webContents.executeJavaScript(`
      (async () => {
        const r = await fetch('https://studio-api-prod.suno.com/api/generate/v2/', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ${token}',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(${JSON.stringify(body)})
        });
        return await r.json();
      })()
    `);
    return { ok: true, data: result };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('suno:getUploadUrl', async () => {
  try {
    const result = await sunoView.webContents.executeJavaScript(`
      (async () => {
        const token = window.Clerk?.session ? await window.Clerk.session.getToken() :
          document.cookie.split(';').find(c => c.trim().startsWith('__session='))?.trim().replace('__session=', '');
        const r = await fetch('https://studio-api-prod.suno.com/api/uploads/audio/', {
          method: 'POST',
          headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'},
          body: '{}'
        });
        return await r.json();
      })()
    `);
    return { ok: true, data: result };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('suno:getClip', async (_, clipId) => {
  try {
    const result = await sunoView.webContents.executeJavaScript(`
      (async () => {
        const token = window.Clerk?.session ? await window.Clerk.session.getToken() :
          document.cookie.split(';').find(c => c.trim().startsWith('__session='))?.trim().replace('__session=', '');
        const r = await fetch('https://studio-api-prod.suno.com/api/clip/${clipId}', {
          headers: {'Authorization': 'Bearer ' + token}
        });
        return await r.json();
      })()
    `);
    return { ok: true, data: result };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('suno:billing', async () => {
  try {
    const result = await sunoView.webContents.executeJavaScript(`
      (async () => {
        const token = window.Clerk?.session ? await window.Clerk.session.getToken() :
          document.cookie.split(';').find(c => c.trim().startsWith('__session='))?.trim().replace('__session=', '');
        const r = await fetch('https://studio-api-prod.suno.com/api/billing/info/', {
          headers: {'Authorization': 'Bearer ' + token}
        });
        return await r.json();
      })()
    `);
    return { ok: true, data: result };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('suno:showStudio', async () => {
  const bounds = mainWindow.getBounds();
  sunoView.setBounds({ x: 300, y: 48, width: bounds.width - 300, height: bounds.height - 48 });
  sunoView.webContents.loadURL('https://suno.com/studio');
});

ipcMain.handle('suno:hideStudio', async () => {
  sunoView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
});

// ── IPC: Local Engines ─────────────────────────────────────────────
ipcMain.handle('demucs:separate', async (_, filePath) => {
  return new Promise((resolve) => {
    const cmd = `source ${VENV}/bin/activate && python3 -m demucs --name htdemucs_ft --out ${STEMS_DIR} --device mps "${filePath}"`;
    exec(cmd, { shell: '/bin/zsh', timeout: 600000 }, (err, stdout, stderr) => {
      if (err) resolve({ ok: false, error: stderr || err.message });
      else {
        const basename = path.basename(filePath, path.extname(filePath));
        const stemDir = path.join(STEMS_DIR, 'htdemucs_ft', basename);
        const stems = fs.existsSync(stemDir) ? fs.readdirSync(stemDir) : [];
        resolve({ ok: true, stems, dir: stemDir });
      }
    });
  });
});

ipcMain.handle('files:list', async (_, dir) => {
  const target = dir || REMIXES_DIR;
  if (!fs.existsSync(target)) return [];
  return fs.readdirSync(target).map(f => {
    const full = path.join(target, f);
    const stat = fs.statSync(full);
    return { name: f, path: full, size: stat.size, modified: stat.mtime.toISOString(), isDir: stat.isDirectory() };
  });
});

ipcMain.handle('files:openInFinder', async (_, filePath) => {
  shell.showItemInFolder(filePath);
});

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Audio', extensions: ['wav', 'mp3', 'flac', 'aac', 'm4a'] }],
  });
  return result.canceled ? null : result.filePaths[0];
});

// ── App lifecycle ──────────────────────────────────────────────────
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
