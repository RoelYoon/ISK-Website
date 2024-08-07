const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/documents'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'ISK_CREDENTIALS.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
} catch (err) {
    return null;
}
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
const content = await fs.readFile(CREDENTIALS_PATH);
const keys = JSON.parse(content);
const key = keys.installed || keys.web;
const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
});
await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

async function docGET(auth, id, cb) {
    try{
        const docs = google.docs({version: 'v1', auth});
        const res = await docs.documents.get({
            documentId: id,
        });
        cb(res);
    }catch(e){
        console.log("Doc GET failed");
    }
}

async function driveGET(auth, query, cb){
    try{
        const drive = google.drive({version:'v3',auth});
        const params = {q:query};
        const res = await drive.files.list(params);
        cb(res);
    }catch(e){
        console.log("Drive GET failed");
        console.log(e);
    }
}

async function drivePATCH(auth, id, patch){
    const drive = google.drive({version: 'v3', auth});
    drive.files.update({
      fileId: id,
      resource: patch
    }, (err, res) => {
        if (err) return console.log(err);
    });
}

function extract(res){
    var data = {
        "title" : "",
        "author": "",
        "date": "",
        "category":"",
        "img": "X",
        "html": `<div id="content"><p>`
    }
    var level = 0;
    var dataSet = false;
    let contents = res.data.body.content;
    for(var i = 0; i < contents.length; ++i){
        if(!contents[i].paragraph){continue;}
        let elements = contents[i].paragraph.elements;
        for(var j = 0; j < elements.length; ++j){
            if(elements[j].textRun){
                dataSet=true;
                for(var key in data){
                    if(data[key]===""){
                        data[key]=elements[j].textRun.content.replace("\n","");
                        dataSet=false;
                        break;
                    }
                }
                if(!dataSet){continue;}
                let style = elements[j].textRun.textStyle;
                data.html+=(style.link?`<a href=${style.link.url}>`:``) + 
                (style.bold?`<strong>`:``) +
                (style.italic?`<em>`:``) +
                (elements[j].textRun.content.length==1 ? "" : elements[j].textRun.content.replace("\n","</p><p>")) +
                (style.italic?`</em>`:``) +
                (style.bold?`</strong>`:``) +
                (style.link?`</a>`:``);
            }
            if(elements[j].inlineObjectElement){
                if(data.img!=="X"){
                    data.html+=`<img src=${res.data.inlineObjects[elements[j].inlineObjectElement.inlineObjectId].inlineObjectProperties.embeddedObject.imageProperties.sourceUri}>`;
                }else{
                    data.img=`${res.data.inlineObjects[elements[j].inlineObjectElement.inlineObjectId].inlineObjectProperties.embeddedObject.imageProperties.sourceUri}`;
                }
            }
        }
    }
    data.html+="</div>";
    return data;
}

module.exports = {
    docGET: async(id, cb) => await authorize().then(client => {docGET(client,id,cb)}),
    driveGET: async(query, cb) => await authorize().then(client => {driveGET(client,query,cb)}),
    drivePATCH: async(id, patch) => await authorize().then(client => {drivePATCH(client,id,patch)}),
    extract: (doc) => extract(doc)
};