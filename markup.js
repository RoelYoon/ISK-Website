require('dotenv').config()
function convertContent(content){
    var result = "";
    var p = 0;
    var stack = [];
    const keywords = ['#bf{','#it{','#ref{','#html{','#img{','{','###','}']
    const idMap = new Map([
        ['#bf{', 0], 
        ['#it{', 1],
        ['#ref{', 2], 
        ['#html{', 3],
        ['#img{', 4], 
        ['{', 5],
        ['###',6],
        ['}', 7]
    ]);
    const open = new Map([
        [0,'<strong>'], 
        [1,'<em>'],
        [2,'<a href=\''], 
        [3,''],
        [4,'<img src=\''], 
        [5,''],
        [6,'<br>'],
        [7,'']
    ]);
    const close = new Map([
        [0,'</strong>'], 
        [1,'</em>'],
        [2,'\'>'], 
        [3,''],
        [4,'\'/>'], 
        [5,'</a>'],
        [6,'X'],
        [7,'X']
    ]);
    while(p<content.length-1){
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
        var selected = content.substring(p,p+minInd);
        p+=minInd+type.length;
        result+=selected;
        if(type!='}'){
            var id = idMap.get(type);
            if(close.get(id)!='X'){
                stack.push(id);
            }
            result+=open.get(id);
        }else{
            var id = stack.pop();
            result+=close.get(id);
        }
    }
    while(stack.length>0){
        result+=close.get(stack.pop());
    }
    return result;
}
function docDataConvert(data){
    var html = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>ISK Website</title>
            <link rel="stylesheet" href="/styles.css"/>
            <link rel="icon" href="https://lh3.google.com/u/0/d/1kQsVUom3mBNpqu0e34rbcsGOJExYY4NI=s2048">
        </head>
        <body>
            <h1 id="title">${data.title}</h1>
            <h3 id="author">${data.author}</h3>
            <h4 id="date">${data.date}</h4>
            <img id="headImg" src=${data.img}>
            ${data.content}
            <div id="sidebar"></div>
            <nav id="navbar">
                <ul id="menu">
                    <li><a href="/">Home</a></li>
                    <li><a href="/authors.html">Authors</a></li>
                    <li class="has-submenu" id="categoryElement">
                        <a>Categories</a>
                        <ul id="category-menu">
                            <div id="hoverBox"></div>
                            <li><a href="/category/'business'">Business</a></li>
                            <li><a href="/category/'culture'">Culture</a></li>
                            <li><a href="/category/'entertainment'">Entertainment</a></li>
                            <li><a href="/category/'environment'">Environment</a></li>
                            <li><a href="/category/'kis'">KIS</a></li>
                            <li><a href="/category/'politics'">Politics</a></li>
                            <li><a href="/category/'science'">Science</a></li>
                            <li><a href="/category/'sports'">Sports</a></li>
                            <li><a href="/category/'technology'">Technology</a></li>
                        </ul>
                    </li>
                    <li><a href="/about.html">About Us</a></li>
                </ul>
            </nav>
        </body>
    </html>
    `;
    return html;
}
function categoryPage(articles){
    var articleCards = "";
    for(var i = 0; i < articles.length; i++){
        articleCards+=`
        <div class="card">
            <img class="cardImage" src=${articles[i].img}>
            <div class="cardTitle">
                <a href=${process.env.ADDRESS}articleHTML?id=${articles[i].id}>${articles[i].title}</a>
            </div>
        </div>`;
    }
    var html = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>ISK Website</title>
            <link rel="stylesheet" href="/styles.css"/>
            <link rel="icon" href="https://lh3.google.com/u/0/d/1kQsVUom3mBNpqu0e34rbcsGOJExYY4NI=s2048">
        </head>
        <body>
            <div id="sidebar"></div>
            <nav id="navbar">
                <ul id="menu">
                    <li><a href="/">Home</a></li>
                    <li><a href="/authors.html">Authors</a></li>
                    <li class="has-submenu" id="categoryElement">
                        <a>Categories</a>
                        <ul id="category-menu">
                            <li><a href="/category/'business'">Business</a></li>
                            <li><a href="/category/'culture'">Culture</a></li>
                            <li><a href="/category/'entertainment'">Entertainment</a></li>
                            <li><a href="/category/'environment'">Environment</a></li>
                            <li><a href="/category/'kis'">KIS</a></li>
                            <li><a href="/category/'politics'">Politics</a></li>
                            <li><a href="/category/'science'">Science</a></li>
                            <li><a href="/category/'sports'">Sports</a></li>
                            <li><a href="/category/'technology'">Technology</a></li>
                        </ul>
                    </li>
                    <li><a href="/about.html">About Us</a></li>
                </ul>
            </nav>
            <div class="cards" id="articles">
                ${articleCards}
            </div>
        </body>
    </html>
    `;
    return html;
}
module.exports = {
    convert: (article) => convert(article),
    docDataConvert: (data) => docDataConvert(data),
    categoryPage: (articles) => categoryPage(articles)
};