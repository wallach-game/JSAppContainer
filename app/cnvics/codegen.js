const fs = require('fs');
const path = require('path');

fs.readFile(process.argv[2], 'utf8', (err, data) => {
    if (err) {
        // console.error(err);
        return;
    }
    parseInput(data);
});

var xml = "";
var counter = 1;
var max = 0;

function parseInput(icons)
{
    let arr = icons.split("\n")
    max = arr.length;
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        let filename = path.basename(element);
        fs.readFile(element, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            appendCode(data, filename);
        });
    }
}

function appendCode(string, filename)
{

 
// String to be added
let stringToAdd = `class="icon ${filename}"`;
 
// Position to add string
let indexPosition = 41;
 
// Using slice method to split string
newString = string.slice(0, indexPosition)
        + stringToAdd + string.slice(indexPosition);



    xml = xml.concat(newString);
    counter++;
    if(max==counter)
    {
        FileCnv();
    }
}



function FileCnv() {
    fs.appendFile("./code.html", xml, function (err) {
        
        if (err) throw err;
        // console.log('Saved!');
        console.log(xml);
    });
}
