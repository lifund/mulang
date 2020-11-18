const fs = require('fs');
module.exports = class Mulang {

    // [ help() ] STARTS
    static help = () => {
        console.log("Documentation : https://github.com/lifund/mulang");
    }; // ENDOF [ help () ]

    
    // [ Initiation ] STARTS
    constructor({sourceHtml='',targetJson='',sourceHtmlPath='',targetJsonPath='',documentMode="html",parseMode="class",insertMode="prepend"}){
        // Parse modes.
        this.documentMode = documentMode;
        this.parseMode = parseMode;
        this.insertMode = insertMode;
        // Files.
        /*if(sourceHtmlPath!=''){
            this.sourceHtml = fs.readFileSync(sourceHtmlPath,'utf-8');
        }else{
        }

        if(targetJsonPath!=''){
            this.jsonFile = fs.readFileSync(targetJsonPath,'utf-8');
            this.targetJson = JSON.parse(this.jsonFile);
        }else{
        }*/
        
        this.htmlString = sourceHtml;
        this.targetJson = targetJson;
        this.htmlString = this.sourceHtml.replace(/\s+/g,' ');

        // Critical values.
        this.index = undefined;
        this.range = undefined;
    }; // ENDOF [ Initiation ]


    // [ Parse mode setters ] STARTS
    setDocumentMode(documentMode) { this.documentMode = documentMode; }
    setParseMode(parseMode) { this.parseMode = parseMode; }
    setInsertMode(insertMode) { this.insertMode = insertMode; }
    // ENDOF [ Parse mode setters ]
    
    
    // [ find Insert Index ] STARTS
    /** # Find tag m__'s name and position to insert html string. */
    findInsertIndex = () => 
    {
        const htmlString = this.htmlString

        // Stat Variables used in parsing.
        let stat_m = false; // m__
        let stat_name = false; // if tag name found
        // temporary variables to save found values while a parser lifecycle.
        let temp_name;
        let index_start;
        // result array
        let index = [];
        
        // Iterate char by char in the HTML String.
        for(let i=0; i<htmlString.length; i++){
            // Search char by char for a tag m__
            if(stat_m==false && htmlString[i]=='m'){
                if(htmlString[i+1]=='_' && htmlString[i+2]=='_'){
                    stat_m = true;
                    i += 3;
                    index_start = i;
                }
            } 
            // if tag m__ is found,
            if(stat_m==true){
                // find the name of the tag.
                // (comes: next to the tag m__)
                // (ends: befor the empty space or a quote)
                // Set stat_name tag to true, assign found name to temp_name,
                // continue iteration to find the position.
                if(stat_name==false && htmlString[i].match(/\"|\'|\s/)) {
                    stat_name = true;
                    temp_name = htmlString.slice(index_start,i);
                }
                // find the position to insert html String
                // (comes: after the mtag's name, right next to the char >)
                // Add to the result array, reset stat bools to find the next one.
                if(stat_name && htmlString[i]=='>') {
                    index.push({position: i+1, name: temp_name})
                    stat_m = false;
                    stat_name = false;
                }
            }
        }
        return index
    }; // ENDOF [ find Insert Index ]


    // [ rangify Index ] STARTS
    /** # Mulang.rangifyIndex()
     * > Converts this.index into cascading range.
     * ```js
     * returns { sliceStart, sliceEnd, name }
     * sliceStart (int) | // n-1'th position (if -1, 0)
     * sliceEnd (int) | // n'th position (if overflow, htmlStirng.length)
     * name (String) | // name
     * ``` */
    rangifyIndex = (index) =>{
        let result = []
        
        // from (0)
        result[0] = {
            sliceStart: 0,
            sliceEnd: index[0].position,
            name: index[0].name 
        }
        // all between
        for(let i=1;i<index.length;i++){
            result[i] = {
                sliceStart: index[i-1].position,
                sliceEnd: index[i].position,
                name: index[i].name 
            }
        }
        // to End (html.length -1)
        result[index.length] = {
            sliceStart: index[index.length-1].position,
            sliceEnd: this.htmlString.length,
            name: ''
        }
        return result
    }; // ENDOF [ rangify Index ]


    // [ render ] STARTS
    /** # Mulang.render()
     * > Renders html data into multiple files with different language based on JSON data */
    render(){
        let result = {};
        const index = this.findInsertIndex();
        const range = this.rangifyIndex(index);
        if(this.targetJson.meta.linebreak == '<br>'){
            this.targetJson.meta.languages.forEach(lang => {
                let html = '';
                for(let i=0; i<range.length; i++){
                    if(this.targetJson.contents[range[i].name]){
                        html += this.htmlString.slice(range[i].sliceStart,range[i].sliceEnd) +this.targetJson.contents[range[i].name][lang] ; 
                    } else {
                        html += this.htmlString.slice(range[i].sliceStart,range[i].sliceEnd)
                    }
                }
                result[lang] = html;
            });
        }
        return result
    }; // ENDOF [ render ]


    // [ writeFile ] STARTS
    writeFile(){
    }; // ENDOF [ writeFile ]


}