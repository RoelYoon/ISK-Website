const express = require("express");
const db = require('./db');
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname,"./public")));
app.use(express.static(path.join(__dirname,"./node_modules")));
app.get("/",
async (req,res)=>{
    await res.sendFile(path.resolve(__dirname,"./public/index.html"));
})

app.get('/articles', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/upload",
async (req,res)=>{
    
    await res.send("Article Uploaded")
}
)
app.all('*',(req,res)=>{
    res.send("<h1>404 boiii</h1>").status(404);
});
app.listen(8099, "10.138.0.2", ()=>{console.log("Listening at IP 35.203.145.230 port 8099")});