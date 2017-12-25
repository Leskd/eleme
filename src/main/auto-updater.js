import { autoUpdater } from 'electron-updater';
import { ipcMain, BrowserWindow, Menu } from 'electron';
import path from 'path';
import _ from 'lodash';
import request from 'request-promise';
import { version } from '../../package.json';
import B from 'bluebird';
import settings from '../settings'

const isDev = process.env.NODE_ENV === 'development';
autoUpdater.autoDownload = false;

// 模拟升级
if (process.env.NODE_ENV === 'development') {
  let {forceFail, updateAvailable} = require('./mock-updater');
  // 假设升级失败
  console.log(11111111111)
  console.log(process.env.MOCK_AUTO_UPDATER)
  if (process.env.MOCK_FAILED_UPDATE) {
    forceFail();
  }

  // 假设可以升级
  if(process.env.MOCK_AUTO_UPDATER) {
    console.log(22222)
    updateAvailable();
  }
}

class AutoUpdaterController {
  constructor () {
    this.updaterWin = null;
    this.state = {};
    
    autoUpdater.on('update-available', this.handleUpdateAvailable.bind(this))
    autoUpdater.on('update-not-available', this.handleUpdateNotAvailable.bind(this));
    autoUpdater.on('checking-for-update', this.handleCheckingForUpdate.bind(this));
    autoUpdater.on('download-progress', this.handleDownloadProgress.bind(this));
    autoUpdater.on('update-downloaded', this.handleUpdateDownloaded.bind(this));
    autoUpdater.on('error', this.handleError.bind(this));

    ipcMain.on('update-state-request', (e)=> e.sender.send('update-state-change', this.state));
    ipcMain.on('update-download', this.downloadUpdate.bind(this));
    ipcMain.on('update-quit-and-install', autoUpdater.quitAndInstall || _.noop);
  }

  setMainWindow (mainWindow) {
    this.mainWindow = mainWindow;
  }

  downloadUpdate () {
    this.updaterWin.setSize(500, 150);
    this.setSate({
      downloadProgress: {
        percent:0
      }
    });
    autoUpdater.downloadUpdate && autoUpdater.downloadUpdate();
  }

  
  async handleUpdateAvailable (updateInfo) {
    console.log('Found update', updateInfo);
    let releaseNotes;
    try {
      let url = ``;
      let userAgent = 'electron';
      releaseNotes = JSON.parse(await request({url, headers: {'User-Agent': userAgent}}))
    } catch (err) {
      console.log(err)
    }

    this.openUpdaterWindow(this.mainWindow);
    this.forceFocus();
    this.setState({
      hasUpdateAvailable: true,
      updateInfo,
      releaseNotes,
    });
  }

  handleUpdateNotAvailable () {
    console.info('No update available');
    this.setState({
      hasNoUpdateAvailable: true,
    });
  }

  handleCheckingForUpdate () {
    console.info('Looking for updates');
    this.setState({
      checkingForUpdate: true,
    });
  }

  handleDownloadProgress (downloadProgress) {
    console.info('Downloading...', downloadProgress);
    this.setState({
      downloadProgress
    });
  }

  handleUpdateDownloaded (updateInfo) {
    console.info('Download complete', updateInfo);
    // Focus on window when the download is done to get the user's attention
    this.forceFocus();
    this.setState({
      updateDownloaded: true,
      updateInfo,
    });
  }

  handleError (error) {
    console.info('Updater error occurred', error);
    this.updaterWin.setSize(500, 125);
    this.setState({
      error,
    });
  }

  // 窗口聚焦
  forceFocus () {
    if (this.updaterWin) {
      this.updaterWin.focus();
    }
  }


  async checkForUpdates () {
    const isWin = process.platform === 'win32';
    const isMac = process.platform === 'darwin';
    const SQUIRREL_FIRST_RUN = 'SQUIRREL_FIRST_RUN';

    if (isMac || isWin) {
      console.info('Checking for updates');

      if (isWin && !await settings.get(SQUIRREL_FIRST_RUN)) {
        await B.delay(20000);
        await settings.set(SQUIRREL_FIRST_RUN, true);
      }
      this.setState({
        isCheckingForUpdates: true,
      })

      autoUpdater.checkForUpdates();
    } else {
      this.setState({
        unsupported: true,
      });
    }
  }

  setState (newSate) {
    this.state = {...newSate};
    if (this.updaterWin) {
      this.updaterWin.send('update-state-change', this.state);
    }
  }

  openUpdaterWindow (mainWindow) {
    let updaterWin = this.updaterWin;
    if (updaterWin) {
      return;
    }

    this.updaterWin = updaterWin = new BrowserWindow({
      width: 550, 
      height: 250, 
      title: "Update Available", 
      backgroundColor: "#f2f2f2", 
      webPreferences: {
        devTools: true
      },
      resizable: false,
    })

    // let updaterHTMLPath = path.resolve(__dirname, isDev ? '..' : 'src', '', 'index.html');
    // updaterHTMLPath = updaterHTMLPath.replace("\\", "/");
    // updaterHTMLPath += '#/updater';
    // updaterWin.loadURL(`file://${updaterHTMLPath}`);
    updaterWin.show();

    updaterWin.once('closed', () => {
      this.updaterWin = null;
    });
    updaterWin.openDevTools();

    updaterWin.webContents.on('context-menu', (e, props) => {
      const {x, y} = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click () {
          updaterWin.inspectElement(x, y);
        }
      }]).popup(updaterWin);
    });

    mainWindow.on('closed', updaterWin.close);
  }
}

let autoUpdaterInstance = new AutoUpdaterController();
export default autoUpdaterInstance;





