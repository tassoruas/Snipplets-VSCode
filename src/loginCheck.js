const vscode = require('vscode');
const axios = require('axios');
const login = require('./commands/login');
const fs = require('fs');
const util = require('util');
const { ServerUrl, snippletsFolder } = require('./settings');

async function loginCheck() {
  try {
    const readFile = util.promisify(fs.readFile);
    const userUid = await readFile(snippletsFolder + 'userinfo', 'utf8').catch(() => false);
    if (userUid == false) {
      return false;
    }

    const checkSession = await axios.post(ServerUrl + '/users/checkSession', { uid: userUid }).catch(error => {
      console.log('error', error);
      return vscode.window.showErrorMessage('Failed to fetch from server: loginCheck');
    });
    if (checkSession.data.values.valid == false) {
      return false;
    }
    return userUid;
  } catch (error) {
    console.log('loginCheck error', error);
  }
}

module.exports = loginCheck;
