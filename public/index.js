var address=window.location.href;
console.log(address);
function displayArticle(article){
    var a = document.createElement('a');            
    var link = document.createTextNode(article.title);
    a.appendChild(link); 
    a.title = article.title; 
    a.href = `${address}/articles?id=${article.id}`;
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
httpGetAsync(`${address}/articles`,(res)=>{
    var js = JSON.parse(res);
    js.sort(function(a,b){
        var yearA = parseInt(a.date.substring(0,4));
        var yearB = parseInt(b.date.substring(0,4));
        if(yearA==yearB){
            var monthA = parseInt(a.date.substring(5,7));
            var monthB = parseInt(b.date.substring(5,7));
            if(monthA==monthB){
                var dayA = parseInt(a.date.substring(8,10));
                var dayB = parseInt(b.date.substring(8,10));
                return dayA > dayB ? 1 : -1;
            }else{
                return monthA > monthB ? 1 : -1;
            }
        }else{
            console.log(yearA<yearB);
            return yearA > yearB ? 1 : -1;
        }
    })
    console.log(js);
    for(var i = 0; i < js.length; i++){
        displayArticle(js[i]);
        document.body.appendChild(document.createElement("br"));
    }
});