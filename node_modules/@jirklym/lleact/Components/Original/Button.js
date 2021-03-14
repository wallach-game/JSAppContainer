class Button extends Component {
    constructor(name,text) {
        super(name);
        this.text = text;
        this.name = "rand";
        this.element = "input";
        this.type = "submit";
    }

    render()
    {
        let body = document.getElementById("main");
        let btn = document.createElement("input");
        btn.setAttribute("type","submit");
        btn.setAttribute("value",this.text);
        body.appendChild(btn);
    }

    create(self) {
        let p = document.createElement(self.element);
        p.id = self.id;
        p.type = self.type;
        p.value = self.name;
        p.innerText = "LLeact." + self.name;
        document.getElementById("_").appendChild(p);
    }
}