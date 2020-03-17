const vscode = require('vscode');
const axios = require('axios').default;
const fs = require('fs');
const randomAny = require('../helpers/random');
const { ServerUrl, snippletsFolder } = require('../settings');

async function pickSnippet({ snippetTreeView, vsTreeView }) {
  const item = snippetTreeView.getTreeItem(vsTreeView.selection);
  const filePath = snippletsFolder + randomAny(5, 6) + '.txt';
  const itemContent = new Buffer.from(item.content, 'base64').toString();

  fs.writeFileSync(filePath, itemContent);
  vscode.workspace.openTextDocument(filePath).then(doc => {
    vscode.languages.setTextDocumentLanguage(doc, item.language);
    vscode.window.showTextDocument(doc);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    vscode.workspace.onDidSaveTextDocument(async e => {
      if (filePath.toLowerCase() == vscode.window.activeTextEditor.document.fileName.toLowerCase()) {
        const newContent = Buffer.from(e.getText(), 'utf8').toString('base64');
        let respUpdate = await axios.post(ServerUrl + '/Snippets/updateSnippet', {
          snippetId: item.id,
          name: item.name,
          oldContent: item.content,
          content: newContent,
          language: item.language
        });

        // Check if response is successful
        if (respUpdate.data.code != 0) {
          return vscode.window.showErrorMessage('Failed to update snippet!');
        }
        vscode.window.showInformationMessage('Snippet updated');
        snippetTreeView.treeEmitter.emit('shouldUpdate');
      }
    });
  });
}

module.exports = pickSnippet;

// const onChange = vscode.workspace.onDidChangeTextDocument(async e => {
//   /// Check if it's a save action and if has any changes to update
//   if (e.contentChanges.length != 0 || e.document.isDirty || e.document.version < 2) return;

//   /// Check if active document is the one being edited
//   if (filePath.toLowerCase() == vscode.window.activeTextEditor.document.fileName.toLowerCase()) {
//     const newContent = Buffer.from(e.document.getText(), 'utf8').toString('base64');
//     let respUpdate = await axios.post(ServerUrl + '/Snippets/updateSnippet', {
//       snippetId: item.id,
//       name: item.name,
//       oldContent: item.content,
//       content: newContent,
//       language: item.language
//     });

//     // Check if response is successful
//     if (respUpdate.data.code != 0) {
//       return vscode.window.showErrorMessage('Failed to update snippet!');
//     }
//     vscode.window.showInformationMessage('Snippet updated. To modify it again, close it and open again');
//     snippetTreeView.treeEmitter.emit('shouldUpdate');
//     onChange.dispose();
//   }
// });
