const vscode = require('vscode');
const axios = require('axios').default;
const fs = require('fs');
const { ServerUrl, snippletsFolder } = require('../settings');
const randomAny = require('../helpers/random');
const languageOptions = require('../helpers/languageOptions');

async function addSnippetOld({ userUid, treeEmitter }) {
  if (vscode.window.activeTextEditor) {
    const selection = vscode.window.activeTextEditor.selection;
    const range = new vscode.Range(selection.start, selection.end);
    const text = vscode.window.activeTextEditor.document.getText(range);

    if (text == '') {
      return vscode.window.showInformationMessage('You need to highlight/select the snippet before trying to add it.');
    }
    const textBase64 = Buffer.from(text, 'utf8').toString('base64');

    vscode.window.showInputBox({ placeHolder: 'Snippet name' }).then(name => {
      if (name == undefined || name == '') return vscode.window.showErrorMessage('Snippet name cannot be empty');
      const snippetName = name;
      vscode.window.showQuickPick(languageOptions, { placeHolder: 'Snippet language' }).then(async pick => {
        if (pick == undefined) return;
        const snippetLanguage = pick.value;
        const resp = await axios.post(ServerUrl + '/snippets/newSnippet', {
          userUid: userUid,
          name: snippetName,
          content: textBase64,
          language: snippetLanguage
        });

        if (resp.data.code == 0) {
          vscode.window.showInformationMessage(`Snippet \"${snippetName}\" added!`);
          treeEmitter.emit('shouldUpdate', 'addSnippet');
        } else {
          vscode.window.showErrorMessage(`Adding \"${snippetName}\" failed!`);
        }
      });
    });
  } else {
    vscode.window.showErrorMessage(`You don't have an active document`);
  }
}

async function addSnippet({ userUid, treeEmitter }) {
  const filePath = snippletsFolder + randomAny(5, 6) + '.txt';

  fs.writeFileSync(filePath, '');
  vscode.workspace.openTextDocument(filePath).then(async doc => {
    await vscode.window.showTextDocument(doc);
    vscode.window.showQuickPick(languageOptions, { placeHolder: 'Snippet language' }).then(async pick => {
      if (pick == undefined) return;
      const snippetLanguage = pick.value;
      vscode.languages.setTextDocumentLanguage(doc, snippetLanguage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      const onSave = vscode.workspace.onDidSaveTextDocument(e => {
        if (filePath.toLowerCase() == vscode.window.activeTextEditor.document.fileName.toLowerCase()) {
          vscode.window.showInputBox({ placeHolder: 'Snippet name' }).then(async name => {
            if (name == undefined || name == '') return;
            const snippetName = name;

            const newContent = Buffer.from(e.getText(), 'utf8').toString('base64');
            const resp = await axios.post(ServerUrl + '/snippets/newSnippet', {
              userUid: userUid,
              name: snippetName,
              content: newContent,
              language: snippetLanguage
            });

            // Check if response is successful
            if (resp.data.code != 0) {
              return vscode.window.showErrorMessage('Failed to add snippet!');
            }
            vscode.window.showInformationMessage(`Snippet \"${snippetName}\" added!`);
            treeEmitter.emit('shouldUpdate', 'addSnippet');
          });
        }
        setTimeout(() => onSave.dispose, 120000);
      });
    });
  });
}

module.exports = addSnippet;
