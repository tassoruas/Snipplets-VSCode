const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;
const configs = vscode.workspace.getConfiguration('snipplets', editor && editor.document.uri);
const os = require('os');

const development = false;
var snippletsFolder = os.tmpdir();
snippletsFolder += os.platform() == 'win32' ? '\\snipplets-vscode\\' : '/snipplets-vscode/';

var ServerUrl = 'https://www.snipplets.dev:3333';
if (development) {
  ServerUrl = 'http://localhost:3333';
}

ServerUrl = configs.get('serverUrl') || ServerUrl;
module.exports = { ServerUrl, snippletsFolder, development };
