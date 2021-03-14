class TextField extends Component
{
    constructor(value)
    {
        super();
        this.name = "textfield"
        this.value = value;
    }

    render()
    {
        let body = document.getElementById("main");
        let txtf = document.createElement("span");
        txtf.innerText = this.value;
        body.appendChild(txtf);
    }
}