console.log("Loader Load Begin Here");
class Loader{
    static LoadClass(path)
    {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = path;
        document.getElementById('_').appendChild(script);
    }
}