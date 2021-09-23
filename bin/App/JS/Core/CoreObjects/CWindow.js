'use strict';
// DOC
// Base window class, use it for storing aplication windows

export default class CWindow 
{
    static MainWindow = undefined;
    //dont use plain constructor
    constructor(title,url,spawn) {  
        if(spawn == null)
        {
            this.window.document.title = title;
            this.url = url;
        }
        if(spawn == true)
        {
            this.newWindowParams = 
            `location=yes
            ,height=570
            ,width=520
            ,scrollbars=yes
            ,status=yes`;
            console.log(CWindow.MainWindow);
            this.window = CWindow.MainWindow.open(url, "_blank", this.newWindowParams);
            this.window.document.title = title;
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