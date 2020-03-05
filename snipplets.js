const vscode = require('vscode');
const axios = require('axios').default;
const fs = require('fs');

// functions
const login = require('./src/commands/login');
const searchSnippets = require('./src/commands/searchSnippets');

function activate(context) {
  console.log('Congratulations, your extension "snipplets-vscode" is now active!');

  const _login = vscode.commands.registerCommand('snipplets.login', () => login());
  context.subscriptions.push(_login);

  const _searchSnippets = vscode.commands.registerCommand('snipplets.searchSnippets', () => searchSnippets());
  context.subscriptions.push(_searchSnippets);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};

function checkLogin(uid) {}
