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
    const docs = google.docs({version: 'v1', auth});
    const res = await docs.documents.get({
        documentId: id,
    });
    cb(res);
}

async function driveGET(auth, query, cb){
    google.options({auth})
    const drive = google.drive('v3');
    const params = {q:query};
    const res = await drive.files.list(params);
    cb(res);
}
module.exports = {
    docGET: async(id, cb) => await authorize().then(client => {docGET(client,id,cb)}),
    driveGET: async(query, cb) => await authorize().then(client => {driveGET(client,query,cb)})
};