const ora = require('ora');
const spinner = require('./spinner');

const t = '   ';
const log = console.log;

class PermissionsLogger {

  constructor(verbose){
    this.verbose = verbose || false;
    this.spinner;
  }

  start(){
    if (!this.verbose) return;

    log(`\n${t}Initializing registry contracts...`);
    log(`${t}----------------------------------`);
  }

  finish(){
    if (!this.verbose) return;

    log();
    log(`${t}> Initialization complete`);
  }

  _spin(msg){
    this.spinner = new ora({
      text: msg,
      spinner: spinner,
      color: 'red'
    })

    this.spinner.start();
  }

  stopSpinner(){
    if (!this.verbose) return;

    this.spinner.stopAndPersist({symbol:`${t}>`});
  }

  setAuthority(contract){
    if (!this.verbose) return;

    this._spin(`Set WhitelistAuthority as authority for ${contract.constructor.contractName}`);
  }

  setDep(contract,type){
    if (!this.verbose) return;

    this._spin(`Set ${contract.constructor.contractName} as ${type} for PackageRegistry`);
  }

  setCanCall(caller, target, method){
    if (!this.verbose) return;

    this._spin(`Authorized ${caller.constructor.contractName} to call: ` +
               `${target.constructor.contractName}:${method}`)
  }

  setAnyoneCanCall(target, method){
    if (!this.verbose) return;

    this._spin(`Authorized anyone to call ${target.constructor.contractName}:${method}`)
  }

  newline(){
    if (!this.verbose) return;
    log();
  }
}

module.exports = PermissionsLogger;