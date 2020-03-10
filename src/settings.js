const vscode = require('vscode');

const editor = vscode.window.activeTextEditor;
const configs = vscode.workspace.getConfiguration('extension.tassoruas', editor && editor.document.uri);
console.log('ServerUrl', configs.get('serverUrl') || 'http://localhost:3333');

module.exports.ServerUrl = configs.get('serverUrl') || 'http://localhost:3333';
