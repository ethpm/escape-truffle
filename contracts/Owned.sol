pragma solidity ^0.4.24;
pragma experimental "v0.5.0";


contract OwnedInterface {
  address public owner;

  modifier isOwner {
    require(msg.sender == owner,"escape:Owned:not-authorized");
    _;
  }

  event OwnerUpdate(address indexed oldOwner, address indexed newOwner);

  function setOwner(address newOwner) public returns (bool);
}


contract Owned is OwnedInterface {
  constructor() public {
    owner = msg.sender;
    emit OwnerUpdate(0x0, owner);
  }

  function setOwner(address newOwner)
    public
    isOwner
    returns (bool)
  {
    emit OwnerUpdate(owner, newOwner);
    owner = newOwner;
    return true;
  }
}
