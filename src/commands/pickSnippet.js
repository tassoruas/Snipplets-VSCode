const vscode = require('vscode');
const axios = require('axios').default;
const { ServerUrl } = require('../settings');

async function pickSnippet({ selection, data, treeEmitter }) {
  const item = data.getTreeItem(selection);
  vscode.workspace.openTextDocument({ language: item.language, content: new Buffer.from(item.content, 'base64').toString() }).then(doc => {
    vscode.window.showTextDocument(doc);
    const onClose = vscode.workspace.onDidCloseTextDocument(e => {
      if (e.version != 1) {
        // this means document changed
        vscode.window.showInputBox({ placeHolder: 'To save snippet just press "Enter". To cancel, press any other key' }).then(async confirm => {
          if (confirm != undefined) {
            const newContent = Buffer.from(e.getText(), 'utf8').toString('base64');

            let respUpdate = await axios.post(ServerUrl + '/Snippets/updateSnippet', {
              snippetId: item.id,
              name: item.name,
              oldContent: item.content,
              content: newContent,
              language: item.language
            });
            if (respUpdate.data.code != 0) {
              vscode.window.showErrorMessage('Failed to update snippet!');
            }
            vscode.window.showInformationMessage('Snippet updated');
            treeEmitter.emit('shouldUpdate');
            /// TODO: Make tree data refresh
          }
        });
      }
      onClose.dispose();
    });
  });
  // const resp = await axios.post(ServerUrl + '/snippets/getMySnippets', {
  //   userUid: userUid
  // });
  // const quickPickItems = [];
  // if (!resp.data.values) {
  //   return vscode.window.showErrorMessage(`You don't have any snippets`);
  // }
  // for (var snippet of resp.data.values) {
  //   quickPickItems.push({
  //     label: snippet.title,
  //     description: new Buffer.from(snippet.content, 'base64').toString()
  //   });
  // }
  // vscode.window.showQuickPick(quickPickItems).then(e => {
  //   if (e == undefined) return;
  //   if (vscode.window.activeTextEditor) {
  //     const editor = vscode.window.activeTextEditor;
  //     const edit = new vscode.WorkspaceEdit();
  //     edit.insert(editor.document.uri, editor.selection.active, e.description);
  //     vscode.workspace.applyEdit(edit);
  //     vscode.window.showInformationMessage('Snippet "' + e.label + '" added');
  //   } else {
  //     vscode.window.showErrorMessage(`You don't have an active document`);
  //   }
  // });
}

module.exports = pickSnippet;
