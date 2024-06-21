function convertContent(content){
    var result = "";
    var p = 0;
    while(p<content.length){
    console.log(content.substring(p++));
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