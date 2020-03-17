const vscode = require('vscode');
const axios = require('axios').default;
const fs = require('fs');
const randomAny = require('../helpers/random');
const { ServerUrl, snippletsFolder } = require('../settings');

async function pickSnippet({ userUid, snippetTreeView, vsTreeView }) {
  const item = snippetTreeView.getTreeItem(vsTreeView.selection);
  if (!item.content) return;

  const filePath = snippletsFolder + randomAny(5, 6) + '.txt';
  const itemContent = new Buffer.from(item.content, 'base64').toString();

  fs.writeFileSync(filePath, itemContent);
  vscode.workspace.openTextDocument(filePath).then(doc => {
    vscode.languages.setTextDocumentLanguage(doc, item.language);
    vscode.window.showTextDocument(doc);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    const onSave = vscode.workspace.onDidSaveTextDocument(e => {
      if (filePath.toLowerCase() == vscode.window.activeTextEditor.document.fileName.toLowerCase()) {
        vscode.window.showQuickPick(languageOptions, { placeHolder: 'Snippet language: press ESC to keep existing' }).then(pick => {
          let snippetLanguage = item.language;
          if (pick != undefined) snippetLanguage = pick.value;
          vscode.window.showInputBox({ placeHolder: 'Snippet name: press ESC to keep existing' }).then(async name => {
            let snippetName = item.name;
            let oldName = item.name;
            if (name != undefined && name != '') snippetName = name;
            const newContent = Buffer.from(e.getText(), 'utf8').toString('base64');
            let respUpdate = await axios.post(ServerUrl + '/Snippets/updateSnippet', {
              userUid: userUid,
              name: snippetName,
              oldName: oldName,
              oldContent: item.content,
              content: newContent,
              language: snippetLanguage
            });

            // Check if response is successful
            if (respUpdate.data.code != 0) {
              return vscode.window.showErrorMessage('Failed to update snippet!');
            }
            vscode.window.showInformationMessage('Snippet updated');
            snippetTreeView.treeEmitter.emit('shouldUpdate', 'pickSnippets');
          });
        });
      }
      setTimeout(() => {
        onSave.dispose();
      }, 120000);
    });
  });
}

module.exports = pickSnippet;
