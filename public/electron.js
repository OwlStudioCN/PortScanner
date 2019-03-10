const electron = require('electron');

const { app, Menu, shell } = electron;
const { BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');
const debug = require('electron-debug');

debug();

let mainWindow;
//
// require("update-electron-app")({
//   repo: "kitze/react-electron-example",
//   updateInterval: "1 hour"
// });

function createWindow() {
  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 500,
    width: 900,
    height: 680,
    titleBarStyle: 'hiddenInset',
  });
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  );
  mainWindow.on('closed', () => (mainWindow = null));
}

// eslint-disable-next-line no-shadow
const getMenu = (app, shell) => {
  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (function() {
            if (process.platform === 'darwin') return 'Ctrl+Command+F';
            return 'F11';
          })(),
          click(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform === 'darwin') return 'Alt+Command+I';
            return 'Ctrl+Shift+I';
          })(),
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.toggleDevTools();
          },
        },
      ],
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize',
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close',
        },
      ],
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://github.com/OwlStudioCN/PortScanner');
          },
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: `About ${name}`,
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          label: 'Services',
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: `Hide ${name}`,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers',
        },
        {
          label: 'Show All',
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() {
            app.quit();
          },
        },
      ],
    });
    const windowMenu = template.find(function(m) {
      return m.role === 'window';
    });
    if (windowMenu) {
      windowMenu.submenu.push(
        {
          type: 'separator',
        },
        {
          label: 'Bring All to Front',
          role: 'front',
        },
      );
    }
  }

  return template;
};
function createMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenu(app, shell)));
}

app.on('ready', () => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
