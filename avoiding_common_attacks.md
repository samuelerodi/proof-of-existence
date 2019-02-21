As the Smart Contract is relatively simple, there are only a few points which required attention on the security side, however here is the full list:

C1. Logic Bugs

There could be some logic bugs when adding a file hash or veryfing the presence of one.
This is why you can find a test for both success and failure case on the latter one.
An automated test has been written to verify that a file hash can be succesfully inserted in the contract's state, however in order to verify the double sending of a file hash the Web UI should be used.

C2. Recursive calls

There isn't a risk for recursive calls as payable functions have been purposedly avoided, and I never call a function on an address.

C3. Poison data

The only functions requiring data to be passed are the sendFIleHash and proveAuthenticity, both requiring a SHA256.
The data passed is correct as long as you pass the correct type, which is managed both on the client side (by try-catching the transaction send and throwing error messages), and on the Contract's side (if type is not bytes32, the call will revert).
This automatically checks that the data passed is hexadecimal and 32 bytes long.

C4. Denial of service

I specifically store a bytes32 value instead of a string in order to avoid DoS, as you could provide a very long string without the Contract be able to have any control over it.
With bytes32 type instead, you are forced to a 32 byte long value and using hexadecimal values only, mitigating the risk of Spamming.

The project can be expanded by implementing DDOS mitigation on the webserver providing the client application too.
