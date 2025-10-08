const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

const DATA_DIR = path.join(app.getAppPath(), 'data');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');
const CONFIG_FILE = path.join(app.getPath('userData'), 'gasbank.config.json');
const DEFAULT_USER_DATA_PATH = path.join(app.getPath('userData'), 'userData.json');

const defaultUserData = {
  userSettings: {
    theme: 'system'
  },
  storage: {
    customImageDirectory: null
  },
  customQuestions: [],
  questionStats: {},
  activeSession: null,
  sessionHistory: [],
  notes: {},
  flaggedQuestionIds: []
};

let cachedUserDataPath = null;

async function ensureConfigDirectory() {
  await fsp.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
}

function getDefaultCustomImageDirectory(userDataPath) {
  return path.join(path.dirname(userDataPath), 'images');
}

async function ensureDirectoryExists(directory) {
  if (!directory) return;
  try {
    await fsp.mkdir(directory, { recursive: true });
  } catch (err) {
    console.error('Failed to ensure directory exists:', directory, err);
  }
}

async function resolveUserDataPath() {
  if (cachedUserDataPath) return cachedUserDataPath;

  try {
    const raw = await fsp.readFile(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.customImageDirectory) {
      defaultUserData.storage.customImageDirectory = parsed.customImageDirectory;
    }
    if (parsed.userDataPath) {
      cachedUserDataPath = parsed.userDataPath;
      return cachedUserDataPath;
    }
  } catch (err) {
    // config missing or unreadable, fall back to default
  }

  cachedUserDataPath = DEFAULT_USER_DATA_PATH;
  return cachedUserDataPath;
}

async function persistUserDataPath(targetPath) {
  cachedUserDataPath = targetPath;
  await ensureConfigDirectory();
  const existing = await loadConfig();
  const next = { ...existing, userDataPath: targetPath };
  await fsp.writeFile(CONFIG_FILE, JSON.stringify(next, null, 2), 'utf-8');
}

async function persistCustomImageDirectory(directory) {
  await ensureConfigDirectory();
  const existing = await loadConfig();
  const target = directory || null;
  if (target) {
    await ensureDirectoryExists(target);
  }
  if (existing.customImageDirectory === target) {
    return;
  }
  const next = { ...existing, customImageDirectory: target };
  await fsp.writeFile(CONFIG_FILE, JSON.stringify(next, null, 2), 'utf-8');
}

async function loadConfig() {
  try {
    const raw = await fsp.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

async function ensureUserDataFile() {
  const userDataPath = await resolveUserDataPath();
  try {
    await fsp.access(userDataPath, fs.constants.F_OK);
  } catch (err) {
    await fsp.mkdir(path.dirname(userDataPath), { recursive: true });
    await fsp.writeFile(userDataPath, JSON.stringify(defaultUserData, null, 2), 'utf-8');
  }

  const raw = await fsp.readFile(userDataPath, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    const merged = {
      ...defaultUserData,
      ...parsed,
      storage: {
        ...defaultUserData.storage,
        ...(parsed.storage || {})
      }
    };
    if (!merged.storage.customImageDirectory) {
      merged.storage.customImageDirectory = getDefaultCustomImageDirectory(userDataPath);
    }
    await ensureDirectoryExists(merged.storage.customImageDirectory);
    await persistCustomImageDirectory(merged.storage.customImageDirectory);
    if (!parsed.storage || parsed.storage.customImageDirectory !== merged.storage.customImageDirectory) {
      await fsp.writeFile(userDataPath, JSON.stringify(merged, null, 2), 'utf-8');
    }
    return merged;
  } catch (err) {
    console.error('Failed to parse userData.json. Recreating file.', err);
    const fallback = {
      ...defaultUserData,
      storage: {
        ...defaultUserData.storage,
        customImageDirectory: getDefaultCustomImageDirectory(userDataPath)
      }
    };
    await fsp.writeFile(userDataPath, JSON.stringify(fallback, null, 2), 'utf-8');
    await ensureDirectoryExists(fallback.storage.customImageDirectory);
    await persistCustomImageDirectory(fallback.storage.customImageDirectory);
    return fallback;
  }
}

async function loadQuestions() {
  const raw = await fsp.readFile(QUESTIONS_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function saveUserData(data) {
  const userDataPath = await resolveUserDataPath();
  await fsp.mkdir(path.dirname(userDataPath), { recursive: true });
  const payload = {
    ...data,
    storage: {
      customImageDirectory: data.storage?.customImageDirectory || getDefaultCustomImageDirectory(userDataPath)
    }
  };
  await ensureDirectoryExists(payload.storage.customImageDirectory);
  await persistCustomImageDirectory(payload.storage.customImageDirectory);
  await fsp.writeFile(userDataPath, JSON.stringify(payload, null, 2), 'utf-8');
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
  const userDataPath = await resolveUserDataPath();
  return {
    questions,
    userData,
    paths: {
      currentUserDataPath: userDataPath,
      defaultUserDataPath: DEFAULT_USER_DATA_PATH
    },
    storage: userData.storage || { customImageDirectory: null }
  };
});

ipcMain.handle('data:saveUserData', async (_event, data) => {
  await saveUserData(data);
  return { success: true };
});

ipcMain.handle('data:resetAll', async () => {
  const userDataPath = await resolveUserDataPath();
  const resetData = {
    ...defaultUserData,
    storage: {
      customImageDirectory: getDefaultCustomImageDirectory(userDataPath)
    }
  };
  await saveUserData(resetData);
  return { success: true, userData: { ...resetData } };
});

ipcMain.handle('settings:getPaths', async () => {
  const currentUserDataPath = await resolveUserDataPath();
  const userData = await ensureUserDataFile();
  const config = await loadConfig();
  return {
    currentUserDataPath,
    defaultUserDataPath: DEFAULT_USER_DATA_PATH,
    customImageDirectory: userData.storage?.customImageDirectory || config.customImageDirectory || null
  };
});

ipcMain.handle('settings:chooseUserDataDirectory', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Select data directory',
    buttonLabel: 'Choose',
    properties: ['openDirectory', 'createDirectory']
  });

  if (result.canceled || !result.filePaths?.length) {
    return { canceled: true };
  }

  return { canceled: false, directory: result.filePaths[0] };
});

ipcMain.handle('settings:updateUserDataPath', async (_event, options) => {
  const { directory, useDefault } = options || {};

  const targetPath = useDefault
    ? DEFAULT_USER_DATA_PATH
    : directory
      ? path.join(directory, 'userData.json')
      : null;

  if (!targetPath) {
    return { success: false, message: 'No directory selected.' };
  }

  const currentPath = await resolveUserDataPath();
  const userData = await ensureUserDataFile();

  await fsp.mkdir(path.dirname(targetPath), { recursive: true });
  const customImageDirectory = userData.storage?.customImageDirectory || getDefaultCustomImageDirectory(targetPath);
  userData.storage = userData.storage || {};
  userData.storage.customImageDirectory = customImageDirectory;
  await fsp.writeFile(targetPath, JSON.stringify(userData, null, 2), 'utf-8');
  await persistUserDataPath(targetPath);
  await persistCustomImageDirectory(customImageDirectory);
  await ensureDirectoryExists(customImageDirectory);

  return {
    success: true,
    userDataPath: targetPath,
    userData,
    paths: {
      currentUserDataPath: targetPath,
      defaultUserDataPath: DEFAULT_USER_DATA_PATH
    },
    customImageDirectory,
    updated: targetPath !== currentPath
  };
});

ipcMain.handle('settings:setCustomImageDirectory', async (_event, directory) => {
  const userDataPath = await resolveUserDataPath();
  const resolved = directory || getDefaultCustomImageDirectory(userDataPath);
  await persistCustomImageDirectory(resolved);
  await ensureDirectoryExists(resolved);
  return {
    success: true,
    customImageDirectory: resolved
  };
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
