const vscode = require('vscode');
const loginWrapper = require('./src/loginWrapper');
const loginCheck = require('./src/loginCheck');
const axios = require('axios');
const { ServerUrl, development } = require('./src/settings');
const EventEmitter = require('events');

// functions
const register = require('./src/commands/register');
const login = require('./src/commands/login');
const logout = require('./src/commands/logout');
const addSnippet = require('./src/commands/addSnippet');
const deleteSnippet = require('./src/commands/deleteSnippet');
const searchSnippets = require('./src/commands/searchSnippets');

const pickSnippet = require('./src/commands/pickSnippet');
const SnippetTreeView = require('./src/SnippetTreeView');

async function activate(context) {
  try {
    const treeEmitter = new EventEmitter();
    let userUid = await loginCheck();
    let { snippetTreeView, vsTreeView, onDidChangeSelection } = await BuildTreeView(userUid, treeEmitter);

    treeEmitter.on('shouldUpdate', async caller => {
      if (onDidChangeSelection != null) onDidChangeSelection.dispose();
      userUid = await loginCheck();
      if (development) console.log('should update called', caller);
      const tree = await BuildTreeView(userUid, treeEmitter);
      snippetTreeView = tree.snippetTreeView;
      vsTreeView = tree.vsTreeView;
      onDidChangeSelection = tree.onDidChangeSelection;
    });

    const _register = vscode.commands.registerCommand('snipplets.register', () => register(treeEmitter));
    context.subscriptions.push(_register);

    const _login = vscode.commands.registerCommand('snipplets.login', () => login(treeEmitter));
    context.subscriptions.push(_login);

    const _logout = vscode.commands.registerCommand('snipplets.logout', () => logout(treeEmitter));
    context.subscriptions.push(_logout);

    const _addSnippet = vscode.commands.registerCommand('snipplets.addSnippet', () => loginWrapper(addSnippet, { treeEmitter }));
    context.subscriptions.push(_addSnippet);

    const _deleteSnippet = vscode.commands.registerCommand('snipplets.deleteSnippet', () =>
      loginWrapper(deleteSnippet, { snippetTreeView, vsTreeView })
    );
    context.subscriptions.push(_deleteSnippet);

    const _searchSnippets = vscode.commands.registerCommand('snipplets.searchSnippets', () => loginWrapper(searchSnippets));
    context.subscriptions.push(_searchSnippets);
  } catch (error) {
    console.log('Failed to activate snipplets extension: error', error);
  }
}

async function BuildTreeView(userUid, treeEmitter) {
  let snippetTreeView;
  if (userUid != false) {
    const snippets = await axios.post(ServerUrl + '/snippets/getMySnippets', {
      userUid: userUid
    });
    snippetTreeView = new SnippetTreeView(snippets.data.values, treeEmitter);
  } else {
    snippetTreeView = new SnippetTreeView([{ id: 1, title: 'Empty', content: '', language: '' }], treeEmitter);
  }
  const vsTreeView = vscode.window.createTreeView('views.snippets', {
    treeDataProvider: snippetTreeView,
    showCollapseAll: false
  });

  let onDidChangeSelection = null;
  if (userUid != false) {
    onDidChangeSelection = vsTreeView.onDidChangeSelection(() => loginWrapper(pickSnippet, { snippetTreeView, vsTreeView }));
  }
  return { snippetTreeView, vsTreeView, onDidChangeSelection };
}

function deactivate() {}

module.exports = { activate, deactivate };
