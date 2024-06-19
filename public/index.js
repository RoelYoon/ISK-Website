function uploadArticle(){
    var a = document.createElement('a');               
    var link = document.createTextNode("This is link");
    a.appendChild(link); 
    a.title = "This is Link"; 
    a.href = "https://www.geeksforgeeks.org"; 
    document.body.appendChild(a); 
}