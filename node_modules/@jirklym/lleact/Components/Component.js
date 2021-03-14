/*
Copyright 2019@Jiri Korenek

Basic LLeact component
*/
console.log("Component Load");

class Component {

    constructor(id) {
        //paramaters creation
        this.name = "Component";
        this.element = "p";
        this.type = undefined;
        if (id != undefined) this.id = this.hashCode(Date.now() + "a") + id;
        else this.id = this.hashCode(Date.now() + "a");
    }

    //main render function
    render(self) {
        //for redrawing
    }

    create(self) {
        let p = document.createElement(self.element);
        p.id = self.id;
        p.type = self.type;
        p.innerText = "LLeact." + self.name;
        document.getElementById("_").appendChild(p);
    }

    //thanks @deekshith from gitHub for this hash func!
    hashCode(str) {
        return str.split("").reduce((prevHash, currVal) =>
            (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
    }
}