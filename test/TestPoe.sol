pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PoE.sol";

contract TestPoe {
  PoE poe = PoE(DeployedAddresses.PoE());

  function testSendFileHash() public {
    bytes32 originalHash = 0x123;
    bytes32 returnedHash = poe.sendFileHash(originalHash);

    Assert.equal(originalHash, returnedHash, "Uploaded file with Hash 0x123");
  }

  function testProveAuthenticity() public {
    bytes32 originalHash = 0x123;
    bool result = poe.proveAuthenticity(originalHash);
    Assert.equal(result, true, "Hash 0x123 existing in Contract Storage");
  }

  function testProveAuthenticityFail() public {
    bytes32 originalHash = 0x111;
    bool result = poe.proveAuthenticity(originalHash);
    Assert.equal(result, false, "Hash 0x111 not existing in Contract Storage as expected");
  }

  function testRetrieveData() public {
    bytes32[] memory userData = poe.retrieveUserData();
    Assert.equal(userData.length, 1, "Files array length is 1 for current user");
  }
}
