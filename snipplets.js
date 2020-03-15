const vscode = require('vscode');
const loginWrapper = require('./src/loginWrapper');
const loginCheck = require('./src/loginCheck');
const axios = require('axios');
const { ServerUrl } = require('./src/settings');
const EventEmitter = require('events');

// functions
const register = require('./src/commands/register');
const login = require('./src/commands/login');
const logout = require('./src/commands/logout');
const addSnippet = require('./src/commands/addSnippet');
const searchSnippets = require('./src/commands/searchSnippets');

const pickSnippet = require('./src/commands/pickSnippet');
const SnippetTreeView = require('./src/SnippetTreeView');

async function activate(context) {
  try {
    const treeEmitter = new EventEmitter();
    let treeData = null;
    let treeView = null;

    treeEmitter.on('shouldUpdate', async () => {
      const tree = await BuildTreeView(userUid, treeEmitter);
      treeData = tree.treeData;
      treeView = tree.treeView;
    });

    const userUid = await loginCheck();
    if (userUid != false) {
      const tree = await BuildTreeView(userUid, treeEmitter);
      treeData = tree.treeData;
      treeView = tree.treeView;
    }

    const _register = vscode.commands.registerCommand('snipplets.register', () => register());
    context.subscriptions.push(_register);

    const _login = vscode.commands.registerCommand('snipplets.login', () => login(treeEmitter));
    context.subscriptions.push(_login);

    const _logout = vscode.commands.registerCommand('snipplets.logout', () => logout());
    context.subscriptions.push(_logout);

    const _addSnippet = vscode.commands.registerCommand('snipplets.addSnippet', () => loginWrapper(addSnippet, { treeEmitter }));
    context.subscriptions.push(_addSnippet);

    const _searchSnippets = vscode.commands.registerCommand('snipplets.searchSnippets', () => loginWrapper(searchSnippets));
    context.subscriptions.push(_searchSnippets);
  } catch (error) {
    console.log('Failed to activate snipplets extension: error', error);
  }
}

async function BuildTreeView(userUid, treeEmitter) {
  const snippets = await axios.post(ServerUrl + '/snippets/getMySnippets', {
    userUid: userUid
  });
  const treeData = new SnippetTreeView(snippets.data.values);
  const treeView = vscode.window.createTreeView('views.snippets', {
    treeDataProvider: treeData,
    showCollapseAll: true
  });
  treeView.onDidChangeSelection(() => loginWrapper(pickSnippet, { selection: treeView.selection, data: treeData, treeEmitter: treeEmitter }));
  return { treeData, treeView };
}

// myEmitter.emit('event');

function deactivate() {}

module.exports = { activate, deactivate };
