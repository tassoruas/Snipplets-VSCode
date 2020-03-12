const vscode = require('vscode');
const axios = require('axios').default;
const util = require('util');
const os = require('os');
const fs = require('fs');
const { ServerUrl } = require('../settings');
const { sha256 } = require('js-sha256');

function login() {
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
          const snippletsFolder = os.platform() == 'win32' ? '\\snipplets-vscode\\' : '/snipplets-vscode/';
          const findDir = util.promisify(fs.readdir);
          const findFolder = await findDir(os.tmpdir()).catch(() => false);
          if (!findFolder) return false;

          const findTmpFolder = await findDir(os.tmpdir() + snippletsFolder).catch(() => false);
          if (!findTmpFolder) {
            const mkdir = util.promisify(fs.mkdir);
            await mkdir(os.tmpdir() + snippletsFolder);
          }
          const writeFile = util.promisify(fs.writeFile);
          writeFile(os.tmpdir() + snippletsFolder + 'userinfo', userData.data.values.uid);
          vscode.window.showInformationMessage('Logged in!');
        }
      }
    });
  });
}

module.exports = login;
