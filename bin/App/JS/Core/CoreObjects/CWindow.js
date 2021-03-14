'use strict';
// DOC
// Base window class, use it for storing aplication windows

export default class CWindow 
{
    static MainWindow = undefined;
    //dont use plain constructor
    constructor(title,spawn,url) {   
        if(spawn)
        {
            this.window = CWindow.MainWindow.open(url, "_blank", "");
            this.window.document.title = title;
            this.url = url;
        }
        else
        {
            this.title = title;
            this.url = url;
        }
    }

    SpawnWindow()
    
    {
        this.window = CWindow.MainWindow.open(this.url, "_blank", "");
        this.window.document.title = this.title;
    }

    CloseWindow()
    {
            this.window.close();
    }
}