const vscode = require('vscode');
const axios = require('axios').default;
const { ServerUrl } = require('../settings');
const searchSnippets = require('./searchSnippets');

async function updateSnippet({ userUid }) {
  let snippetToUpdate = null;
  const resp = await axios.post(ServerUrl + '/snippets/getMySnippets', {
    userUid: userUid
  });
  const quickPickItems = [];

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
    snippetToUpdate = e;
    if (snippet != null) {
      vscode.workspace.openTextDocument({ language: snippetToUpdate.language, content: snippetToUpdate.content });
      // const editor = vscode.window.activeTextEditor;
      // if (editor) vscode.languages.setTextDocumentLanguage(editor.document, 'csharp');
    }
  });
}

module.exports = updateSnippet;
