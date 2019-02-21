# Proof of existence on Ethereum

This is a truffle project built as a proof of concept to the timestamping use case, adding to that the concept of provable ownership to timestamped files.
Standard Blockchain-based timestamping technologies generally allow to generate a timestamped version of the file on chain and a receipt (like an OTS) that the user needs to retain for future proof. This receipt usually might be easily exposed to loss or theft.
The proof-of-existence overcome this problem by allowing to bind the timestamped proof directly to a specific user through a direct mapping to the user address.
In this way, no receipt is needed and copyright theft can occur only in case of the ETH wallet theft which comes with higher security standards.

## How it works?

The contract store a set of file hashes associated to given address.
It consists of:
- User Interface written with Bootstrap and Jquery, with Smart Contract interaction via web3.js
- Solidity Smart Contract and Tests in order to assure correct functionality of the whole application.

The project, Proof of Existence Demo, also leverages a blockchain-based architecture which can run without a traditional DB.

## Requirements

- Node v8+
- Running node or ganache-cli listening on 127.0.0.1:8545

## Setup

Install dependencies with:
- npm install

Deploy contracts with:
- truffle compile
- truffle migrate

To launch in dev mode run:
- npm run dev

Go with Web UI to localhost:3000
