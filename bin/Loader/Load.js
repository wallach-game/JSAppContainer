//Load Configuration 
//TODO: App Configuration
params = 
'location=yes'+
',height=570'+
',width=520'+
',scrollbars=yes'+
',status=yes';

//Create new container window
window.open('./App/HTML/main_container.html','_blank',params);

//Close loader
window.close();
window.close();

//chrome only
var customWindow = window.open('', '_blank', '');
    customWindow.close();