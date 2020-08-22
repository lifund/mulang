module.exports = class mulang {
    constructor(){
    }
    help(){
        console.log("Documentation : https://github.com/lifund/mulang");
    }
    render(jsonFile, htmlFile){
        if(jsonFile===undefined||htmlFile===undefined){
            throw Error("missing file to render")
        }
    }
}