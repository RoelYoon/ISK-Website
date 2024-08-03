var address=window.location.href;
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
/*
function displayArticle(article){
    var a = document.createElement('a');            
    var link = document.createTextNode(article.title);
    a.appendChild(link); 
    a.title = article.title; 
    a.href = `${address}articleHTML?id=${article.id}`;
    document.body.appendChild(a); 
}*/
function displayArticle(sub, article){
    var card = document.createElement('div');
    card.classList.add("card");

    var cardImage = document.createElement("img");
    cardImage.classList.add("cardImage");
    cardImage.src = article.img;
    card.appendChild(cardImage);
    var cardTitle = document.createElement("div");
    cardTitle.classList.add("cardTitle");

    var a = document.createElement('a');            
    var link = document.createTextNode(article.title);
    a.appendChild(link); 
    a.title = article.title; 
    a.href = `${address}articleHTML?id=${article.id}`;

    cardTitle.appendChild(a);
    card.appendChild(cardTitle);
    sub.appendChild(card);
}
/*
<div class="cards" id="latest">
<div class="card" id="l1">
    <img class="cardImage" id="lp1">
    <div class="cardTitle" id="lt1">
    </div>
</div>
</div>
*/
httpGetAsync(`${address}article`,(res)=>{
    var js = JSON.parse(res);
    js.sort(function(a,b){
        var yearA = parseInt(a.date.substring(a.date.length-4));
        var yearB = parseInt(b.date.substring(b.date.length-4));
        if(yearA==yearB){
            var monthA = monthMap[a.date.substring(0,3).toLowerCase()];
            var monthB = monthMap[b.date.substring(0,3).toLowerCase()];
            if(monthA==monthB){
                var dayA = parseInt(a.date.match(/ (.*),/)[1]);
                var dayB = parseInt(b.date.match(/ (.*),/)[1]);
                return dayA > dayB ? -1 : 1;
            }else{
                return monthA > monthB ? -1 : 1;
            }
        }else{
            return yearA > yearB ? -1 : 1;
        }
    })
    //latest
    for(var i = 0; i < Math.min(js.length,10); i++){
        displayArticle(document.querySelector("#latest"),js[i]);
    }
    //popular
    js.sort(function(a,b){
        return a.views > b.views ? -1 : 1;
    })
    for(var i = 0; i < Math.min(js.length,10); i++){
        displayArticle(document.querySelector("#popular"),js[i]);
    }
});