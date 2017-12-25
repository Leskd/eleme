/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _electron = __webpack_require__(1);

	var menuTemplates = __webpack_require__(2);

	var mainWindow = null;
	function creatWindow() {
	  mainWindow = new _electron.BrowserWindow({
	    width: 800,
	    height: 600
	  });

	  if (process.env.NODE_ENV === 'development') {
	    mainWindow.loadURL('http://localhost:8080/#/goods');
	  } else {
	    mainWindow.loadURL('file://' + __dirname + '/public/index.html');
	  }

	  if (process.platform === 'darwin') {
	    var template = menuTemplates.mac(mainWindow);
	    var menu = _electron.Menu.buildFromTemplate(template);
	    _electron.Menu.setApplicationMenu(menu);
	  } else {
	    var _template = menuTemplates.other(mainWindow);
	    var _menu = _electron.Menu.buildFromTemplate(_template);
	    mainWindow.setMenu(_menu);
	  }

	  mainWindow.webContents.openDevTools();

	  mainWindow.on('closed', function () {
	    mainWindow = null;
	    console.log('closed!');
	  });
	}

	_electron.app.on('ready', creatWindow);

	_electron.app.on('window-all-closed', function () {
	  if (process.platform !== 'darwin') {
	    _electron.app.quit();
	  }
	});
	_electron.app.on('activate', function () {
	  if (win === null) {
	    createWindow();
	  }
	});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = require("electron");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	var menuTemplates = { mac: {}, other: {} };

	function menuFile(mainWindow) {
	  var fileSubmenu = [{
	    label: '&Open',
	    accelerator: 'Ctrl+O'
	  }, {
	    label: '&Check update',
	    click: function click() {}
	  }, {
	    type: 'separator'
	  }, {
	    label: '&New Session Window...',
	    accelerator: 'Ctrl+N',
	    click: function click() {
	      console.log('New Session Window');
	    }
	  }, {
	    label: '&Close',
	    accelerator: 'Ctrl+W',
	    click: function click() {
	      mainWindow.close();
	    }
	  }];

	  return {
	    label: '&File',
	    submenu: fileSubmenu
	  };
	}

	function otherMenuView(mainWindow) {
	  return {
	    label: '&View',
	    submenu: process.env.NODE_ENV === 'development' ? [{
	      label: '&Reload',
	      accelerator: 'Ctrl+R',
	      click: function click() {
	        mainWindow.webContents.reload();
	      }
	    }, {
	      label: 'Toggle &Full Screen',
	      accelerator: 'F11',
	      click: function click() {
	        mainWindow.setFullScreen(!mainWindow.isFullScreen());
	      }
	    }, {
	      label: 'Toggle &Developer Tools',
	      accelerator: 'Alt+Ctrl+I',
	      click: function click() {
	        mainWindow.toggleDevTools();
	      }
	    }] : [{
	      label: 'Toggle &Full Screen',
	      accelerator: 'F11',
	      click: function click() {
	        mainWindow.setFullScreen(!mainWindow.isFullScreen());
	      }
	    }]
	  };
	}

	var otherMenuHelp = {
	  label: 'Help',
	  submenu: [{
	    label: 'Learn More',
	    click: function click() {
	      shell.openExternal('http://appium.io');
	    }
	  }, {
	    label: 'Documentation',
	    click: function click() {
	      shell.openExternal('https://appium.io/documentation.html');
	    }
	  }, {
	    label: 'Search Issues',
	    click: function click() {
	      shell.openExternal('https://github.com/appium/appium-desktop/issues');
	    }
	  }]
	};

	menuTemplates.other = function (mainWindow) {
	  return [menuFile(mainWindow), otherMenuView(mainWindow), otherMenuHelp];
	};

	module.exports = menuTemplates;

/***/ })
/******/ ]);