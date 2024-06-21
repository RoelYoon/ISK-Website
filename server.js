const express = require("express");
const db = require('./db');
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname,"./public")));
app.use(express.static(path.join(__dirname,"./node_modules")));
app.use(express.urlencoded({
    extended: true
  }))
app.get("/",
async (req,res)=>{
    await res.sendFile(path.resolve(__dirname,"./public/index.html"));
})
var artCount = 0;
app.get('/articles', async (req, res) => {
    try {
        if(!req.query.id){
            const result = await db.query('SELECT * FROM article');
            res.json(result.rows);
        }else{
            const result = await db.query(`SELECT * FROM article WHERE id=${req.query.id}`)
            res.json(result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/upload",
 async (req,res)=>{
    try{
        await db.query('INSERT INTO article (title, author, date, img, category, content) VALUES ($1,$2,$3,$4,$5,$6)',[req.body.title,req.body.author,req.body.date,req.body.img,req.body.category,req.body.content]);
        res.redirect("http://35.203.145.230:8099/");
    }catch (err){
        console.error(err);
        res.statusMessage(500).send('Internal Server Error');
    }
}
)
app.all('*',(req,res)=>{
    res.send("<h1>404 boiii</h1>").status(404);
});
app.listen(8099, "10.138.0.2", ()=>{console.log("Listening at IP 35.203.145.230 port 8099")});