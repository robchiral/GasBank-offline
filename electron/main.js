const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

const DATA_DIR = path.join(app.getAppPath(), 'data');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');

const defaultUserData = {
  userSettings: {
    theme: 'system'
  },
  customQuestions: [],
  questionStats: {},
  activeSession: null,
  sessionHistory: [],
  notes: {}
};

const getUserDataPath = () => path.join(app.getPath('userData'), 'userData.json');

async function ensureUserDataFile() {
  const userDataPath = getUserDataPath();
  try {
    await fsp.access(userDataPath, fs.constants.F_OK);
  } catch (err) {
    await fsp.mkdir(path.dirname(userDataPath), { recursive: true });
    await fsp.writeFile(userDataPath, JSON.stringify(defaultUserData, null, 2), 'utf-8');
  }

  const raw = await fsp.readFile(userDataPath, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    return { ...defaultUserData, ...parsed };
  } catch (err) {
    console.error('Failed to parse userData.json. Recreating file.', err);
    await fsp.writeFile(userDataPath, JSON.stringify(defaultUserData, null, 2), 'utf-8');
    return { ...defaultUserData };
  }
}

async function loadQuestions() {
  const raw = await fsp.readFile(QUESTIONS_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function saveUserData(data) {
  const userDataPath = getUserDataPath();
  await fsp.writeFile(userDataPath, JSON.stringify(data, null, 2), 'utf-8');
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'Anesthesiology Question Bank'
  });

  const indexPath = path.join(app.getAppPath(), 'src', 'index.html');
  mainWindow.loadFile(indexPath);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('data:load', async () => {
  const [questions, userData] = await Promise.all([loadQuestions(), ensureUserDataFile()]);
  return { questions, userData };
});

ipcMain.handle('data:saveUserData', async (_event, data) => {
  await saveUserData(data);
  return { success: true };
});

ipcMain.handle('data:resetAll', async () => {
  await saveUserData(defaultUserData);
  return { success: true, userData: { ...defaultUserData } };
});

ipcMain.handle('dialog:importQuestions', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Import questions',
    buttonLabel: 'Import',
    filters: [
      { name: 'JSON or CSV', extensions: ['json', 'csv'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (result.canceled || !result.filePaths?.length) {
    return { canceled: true };
  }

  const filePath = result.filePaths[0];
  const ext = path.extname(filePath).toLowerCase();
  const raw = await fsp.readFile(filePath, 'utf-8');

  try {
    if (ext === '.json') {
      const parsed = JSON.parse(raw);
      return { canceled: false, data: parsed, format: 'json' };
    }
    if (ext === '.csv') {
      return { canceled: false, data: raw, format: 'csv' };
    }
    return { canceled: false, data: raw, format: 'unknown' };
  } catch (err) {
    return { canceled: false, error: err.message };
  }
});

ipcMain.handle('dialog:exportQuestions', async (_event, payload) => {
  const result = await dialog.showSaveDialog({
    title: 'Export custom questions',
    buttonLabel: 'Export',
    defaultPath: 'custom-questions.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });

  if (result.canceled || !result.filePath) {
    return { canceled: true };
  }

  await fsp.writeFile(result.filePath, JSON.stringify(payload, null, 2), 'utf-8');
  return { canceled: false, filePath: result.filePath };
});
