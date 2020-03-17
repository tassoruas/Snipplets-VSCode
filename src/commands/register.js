const vscode = require('vscode');
const axios = require('axios').default;
const { ServerUrl } = require('../settings');
const { sha256 } = require('js-sha256');
const { loginWithParams } = require('./login');

function register(treeEmitter) {
  let email = undefined;
  let password = undefined;
  vscode.window.showInputBox({ placeHolder: 'Insert your email', ignoreFocusOut: true }).then(e => {
    email = e;
    const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (emailRegex.test(email) === false) {
      return vscode.window.showErrorMessage('Invalid email!');
    }
    vscode.window.showInputBox({ placeHolder: 'Insert your password', ignoreFocusOut: true, password: true }).then(async e => {
      password = sha256(e);
      if (email != undefined && password != undefined) {
        let userData = await axios.post(ServerUrl + '/users/register', { email: email, password: password }).catch(error => {
          console.log('error', error);
          return vscode.window.showErrorMessage('Failed to fetch from server: register' + ServerUrl);
        });

        if (userData.data.code == 0) {
          loginWithParams(email, password);
          vscode.window.showInformationMessage('Registered and logged in!');
          treeEmitter.emit('shouldUpdate', 'register');
          return;
        }
      }
    });
  });
}

module.exports = register;
