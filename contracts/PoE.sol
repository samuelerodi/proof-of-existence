pragma solidity ^0.4.17;

/** @title Proof of Existence (PoE). */
contract PoE {

    mapping(address => bytes32[]) public userToHash;
    mapping(bytes32 => bytes32) public hashes;
    bool emergencyStop = false;
    address owner;

    event hashAdded(bytes32 hash);

    /**
     * @dev This sets the contract's owner to the original deployer.
     */
    constructor() public {
      owner = msg.sender;
    }

    /**
     * @dev This modifier verifies the emergency stop condition (requires emergencyStop to be true).
     */
    modifier isStopped() {
      require(emergencyStop);
      _;
    }

    /**
     * @dev This modifier verifies the emergency stop condition (requires emergencyStop to be false).
     */

    modifier isNotStopped() {
      require(!emergencyStop);
      _;
    }

    /**
     * @dev This modifier verifies that the sender of a transaction is the owner of the contract, in order to limit Access to functions.
     */

    modifier isOwner() {
      require(msg.sender == owner);
      _;
    }

    /**
    * @dev This modifier verifies that a given hash is not already mapped in the Contract's state, in order to avoid "double-sending" of files.
    */
    modifier isNotAlreadyPresent(bytes32 hash) {
      require(hashes[hash] != hash);
      _;
    }

    /**
    * @dev This function can be called only by the owner of the contract (Access Restriction), and sets the emergencyStop variable to true, so that further critical Contract calls can be stopped.
    */
    function stopContract() public isNotStopped isOwner {
      emergencyStop = true;
    }

    /**
    * @dev This function can be called only by the owner of the contract (Access Restriction), and sets the emergencyStop variable to false, so that future Contract calls can be done again.
    */
    function resumeContract() public isStopped isOwner {
      emergencyStop = false;
    }

    /**
    * @dev This function stores in the userToHash mapping a new file hash for the msg.sender. However, you can't send the same file hash twice (even from different accounts).
    * @param hash The file hash to store
    * @return bytes32 The file hash to store, as a verification that the call has been executed.
    */
    function sendFileHash(bytes32 hash) public isNotStopped isNotAlreadyPresent(hash) returns (bytes32) {
        userToHash[msg.sender].push(hash);
        hashes[hash] = hash;
        emit hashAdded(hash);
        return hash;
    }

    /**
    * @dev This function verifies whether a given hash is found in the Smart Contract's state.
    * @param hash The file hash to check.
    * @return bool Whether or not the file hash has been found in the Smart Contract's state.
    */
    function proveAuthenticity(bytes32 hash) public isNotStopped view returns(bool) {
        return (hashes[hash] == hash);
    }

    /**
    * @dev This function retrieves a list of file hashes for the transaction sender (msg.sender)
    * @return bytes32[] A list of file hashes for the msg.sender
    */
    function retrieveUserData() public isNotStopped view returns(bytes32[]) {
        return (userToHash[msg.sender]);
    }
}
