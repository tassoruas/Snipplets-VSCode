const vscode = require('vscode');
const loginWrapper = require('./src/loginWrapper');
const loginCheck = require('./src/loginCheck');
const axios = require('axios');
const { ServerUrl } = require('./src/settings');

// functions
const login = require('./src/commands/login');
const logout = require('./src/commands/logout');
const addSnippet = require('./src/commands/addSnippet');
const searchSnippets = require('./src/commands/searchSnippets');

const pickSnippet = require('./src/commands/pickSnippet');
const JsonTreeViewProvider = require('./src/jsonTreeView');

async function activate(context) {
  try {
    const _login = vscode.commands.registerCommand('snipplets.login', () => login());
    context.subscriptions.push(_login);

    const _logout = vscode.commands.registerCommand('snipplets.logout', () => logout());
    context.subscriptions.push(_logout);

    const _addSnippet = vscode.commands.registerCommand('snipplets.addSnippet', () => loginWrapper(addSnippet));
    context.subscriptions.push(_addSnippet);

    const _searchSnippets = vscode.commands.registerCommand('snipplets.searchSnippets', () => loginWrapper(searchSnippets));
    context.subscriptions.push(_searchSnippets);

    /////////////////////////////////////////////

    const userUid = await loginCheck();
    if (userUid != false) {
      const snippets = await axios.post(ServerUrl + '/snippets/getMySnippets', {
        userUid: userUid
      });
      const treeData = new JsonTreeViewProvider(snippets.data.values);
      const treeView = vscode.window.createTreeView('views.snippets', {
        treeDataProvider: treeData,
        showCollapseAll: true
      });
      treeView.onDidChangeSelection(() => loginWrapper(pickSnippet, { selection: treeView.selection, data: treeData }));
    }
  } catch (error) {
    console.log('Failed to activate snipplets extension: error', error);
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
