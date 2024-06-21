var template = `
<!DOCTYPE html>
<html>
    <head>
        <title>ISK Website</title>
        <link rel="stylesheet" href="/styles.css"/>
    </head>
    <body>
    </body>
</html>
`
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
            <h4>${article.date}<h4>f
            <br>
            <img src=${article.img}>
            <br>
            <p>${article.content}<p>
        </body>
    </html>
    `;
    return html;
}

module.exports = {
    convert: (article) => convert(article)
};