const Authorized = artifacts.require('Authorized');

contract('Authorized', function(accounts){

  let authorized;

  before(async () => authorized = await Authorized.new());

  it('should set an owner on deployment', async function(){
    const owner = await authorized.owner();
    assert(owner === accounts[0]);
  });
})