var request = require('request');
const notifier = require('node-notifier');

const URL = 'https://dashboard.resinstaging.io';

var req = {
  uri: URL
};

let commit = null;

const check = () => {
  console.log('Polling staging');
  request(req, function (error, response, page) {
    let match = page.match(/window\.COMMIT\s=\s'(.+)'/g);
    if (match) {
      match = match[0].replace(/window\.COMMIT\s=\s'/, '').replace("'", '');
    }
    console.log(match);
    if (commit && match !== commit) {
      notifier.notify({
        message: 'Dashboard staging updated',
        sound: 'Ping'
      });
      console.log('STAGING UPDATED!');
    }

    commit = match;
  });
};

check();
setInterval(check, 1000 * 60 * 5);
