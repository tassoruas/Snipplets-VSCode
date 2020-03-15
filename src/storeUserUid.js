const os = require('os');
const fs = require('fs');
const util = require('util');
const { snippletsFolder } = require('./settings');

async function storeUserUid(userUid) {
  try {
    const snippletsFolder = os.platform() == 'win32' ? '\\snipplets-vscode\\' : '/snipplets-vscode/';
    const findDir = util.promisify(fs.readdir);
    const findFolder = await findDir(os.tmpdir()).catch(() => false);
    if (!findFolder) return false;

    const findTmpFolder = await findDir(os.tmpdir() + snippletsFolder).catch(() => false);
    if (!findTmpFolder) {
      const mkdir = util.promisify(fs.mkdir);
      await mkdir(os.tmpdir() + snippletsFolder);
    }
    const writeFile = util.promisify(fs.writeFile);
    writeFile(os.tmpdir() + snippletsFolder + 'userinfo', userUid);
    return true;
  } catch (error) {
    console.log('storeUserUid error', error);
    return false;
  }
}

module.exports = storeUserUid;
