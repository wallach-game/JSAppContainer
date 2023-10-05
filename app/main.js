// const buttons = document.querySelectorAll('mdc-button'); 
// for (const button of buttons) 
// { 
//     mdc.ripple.MDCRipple.attachTo(button); 
// }
// // This will add a ripple to all of the buttons.

// // const buttons = document.querySelectorAll('.mdc-button');
// // for (const button of buttons) {
// //   mdc.ripple.MDCRipple.attachTo(button);
// // }

// [class*="mybuttons-button"] partial class search


function input()
{
    search = document.getElementsByClassName('nameInput')[0].value;
    
    if(search.length == 0){
        els = document.querySelectorAll(".icon");
        for (var i=0; i < els.length; i++) {
            console.log(els.length);
            els[i].setAttribute("style", "");
        }
    
    }

    if(search.length > 0)
    {
        els = document.querySelectorAll(".icon");
        for (var i=0; i < els.length; i++) {
            els[i].setAttribute("style", "display: none");
        }
        els = document.querySelectorAll('[class*="'+search+'"]');
        for (var i=0; i < els.length; i++) {
            els[i].setAttribute("style", "");
        }
    }
}



function loadIcons() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            document.querySelector(".icons").innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("GET", "./cnvics/code.html", true);
    xhttp.send();
}


loadIcons();