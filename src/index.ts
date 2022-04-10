
import { Blockchain } from './blockchain'

const blockchain = new Blockchain();
const blockNumber = 10;

for (let i = 1; i <= blockNumber; i += 1) {
  const block = blockchain.mineBlock(`Block ${i}`);

  blockchain.pushBlock(block);
}

console.log('--- GENERATED CHAIN ---\n');
console.log(blockchain.chain);
