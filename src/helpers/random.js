function randomAny(minChars, maxChars, chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') {
  var randLenght = Math.floor(Math.random() * (maxChars - minChars + 1)) + minChars;
  var rand = Array(randLenght)
    .fill(chars)
    .map(function(x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join('');
  return rand;
}

module.exports = randomAny;
