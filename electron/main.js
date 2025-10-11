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
    theme: 'system',
    backupPreferences: {
      autoEnabled: true,
      interval: 10
    }
  },
  storage: {
    customImageDirectory: null,
    backupDirectory: null,
    attemptsSinceBackup: 0,
    lastBackupAt: null
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

function normalizeBackupPreferences(preferences = {}) {
  const autoEnabled = preferences.autoEnabled !== false;
  const interval = Math.max(1, Math.round(Number(preferences.interval) || 10));
  return { autoEnabled, interval };
}

function normalizeAttemptsSinceBackup(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return Math.floor(numeric);
}

function formatTimestampSlug(date = new Date()) {
  const pad = (value) => `${value}`.padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

function getIsoTimestamp() {
  return new Date().toISOString();
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
      userSettings: {
        ...defaultUserData.userSettings,
        ...(parsed.userSettings || {}),
        backupPreferences: {
          ...defaultUserData.userSettings.backupPreferences,
          ...(parsed.userSettings?.backupPreferences || {})
        }
      },
      storage: {
        ...defaultUserData.storage,
        ...(parsed.storage || {})
      }
    };
    merged.userSettings.backupPreferences = normalizeBackupPreferences(merged.userSettings.backupPreferences);
    merged.storage.attemptsSinceBackup = normalizeAttemptsSinceBackup(merged.storage.attemptsSinceBackup);
    if (!merged.storage.lastBackupAt || typeof merged.storage.lastBackupAt !== 'string') {
      merged.storage.lastBackupAt = null;
    }
    if (!merged.storage.customImageDirectory) {
      merged.storage.customImageDirectory = getDefaultCustomImageDirectory(userDataPath);
    }
    await ensureDirectoryExists(merged.storage.customImageDirectory);
    if (merged.storage.backupDirectory) {
      await ensureDirectoryExists(merged.storage.backupDirectory);
    }
    await persistCustomImageDirectory(merged.storage.customImageDirectory);
    await fsp.writeFile(userDataPath, JSON.stringify(merged, null, 2), 'utf-8');
    return merged;
  } catch (err) {
    console.error('Failed to parse userData.json. Recreating file.', err);
    const fallback = {
      ...defaultUserData,
      userSettings: {
        ...defaultUserData.userSettings
      },
      storage: {
        ...defaultUserData.storage,
        customImageDirectory: getDefaultCustomImageDirectory(userDataPath)
      }
    };
    fallback.userSettings.backupPreferences = normalizeBackupPreferences(
      fallback.userSettings.backupPreferences
    );
    fallback.storage.attemptsSinceBackup = normalizeAttemptsSinceBackup(
      fallback.storage.attemptsSinceBackup
    );
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
    ...defaultUserData,
    ...data,
    userSettings: {
      ...defaultUserData.userSettings,
      ...(data.userSettings || {}),
      backupPreferences: {
        ...defaultUserData.userSettings.backupPreferences,
        ...(data.userSettings?.backupPreferences || {})
      }
    },
    storage: {
      ...defaultUserData.storage,
      ...(data.storage || {})
    }
  };
  payload.userSettings.backupPreferences = normalizeBackupPreferences(
    payload.userSettings.backupPreferences
  );
  payload.storage.attemptsSinceBackup = normalizeAttemptsSinceBackup(
    payload.storage.attemptsSinceBackup
  );
  if (!payload.storage.lastBackupAt || typeof payload.storage.lastBackupAt !== 'string') {
    payload.storage.lastBackupAt = null;
  }
  payload.storage.customImageDirectory =
    payload.storage.customImageDirectory || getDefaultCustomImageDirectory(userDataPath);
  await ensureDirectoryExists(payload.storage.customImageDirectory);
  if (payload.storage.backupDirectory) {
    await ensureDirectoryExists(payload.storage.backupDirectory);
  }
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
    title: 'GasBank'
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
    customImageDirectory: userData.storage?.customImageDirectory || config.customImageDirectory || null,
    backupDirectory: userData.storage?.backupDirectory || null,
    backupPreferences: userData.userSettings?.backupPreferences || { autoEnabled: true, interval: 10 },
    lastBackupAt: userData.storage?.lastBackupAt || null
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

ipcMain.handle('settings:chooseBackupDirectory', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Select backup directory',
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
  const currentDefaultImageDirectory = getDefaultCustomImageDirectory(currentPath);
  const nextDefaultImageDirectory = getDefaultCustomImageDirectory(targetPath);
  const existingImageDirectory = userData.storage?.customImageDirectory;
  const shouldUseDefaultImageDirectory =
    !existingImageDirectory || existingImageDirectory === currentDefaultImageDirectory;
  const customImageDirectory = shouldUseDefaultImageDirectory
    ? nextDefaultImageDirectory
    : existingImageDirectory;
  userData.storage = {
    ...defaultUserData.storage,
    ...(userData.storage || {}),
    customImageDirectory
  };
  cachedUserDataPath = targetPath;
  await persistUserDataPath(targetPath);
  await saveUserData(userData);
  const sanitized = await ensureUserDataFile();

  return {
    success: true,
    userDataPath: targetPath,
    userData: sanitized,
    paths: {
      currentUserDataPath: targetPath,
      defaultUserDataPath: DEFAULT_USER_DATA_PATH
    },
    customImageDirectory: sanitized.storage?.customImageDirectory,
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

ipcMain.handle('backup:create', async (_event, options = {}) => {
  const directory = options.directory;
  if (!directory) {
    return { success: false, message: 'Select a backup directory in Settings first.' };
  }
  try {
    await ensureDirectoryExists(directory);
  } catch (err) {
    console.error('Backup directory unavailable.', err);
    return { success: false, message: 'Failed to access the backup directory.' };
  }

  try {
    const userData = await ensureUserDataFile();
    const timestamp = getIsoTimestamp();
    const slug = formatTimestampSlug(new Date(timestamp));
    const randomSuffix = Math.random().toString(36).slice(2, 6);
    const filename = `userData-backup-${slug}-${randomSuffix}.json`;
    const destination = path.join(directory, filename);
    await fsp.writeFile(destination, JSON.stringify(userData, null, 2), 'utf-8');
    return { success: true, filePath: destination, timestamp };
  } catch (err) {
    console.error('Failed to create backup.', err);
    return { success: false, message: 'Failed to create backup.' };
  }
});

ipcMain.handle('backup:import', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Import backup',
    buttonLabel: 'Import',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });

  if (result.canceled || !result.filePaths?.length) {
    return { canceled: true };
  }

  const filePath = result.filePaths[0];
  try {
    const raw = await fsp.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    await saveUserData(parsed);
    const normalized = await ensureUserDataFile();
    const currentUserDataPath = await resolveUserDataPath();
    return {
      canceled: false,
      success: true,
      userData: normalized,
      paths: {
        currentUserDataPath,
        defaultUserDataPath: DEFAULT_USER_DATA_PATH
      },
      storage: normalized.storage || {}
    };
  } catch (err) {
    console.error('Failed to import backup.', err);
    return { canceled: false, success: false, message: 'The selected file is not a valid backup.' };
  }
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
