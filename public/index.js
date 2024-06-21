function uploadArticle(){
    var a = document.createElement('a');               
    var link = document.createTextNode("This is link");
    a.appendChild(link); 
    a.title = "This is Link"; 
    a.href = "https://www.geeksforgeeks.org"; 
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
    console.log(res.body.img);
});
