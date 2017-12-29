const notifier = require('node-notifier');
const request = require('request');
const Spinner = require('cli-spinner').Spinner;

Spinner.setDefaultSpinnerString(2)

const URL = 'https://dashboard.resinstaging.io';
const enterScreen = () =>
	console.log('\x1b[?1049h');

const exitScreen = () =>
	console.log('\x1b[?1049h');

// Wipes the screen and resets the cursor to the top left
const clearScreen = () =>
	console.log('\x1b[2J\x1B[0f');

const hideCursor = () =>
	console.log('\x1b[?25l');

const showCursor = () =>
	console.log('\x1b[?25h');

enterScreen();

const req = {
  uri: URL
};

let commit = null;

const check = () => {
  clearScreen();
  hideCursor();

  const spinner = new Spinner('Polling staging... %s')

  spinner.start();

  request(req, function (error, response, page) {
    spinner.stop(true);
    let match = page.match(/window\.COMMIT\s=\s'(.+)'/g);
    if (match) {
      match = match[0].replace(/window\.COMMIT\s=\s'/, '').replace("'", '');
    }
    console.log(`Dashboard running commit ${match}`);
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
const interval = setInterval(check, 1000 * 60 * 5);

const finish = () => {
  clearInterval(interval);
  showCursor();
  exitScreen();
};

// do something when app is closing
process.on('exit', finish)
// catches ctrl+c event
process.on('SIGINT', finish);
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', finish);
process.on('SIGUSR2', finish);
//catches uncaught exceptions
process.on('uncaughtException', finish);
