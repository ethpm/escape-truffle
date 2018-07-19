const t = '   ';
const log = console.log;

class PermissionsLogger {

  constructor(verbose){
    this.verbose = verbose || false;
  }

  start(){
    if (!this.verbose) return;

    log(`${t}Initializing registry contracts...`);
    log(`${t}----------------------------------`);
  }

  finish(){
    if (!this.verbose) return;

    log();
    log(`${t}> Initialization complete`);
  }

  setAuthority(contract){
    if (!this.verbose) return;

    log(`${t}* Set WhitelistAuthority as authority for ${contract.constructor.contractName}`);
  }

  setDep(contract,type){
    if (!this.verbose) return;

    log(`${t}* Set ${contract.constructor.contractName} as ${type} for PackageIndex`);
  }

  setCanCall(caller, target, method){
    if (!this.verbose) return;

    log(`${t}* Authorized ${caller.constructor.contractName} to call: ${target.constructor.contractName}:${method}`)
  }

  setAnyoneCanCall(target, method){
    if (!this.verbose) return;

    log(`${t}* Authorized anyone to call ${target.constructor.contractName}:${method}`)
  }

  newline(){
    if (!this.verbose) return;
    log();
  }
}

module.exports = PermissionsLogger;

