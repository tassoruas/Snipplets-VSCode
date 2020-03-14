const loginCheck = require('./loginCheck');

async function loginWrapper(callback, args) {
  try {
    const loggedIn = await loginCheck();
    if (loggedIn == false) {
      return;
    }

    if (!args) args = {};
    args.userUid = loggedIn;
    return callback(args);
  } catch (error) {
    console.log('loginWrapper error', error);
  }
}

module.exports = loginWrapper;
