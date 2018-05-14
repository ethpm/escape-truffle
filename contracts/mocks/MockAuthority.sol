pragma solidity ^0.4.23;

import "../Authority.sol";

/// Used for testing only. Wraps a call Authorized.setAuthority
/// to validate logic that authorizes contracts to call the registry.
contract MockAuthority{

  function setAuthorityAsContract(address target, Authority newAuthority) public {
    Authorized(target).setAuthority(newAuthority);
  }
}