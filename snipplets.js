const vscode = require('vscode');
const loginWrapper = require('./src/loginWrapper');

// functions
const login = require('./src/commands/login');
const logout = require('./src/commands/logout');
const addSnippet = require('./src/commands/addSnippet');
const updateSnippet = require('./src/commands/updateSnippet');
const searchSnippets = require('./src/commands/searchSnippets');

async function activate(context) {
  vscode.window.showInformationMessage('Snipplets started!');

  const _login = vscode.commands.registerCommand('extension.tassoruas.login', () => login());
  context.subscriptions.push(_login);

  const _logout = vscode.commands.registerCommand('extension.tassoruas.logout', () => logout());
  context.subscriptions.push(_logout);

  const _addSnippet = vscode.commands.registerCommand('extension.tassoruas.addSnippet', () => loginWrapper(addSnippet));
  context.subscriptions.push(_addSnippet);

  const _updateSnippet = vscode.commands.registerCommand('extension.tassoruas.updateSnippet', () => loginWrapper(updateSnippet));
  context.subscriptions.push(_updateSnippet);

  const _searchSnippets = vscode.commands.registerCommand('extension.tassoruas.searchSnippets', () => loginWrapper(searchSnippets));
  context.subscriptions.push(_searchSnippets);
}

exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
