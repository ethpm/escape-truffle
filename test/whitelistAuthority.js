const helpers = require('./helpers');
const Authorized = artifacts.require('Authorized');
const WhitelistAuthority = artifacts.require('WhitelistAuthority');

contract('WhitelistAuthority', function(accounts){
  let authorized;
  const constants = helpers.constants;
  const assertFailure = helpers.assertFailure;

  describe('Authorized', function(){
    describe('constructor', function(){
      before(async () => authorized = await WhitelistAuthority.new());

      it('should set an owner on deployment', async function(){
        assert(await authorized.owner() === accounts[0]);
      });

      it('should emit `OwnerUpdate`', async function(){
        const events = await authorized.getPastEvents('OwnerUpdate');
        const event = events[0];

        assert(events.length === 1);
        assert(event.event === 'OwnerUpdate');
        assert(event.returnValues.oldOwner === constants.zeroAddress);
        assert(event.returnValues.newOwner === accounts[0]);
      })
    });

    describe('setOwner', function(){
      before(async () => authorized = await WhitelistAuthority.new());

      it('should set a new Owner', async function(){
        assert(await authorized.owner() === accounts[0]);
        authorized.setOwner(accounts[1]);
        assert(await authorized.owner() === accounts[1]);
      });

      it('should emit `OwnerUpdate`', async function(){
        const events = await authorized.getPastEvents('OwnerUpdate');
        const event = events[0];

        assert(events.length === 1);
        assert(event.event === 'OwnerUpdate');
        assert(event.returnValues.oldOwner === accounts[0]);
        assert(event.returnValues.newOwner === accounts[1]);
      });
    });

    describe('setAuthority', function(){
      let whitelist;
      let signature;

      before(async () => {
        whitelist = await WhitelistAuthority.new();
        signature = WhitelistAuthority.abi.find(item => item.name === 'setAuthority').signature;
      })

      it('should allow the owner to set the authority', async function(){
        const newAuthority = accounts[1];
        await whitelist.setAuthority(newAuthority);
        assert(await whitelist.authority() === newAuthority);
      });

      it('should emit `AuthorityUpdate`', function(done){
        const event = whitelist.AuthorityUpdate();
        const newAuthority = accounts[2];

        whitelist
          .authority()
          .then(oldAuthority => {
            event.once("data", function(data){
              assert(data.returnValues.oldAuthority === oldAuthority);
              assert(data.returnValues.newAuthority === newAuthority);
              this.removeAllListeners();
              done();
            })

            whitelist.setAuthority(newAuthority);
          });
      });

      it('should not allow non-owner to set the authority', async function(){
        const nonOwner = accounts[8];

        const currentOwner = await whitelist.owner();
        await whitelist.setAuthority(currentOwner);
        const currentAuthority = await whitelist.authority();

        assert(currentOwner !== nonOwner);
        assert(currentAuthority === currentOwner);

        await assertFailure(
          whitelist.setAuthority(nonOwner, {from: nonOwner})
        );
      });
    });
  });
});
