const vscode = require('vscode');
const axios = require('axios').default;
const { ServerUrl } = require('../settings');

async function deleteSnippet({ userUid, snippetTreeView, vsTreeView }) {
  const item = snippetTreeView.getTreeItem(vsTreeView.selection);
  if (item.contextValue != 'object') {
    return vscode.window.showWarningMessage('You need to select the snippet first (click on it)');
  }

  const resp = await axios.post(ServerUrl + '/snippets/deleteSnippet', {
    userUid: userUid,
    name: item.name,
    content: item.content
  });

  if (resp.data.code == 0) {
    snippetTreeView.treeEmitter.emit('shouldUpdate');
    return vscode.window.showInformationMessage(`Snippet \"${item.name}\" deleted`);
  } else {
    return vscode.window.showErrorMessage('Failed to delete snippet');
  }
}

module.exports = deleteSnippet;
