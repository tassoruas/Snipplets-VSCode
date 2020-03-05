const vscode = require('vscode');
const axios = require('axios').default;

async function searchSnippets({ userUid }) {
  const resp = await axios.post('http://localhost:3333/snippets/getMySnippets', {
    userUid: userUid
  });
  const quickPickItems = [];

  console.log('resp', resp);

  if (!resp.data.values) {
    return vscode.window.showErrorMessage(`You don't have any snippets`);
  }
  for (var snippet of resp.data.values) {
    quickPickItems.push({
      label: snippet.title,
      description: new Buffer.from(snippet.content, 'base64').toString()
    });
  }

  vscode.window.showQuickPick(quickPickItems).then(e => {
    if (e == undefined) return;

    if (vscode.window.activeTextEditor) {
      const editor = vscode.window.activeTextEditor;
      const edit = new vscode.WorkspaceEdit();
      edit.insert(editor.document.uri, editor.selection.active, e.description);
      vscode.workspace.applyEdit(edit);
      vscode.window.showInformationMessage('Snippet "' + e.label + '" added');
    } else {
      vscode.window.showErrorMessage(`You don't have an active document`);
    }
  });
}

module.exports = searchSnippets;
