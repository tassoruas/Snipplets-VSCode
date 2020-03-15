const vscode = require('vscode');
const axios = require('axios').default;
const { ServerUrl } = require('../settings');
const { sha256 } = require('js-sha256');
const storeUserUid = require('../storeUserUid');

function login(treeEmitter) {
  let email = undefined;
  let password = undefined;
  vscode.window.showInputBox({ placeHolder: 'Insert your email', ignoreFocusOut: true }).then(e => {
    email = e;
    vscode.window.showInputBox({ placeHolder: 'Insert your password', ignoreFocusOut: true, password: true }).then(async e => {
      password = sha256(e);
      if (email != undefined && password != undefined) {
        let userData = await axios.post(ServerUrl + '/users/login', { email: email, password: password }).catch(error => {
          console.log('error', error);
          return vscode.window.showErrorMessage('Failed to fetch from server.' + ServerUrl);
        });

        if (userData.data.code == 0) {
          if (storeUserUid(userData.data.values.uid)) {
            vscode.window.showInformationMessage('Logged in!');
            treeEmitter.emit('shouldUpdate');
          }
        }
      }
    });
  });
}

async function loginWithParams(email, password) {
  if (email != undefined && password != undefined) {
    let userData = await axios.post(ServerUrl + '/users/login', { email: email, password: password }).catch(error => {
      console.log('error', error);
      return vscode.window.showErrorMessage('Failed to fetch from server.' + ServerUrl);
    });

    if (userData.data.code == 0) {
      if (storeUserUid(userData.data.values.uid)) {
        return true;
      }
    }
  }
  return false;
}

module.exports = login;
module.exports.loginWithParams = loginWithParams;
