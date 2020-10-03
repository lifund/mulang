# mulang
A simple, multi-language HTML renderer.

## Description
> When writing a text content of multiple HTML documents with different languages, editing element by element is a pain in the ass. 
> Mulang helps you to render multiple HTML files simultaneously with a single JSON file.

## why mulang?
1. Cleaner structure for your multi-language projects.
2. Easy to bind with popular frameworks.
3. Easy to edit contents for non-coders.

---

# Documentation

## Initiation
When initiating, you have to 
```js
let mulang = new Mulang({
    // You can pass HTML String and JSON Object directly.  
    sourceHtml='<!DOCTYPE html> ···',targetJson='{m__foo: "text content"}',
    // Or pass file path for HTML and JSON file.
    sourceHtmlPath='/path/to/file',targetJsonPath='/path/to/file',
    
    // One of path/file must be provided. If both provided, HTML String and JSON Object will be used.

    // ( under update below, not effective yet. Do not edit. )
    documentMode="html",parseMode="class",insertMode="prepend"
});
```

## Renderf
Simple!
Execute render function, get a result with JSON!
```js
const result = mulang.render();

// { "eng":"<!DOCTYPE html> ···", "kor":"<!DOCTYPE html> ···" }

if(req.body.lang == 'eng') res.send(result.eng);
if(req.body.lang == 'kor') res.send(result.kor);
```

---
## Data processing example.
### Source HTML
```html
<h1 class="m__landing_title"></h1>
```
### Target JSON
```json
{ "landing_title": "Hello World!" }
```
### Result (String)
```html 
<h1 class="m__landing_title">Hello World!</h1>
```

---
\- Coming Soon \-
**Mulang Interactive** | JSON editor for non-coder. GUI provided on a browser. HTML file is rendered interactively.

---
## How to write a target JSON files
### "meta" includes
1. "languages" - An array of language names (ordered).
2. "linebreak" - A linebreak tag inside an HTML 3. String. (dafalut = ).
3. "updateHistory" - (only for mulang interactive)

### "contents" includes
1. "mulang tag" - A tag name without m__ prefix.
```json
{
    "meta":
    {
        "languages": ["eng","kor"],
        "linebreak": "<br>",
    },
    "contents":
    {
        "section_1_title": ["title","제목"],
        "section_1_description_1": ["single line","한 줄"],
        "section_1_description_2": ["line1<br>line2","줄1<br>줄2"]
    },
    // added automatically by mulang interactive
    "updateHistory": 
    //[
    //    {"user": "admin", "time": "2020-09-26 01:04:00", "comment":"first commit", "contents": ""}
    //]
}
```