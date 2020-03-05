const vscode = require('vscode');
const loginWrapper = require('./src/loginWrapper');

// functions
const login = require('./src/commands/login');
const logout = require('./src/commands/logout');
const addSnippet = require('./src/commands/addSnippet');
const searchSnippets = require('./src/commands/searchSnippets');

async function activate(context) {
  vscode.window.showInformationMessage('Snipplets started!');

  const _login = vscode.commands.registerCommand('snipplets.login', () => login());
  context.subscriptions.push(_login);

  const _logout = vscode.commands.registerCommand('snipplets.logout', () => logout());
  context.subscriptions.push(_logout);

  const _addSnippet = vscode.commands.registerCommand('snipplets.addSnippet', () => loginWrapper(addSnippet));
  context.subscriptions.push(_addSnippet);

  const _searchSnippets = vscode.commands.registerCommand('snipplets.searchSnippets', () => loginWrapper(searchSnippets));
  context.subscriptions.push(_searchSnippets);
}

exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
