const vscode = require('vscode');
const os = require('os');
const axios = require('axios').default;
const login = require('./commands/login');
const fs = require('fs');
const util = require('util');
const { ServerUrl } = require('./settings');

async function loginWrapper(callback, args) {
  const snippletsFolder = os.platform() == 'win32' ? '\\snipplets-vscode\\' : '/snipplets-vscode/';
  const readFile = util.promisify(fs.readFile);
  const userUid = await readFile(os.tmpdir() + snippletsFolder + 'userinfo', 'utf8').catch(() => false);
  if (userUid == false) {
    vscode.window.showErrorMessage(`You need to login first!`);
    return login();
  }

  const checkSession = await axios.post(ServerUrl + '/users/checkSession', { uid: userUid }).catch(error => {
    console.log('error', error);
    return vscode.window.showErrorMessage('Failed to fetch from server.');
  });
  if (checkSession.data.values.valid == false) {
    vscode.window.showErrorMessage(`Your session has expired, please login again.`);
    return login();
  }

  if (!args) args = {};
  args.userUid = userUid;
  return callback(args);
}

module.exports = loginWrapper;
