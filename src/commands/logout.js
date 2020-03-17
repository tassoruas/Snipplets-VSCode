const vscode = require('vscode');
const util = require('util');
const os = require('os');
const fs = require('fs');

async function logout(treeEmitter) {
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
  writeFile(os.tmpdir() + snippletsFolder + 'userinfo', '');
  vscode.window.showInformationMessage('I hope we meet again! Bye bye :)');
  treeEmitter.emit('shouldUpdate', 'logout');
}

module.exports = logout;
