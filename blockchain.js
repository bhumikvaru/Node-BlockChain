const SHA256 = require("crypto-js/sha256");

function createBlock(index, timestamp, data, precedingHash = " ") {
  return {
    index,
    timestamp,
    data,
    precedingHash,
    nonce: 0,
    hash: computeHash(index, precedingHash, timestamp, data, 0),
  };
}

function computeHash(index, precedingHash, timestamp, data, nonce) {
  return SHA256(
    index + precedingHash + timestamp + JSON.stringify(data) + nonce
  ).toString();
}

function proofOfWork(block, difficulty) {
  while (
    block.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
  ) {
    block.nonce++;
    block.hash = computeHash(
      block.index,
      block.precedingHash,
      block.timestamp,
      block.data,
      block.nonce
    );
  }
}

function createBlockchain() {
  const blockchain = [createGenesisBlock()];
  const difficulty = 4;

  function createGenesisBlock() {
    return createBlock(0, "01/01/2020", "Initial Block in the Chain", "0");
  }

  function obtainLatestBlock() {
    return blockchain[blockchain.length - 1];
  }

  function addNewBlock(newBlock) {
    newBlock.precedingHash = obtainLatestBlock().hash;
    proofOfWork(newBlock, difficulty);
    blockchain.push(newBlock);
  }

  function checkChainValidity() {
    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const precedingBlock = blockchain[i - 1];

      if (
        currentBlock.hash !==
        computeHash(
          currentBlock.index,
          currentBlock.precedingHash,
          currentBlock.timestamp,
          currentBlock.data,
          currentBlock.nonce
        )
      ) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }

  return {
    blockchain,
    addNewBlock,
    checkChainValidity,
  };
}

// Testing the blockchain
const smashingCoin = createBlockchain();

console.log("smashingCoin mining in progress....");
smashingCoin.addNewBlock(
  createBlock(1, "01/06/2020", {
    sender: "Iris Ljesnjanin",
    recipient: "Cosima Mielke",
    quantity: 50,
  })
);

smashingCoin.addNewBlock(
  createBlock(2, "01/07/2020", {
    sender: "Vitaly Friedman",
    recipient: "Ricardo Gimenes",
    quantity: 100,
  })
);

console.log(JSON.stringify(smashingCoin.blockchain, null, 4));
