function displayArticle(article){
    var a = document.createElement('a');            
    var link = document.createTextNode(article.title);
    a.appendChild(link); 
    a.title = article.title; 
    a.href = article.img; 
    document.body.appendChild(a); 
}
function httpGetAsync(theUrl, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.response);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);

}
httpGetAsync("http://35.203.145.230:8099/articles",(res)=>{
    var js = JSON.parse(res);
    for(var i = 0; i < js.length; i++){
        displayArticle(js[i]);
        document.write("<br>");
    }
});
