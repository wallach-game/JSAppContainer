'use strict';
import CWindow from './CoreObjects/CWindow.js';

console.log('Core Loaded');

CWindow.MainWindow = window;

var win = new CWindow("1",true,"");
win.CloseWindow();


//comment this out when u dont wanna new windows after saving
window.close();




