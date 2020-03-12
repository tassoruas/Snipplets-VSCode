const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;
const configs = vscode.workspace.getConfiguration('extension.tassoruas', editor && editor.document.uri);

const development = false;

var serverUrl = 'https://www.snipplets.dev:3333';
if (development) {
  serverUrl = 'http://localhost:3333';
}

module.exports.ServerUrl = configs.get('serverUrl') || serverUrl;
