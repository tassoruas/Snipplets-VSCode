const vscode = require('vscode');
const axios = require('axios').default;

async function searchSnippets() {
  const resp = await axios.post('http://localhost:3333/snippets/getMySnippets', {
    userId: 1
  });
  let quickPickItems = [];
  for (var snippet of resp.data.values) {
    quickPickItems.push({
      label: snippet.title,
      description: new Buffer.from(snippet.content, 'base64').toString()
    });
  }

  vscode.window.showQuickPick(quickPickItems).then(e => {
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
