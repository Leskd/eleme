'use strict';
// 引入electron
// var electron = require('electron');
// var app = electron.app;
// // 应用窗口的创建与控制
// var BrowserWindow = electron.BrowserWindow;
// var Menu = electron.Menu;
import {app, BrowserWindow, Menu} from 'electron';
import path from 'path';
import autoUpdaterController from './auto-updater';


var menuTemplates = require('./menus')


// 指向窗口对象的一个全局引用，如果没有这个引用，那么当该javascript对象被垃圾回收的
// 时候该窗口将会自动关闭
var mainWindow = null;
function creatWindow(){
    mainWindow =new BrowserWindow({
        width:800,
        height:600,
    });
    
    // 装载 index.html 页面
    if (process.env.NODE_ENV === 'development') {
      mainWindow.loadURL('http://localhost:8080/#/goods')
    } else {
      let path = path.resolve(__dirname, 'public');
      mainWindow.loadURL(`file://${path}/index.html`);
    }

    if (process.platform === 'darwin') {
      let template = menuTemplates.mac(mainWindow);
      let menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    } else {
      let template = menuTemplates.other(mainWindow);
      let menu = Menu.buildFromTemplate(template);
      mainWindow.setMenu(menu);
    }

    // 打开开发工具页
    mainWindow.webContents.openDevTools();
     // 当窗口关闭时调用的方法 
     mainWindow.on('closed',function(){
         mainWindow = null;
         console.log('closed!');
     })

     autoUpdaterController.setMainWindow(mainWindow);
     autoUpdaterController.checkForUpdates();
}
// 当Electron完成初始化并且已经创建了浏览器窗口，则该方法将会被调用。
app.on('ready', creatWindow);

// 当所有的窗口被关闭后退出应用
app.on('window-all-closed', function() {
  // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  // 对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他
  // 窗口打开
  if (win === null) {
    createWindow();
  }
});

autoUpdaterController