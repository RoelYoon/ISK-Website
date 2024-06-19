const express = require("express");
const db = require('./db');
const path = require("path");
const app = express();
const fs = require('fs');
const { exec } = require('child_process')
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
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/upload",
 (req,res)=>{
    //replace with postgresql database
    const content = req.body.title+"\n"+req.body.img;
    const pth = '/Article'+artCount++;
    exec("touch "+pth, (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
            // log and return if we encounter an error
            console.error("could not execute command: ", err)
            return
        }
    })
    fs.writeFile(pth, content, err => {
      if (err) {
        console.error(err);
      } else {
        // file written successfully
      }
    });
    res.sendFile(path.resolve(__dirname,"./public/index.html"));
}
)
app.all('*',(req,res)=>{
    res.send("<h1>404 boiii</h1>").status(404);
});
app.listen(8099, "10.138.0.2", ()=>{console.log("Listening at IP 35.203.145.230 port 8099")});