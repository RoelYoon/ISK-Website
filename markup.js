function convertContent(content){
    var result = "";
    var p = 0;
    var stack = [];
    const keywords = ['#bf{','#it{','#ref{','#GDimg{','#img{','{','}']
    const idMap = new Map([
        ['#bf{', 0], 
        ['#it{', 1],
        ['#ref{', 2], 
        ['#GDimg{', 3],
        ['#img{', 4], 
        ['{', 5],
        ['}', 6],
    ]);
    const open = new Map([
        [0,'<strong>'], 
        [1,'<em>'],
        [2,'<a href=\''], 
        [3,''],
        [4,'<img src=\''], 
        [5,''],
        [6,''],
    ]);
    const close = new Map([
        [0,'</strong>'], 
        [1,'</em>'],
        [2,'>'], 
        [3,''],
        [4,'/>'], 
        [5,'</a>'],
        [6,''],
    ]);
    while(p<content.length){
        var c = content.substring(p);
        var minInd = 1000000000;
        var type = "";
        for(var i = 0; i < keywords.length; i++){
            var ind = c.search(keywords[i]);
            if(ind!=-1 && ind < minInd){
                minInd=ind;
                type=keywords[i];
            }
        }
        if(type==""){
            result+=c;
            break;
        }
        var selected = content.substring(p+type.length,minInd+1);
        result+=selected;
        if(type!='}'){
            var id = idMap.get(type);
            stack.push(id);
            result+=open.get(id);
        }else{
            var id = stack.pop();
            result+=close.get(id);
        }
    }
    return result;
}
function convert(article){
    var html = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>ISK Website</title>
            <link rel="stylesheet" href="/styles.css"/>
        </head>
        <body>
            <h1>${article.title}</h1>
            <h3>${article.author}<h3>
            <h4>${article.date}<h4>
            <br>
            <img src=${article.img}>
            <br>
            <p>${convertContent(article.content)}<p>
        </body>
    </html>
    `;
    return html;
}

module.exports = {
    convert: (article) => convert(article)
};