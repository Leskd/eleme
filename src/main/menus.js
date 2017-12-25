
import autoUpdater from './auto-updater';

let menuTemplates = {mac: {}, other: {}};

function menuFile(mainWindow) {
  let fileSubmenu = [{
    label: '&Open',
    accelerator: 'Ctrl+O'
  }, {
    label: '&Check update',
    click () {
      autoUpdater.openUpdaterWindow(mainWindow);
      autoUpdater.checkForUpdates();
    }
  }, {
    type: 'separator'
  }, {
    label: '&New Session Window...',
    accelerator: 'Ctrl+N',
    click () {
      console.log('New Session Window')
    }
  }, {
    label: '&Close',
    accelerator: 'Ctrl+W',
    click () {
      mainWindow.close();
    }
  }];

  return {
    label: '&File',
    submenu: fileSubmenu,
  }
}

function otherMenuView (mainWindow) {
  return {
    label: '&View',
    submenu: (process.env.NODE_ENV === 'development') ? [{
      label: '&Reload',
      accelerator: 'Ctrl+R',
      click () {
        mainWindow.webContents.reload();
      }
    }, {
      label: 'Toggle &Full Screen',
      accelerator: 'F11',
      click () {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }, {
      label: 'Toggle &Developer Tools',
      accelerator: 'Alt+Ctrl+I',
      click () {
        mainWindow.toggleDevTools();
      }
    }] : [{
      label: 'Toggle &Full Screen',
      accelerator: 'F11',
      click () {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }]
  };
}

const otherMenuHelp = {
  label: 'Help',
  submenu: [{
    label: 'Learn More',
    click () {
      shell.openExternal('http://appium.io');
    }
  }, {
    label: 'Documentation',
    click () {
      shell.openExternal('https://appium.io/documentation.html');
    }
  }, {
    label: 'Search Issues',
    click () {
      shell.openExternal('https://github.com/appium/appium-desktop/issues');
    }
  }]
};

menuTemplates.other = (mainWindow) => [
  menuFile(mainWindow),
  otherMenuView(mainWindow),
  otherMenuHelp
]

module.exports = menuTemplates;