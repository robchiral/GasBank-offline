const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('gasbank', {
  loadData: () => ipcRenderer.invoke('data:load'),
  saveUserData: (data) => ipcRenderer.invoke('data:saveUserData', data),
  resetAllProgress: () => ipcRenderer.invoke('data:resetAll'),
  importQuestions: () => ipcRenderer.invoke('dialog:importQuestions'),
  exportCustomQuestions: (payload) => ipcRenderer.invoke('dialog:exportQuestions', payload),
  getStoragePaths: () => ipcRenderer.invoke('settings:getPaths'),
  chooseUserDataDirectory: () => ipcRenderer.invoke('settings:chooseUserDataDirectory'),
  updateUserDataPath: (options) => ipcRenderer.invoke('settings:updateUserDataPath', options),
  setCustomImageDirectory: (directory) => ipcRenderer.invoke('settings:setCustomImageDirectory', directory),
  chooseBackupDirectory: () => ipcRenderer.invoke('settings:chooseBackupDirectory'),
  createBackup: (options) => ipcRenderer.invoke('backup:create', options),
  importBackup: () => ipcRenderer.invoke('backup:import')
});
