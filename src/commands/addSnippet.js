const vscode = require('vscode');
const axios = require('axios').default;
const { ServerUrl } = require('../settings');

async function addSnippet({ userUid, treeEmitter }) {
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
          vscode.window.showInformationMessage(`Snippet ${snippetName} added!`);
          treeEmitter.emit('shouldUpdate');
        } else {
          vscode.window.showErrorMessage(`Adding ${snippetName} failed!`);
        }
      });
    });
  } else {
    vscode.window.showErrorMessage(`You don't have an active document`);
  }
}

const languageOptions = [
  { label: 'C#', name: 'C#', value: 'csharp' },
  { label: 'CSS', name: 'CSS', value: 'css' },
  { label: 'HTML', name: 'HTML', value: 'html' },
  { label: 'Java', name: 'Java', value: 'java' },
  { label: 'Javascript', name: 'Javascript', value: 'javascript' },
  { label: 'JSON', name: 'JSON', value: 'json' },
  { label: 'MySQL', name: 'MySQL', value: 'mysql' },
  { label: 'Python', name: 'Python', value: 'python' },
  { label: 'XML', name: 'XML', value: 'xml' }
];

module.exports = addSnippet;
