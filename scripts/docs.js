#!/usr/bin/env node

const log = console.log;
const shell = require('shelljs');
const solmd = './node_modules/.bin/solmd';
const path = require('path');

shell.rm('-rf', 'docs');
shell.mkdir('docs');

log();
log('Generating documentation...');
log();

const contracts = shell.ls("./contracts/**/*.sol");

contracts.forEach(contract => {
  const name = path.basename(contract, '.sol');
  if (name !== 'Migrations'){
    log(`* ${name}`);
    shell.exec(`${solmd} ${contract} --dest docs/${name}.md`);
  }
})

log();
log('Done!')
log();

