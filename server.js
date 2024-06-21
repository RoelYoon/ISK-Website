const express = require("express");
const db = require('./db');
const path = require("path");
require('dotenv').config()
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
app.get('/article', async (req, res) => {
    try {
        result="";
        if(req.query.id){
            result = await db.query(`SELECT * FROM article WHERE id=${req.query.id}`)
        }
        if(req.query.category){
            result = await db.query(`SELECT * FROM article WHERE category=${req.query.category}`)
        }
        if(result==""){
            result = await db.query('SELECT * FROM article');
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/articleHTML', async (req, res) => {
    try {
        const article = await db.query(`SELECT * FROM article WHERE id=${req.query.id}`)
        res.send(`<h1>${article.body.title}</h1>`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.get(`/${process.env.KEY}`,async(req,res)=>{
    await res.sendFile(path.resolve(__dirname,"./upload.html"));
})
app.post(`/upload`,
    async (req,res)=>{
        try{
            await db.query('INSERT INTO article (title, author, date, img, category, content) VALUES ($1,$2,$3,$4,$5,$6)',[req.body.title,req.body.author,req.body.date,req.body.img,req.body.category,req.body.content]);
            res.redirect(process.env.ADDRESS);
        }catch (err){
            console.error(err);
            res.statusMessage(500).send('Internal Server Error');
        }
    }
)
app.post(`/delete`,
    async (req,res)=>{
        try{
            await db.query('DELETE FROM article WHERE id=$1',[req.body.id]);
            res.redirect(process.env.ADDRESS);
        }catch (err){
            console.error(err);
            res.statusMessage(500).send('Internal Server Error');
        }
    }
)
app.all('*',(req,res)=>{
    res.send("<h1>404 boiii</h1>").status(404);
});
app.listen(process.env.PORT, process.env.INTERNAL_IP, ()=>{console.log(`Listening at ${process.env.ADDRESS}`)});
