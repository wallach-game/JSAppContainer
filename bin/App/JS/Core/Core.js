'use strict';
import CWindow from './CoreObjects/CWindow.js';

console.log('Core Loaded');

CWindow.MainWindow = window;


var win = new CWindow("test","https://instagram.com",true);
//win.CloseWindow();



//comment this out when u dont wanna new windows after saving
//CWindow.MainWindow.close();
//window.close();






console.log("test");






