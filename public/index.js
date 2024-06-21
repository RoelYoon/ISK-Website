function displayArticle(article){
    var a = document.createElement('a');            
    var link = document.createTextNode(article.title);
    a.appendChild(link); 
    a.title = article.title; 
    a.href = "http://35.203.145.230:8099/articles?id="+article.id; 
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
    console.log(js[0].date);
    console.log(parseInt(js[0].date.substring(0,4)));
    console.log(parseInt(js[0].date.substring(5,2)));
    console.log(parseInt(js[0].date.substring(8,2)));
    for(var i = 0; i < js.length; i++){
        displayArticle(js[i]);
        document.body.appendChild(document.createElement("br"));
    }
});