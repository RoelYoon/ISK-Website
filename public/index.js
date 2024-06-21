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
document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        httpGetAsync("http://35.203.145.230:8099/articles",(res)=>{
            var js = JSON.parse(res);
            console.log(js);
            for(var i = 0; i < js.length; i++){
                console.log(js[i]);
                displayArticle(js[i]);
                document.write("<br>");
            }
        });
    }
  };