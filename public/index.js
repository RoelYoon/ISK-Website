var address=window.location.href;
function displayArticle(article){
    var a = document.createElement('a');            
    var link = document.createTextNode(article.title);
    a.appendChild(link); 
    a.title = article.title; 
    a.href = `${address}articleHTML?id=${article.id}`;
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
let monthMap = {
    "jan" : 1,
    "feb" : 2,
    "mar" : 3,
    "apr" : 4,
    "may" : 5,
    "jun" : 6,
    "jul" : 7,
    "aug" : 8,
    "sep" : 9,
    "oct" : 10,
    "nov" : 11,
    "dec" : 12
};
httpGetAsync(`${address}article`,(res)=>{
    var js = JSON.parse(res);
    js.sort(function(a,b){
        var monthA = monthMap[a.date.substring(0,3)];
        var dayA = parseInt(a.date.match(/ (.*),/)[1]);
        var yearA = parseInt(a.date.substring(a.date.length-4));
        var yearB = parseInt(b.date.substring(b.date.length-4));
        console.log(`${monthA}/${dayA}/${yearA}`)
        if(yearA==yearB){
            var monthA = monthMap[a.date.substring(0,3)];
            var monthB = monthMap[b.date.substring(0,3)];
            if(monthA==monthB){
                var dayA = parseInt(a.date.match(/ (.*),/)[1]);
                var dayB = parseInt(b.date.match(/ (.*),/)[1]);
                return dayA > dayB ? -1 : 1;
            }else{
                return monthA > monthB ? -1 : 1;
            }
        }else{
            console.log(yearA<yearB);
            return yearA > yearB ? -1 : 1;
        }
    })
    for(var i = 0; i < js.length; i++){
        displayArticle(js[i]);
        document.body.appendChild(document.createElement("br"));
    }
});