const vscode = require('vscode');
const axios = require('axios').default;
const fs = require('fs');

function login() {
  let email = undefined;
  let password = undefined;
  vscode.window.showInputBox({ placeHolder: 'Insert your email', ignoreFocusOut: true }).then(e => {
    email = e;
    vscode.window.showInputBox({ placeHolder: 'Insert your password', ignoreFocusOut: true, password: true }).then(e => {
      password = e;
      if (email != undefined && password != undefined) {
        axios.post('http://localhost:3333/users/login', { email: email, password: password }).then(resp => {
          console.log('ext path', process.env.NODE_ENV);
          console.log('resp', resp.data.values);
          /// Find temp path or environment path and add the UID in a file.
        });
      }
    });
  });
}

module.exports = login;
