const fs = require('fs');
const Path = require('path');

fs.readFile(process.argv[2], 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    parseInput(data);
});

function parseInput(icons)
{
    let arr = icons.split("\n");
    // console.log(arr);
        

    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        // console.log(element);
        let filename = Path.basename(element);
        filename = filename.slice(0,-4);
        filename += ".svg"
        // console.log(filename);
        fs.readFile(element, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            FileCnv(data, filename);
        });
    }
}

// nahradit process.argv[2] cestou k souboru 



function FileCnv(text, filename) {
    let xml = text;
    xml = xml.replaceAll("vector", "svg");
    xml = xml.replaceAll("android:pathData", "d");
    xml = xml.replaceAll("android:fillColor", "fill");
    xml = xml.replaceAll('android:tint="?attr/colorControlNormal"', "");
    xml = xml.replace('android:viewportWidth="24"', "viewport='0 0 512 512'");
    xml = xml.replace('android:viewportHeight="24"', "");
    xml = xml.replace('android:viewportWidth="20"', "viewport='0 0 512 512'");
    xml = xml.replace('android:viewportHeight="20"', "");
    xml = xml.replace('android:viewportWidth="36"', "viewport='0 0 512 512'");
    xml = xml.replace('android:viewportHeight="36"', "");
    xml = xml.replace('android:viewportWidth="18"', "viewport='0 0 512 512'");
    xml = xml.replace('android:viewportHeight="18"', "");
    xml = xml.replace('android:height="24dp"', "heigth='512'");
    xml = xml.replace('android:width="24dp"', "width='512'");
    xml = xml.replace('android:height="20dp"', "heigth='512'");
    xml = xml.replace('android:width="20dp"', "width='512'");
    xml = xml.replace('android:height="36dp"', "heigth='512'");
    xml = xml.replace('android:width="36dp"', "width='512'");
    xml = xml.replace('android:height="18dp"', "heigth='512'");
    xml = xml.replace('android:width="18dp"', "width='512'");
    xml = xml.replaceAll('@android:color/white', "currentColor");
    xml = xml.replace('xmlns:android="http://schemas.android.com/apk/res/android"', 'xmlns="http://www.w3.org/2000/svg"');

    fs.appendFile("./cnvics/"+ filename, xml, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

