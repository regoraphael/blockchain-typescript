import { hash, isHashProofed } from "./helpers";

interface Block {
  header: {
    nonce: number;
    blockHash: string;
  };
  payload: {
    sequence: number;
    timestamp: number;
    data: any;
    previousHash: string;
  }
}

export class Blockchain {
  #chain: Block[] = [];
  private powPrefix = '0';
  private readonly difficult: number = 4

  constructor () {
    this.#chain.push(this.genesisBlock)
  }

  private get genesisBlock ():Block {
    const payload: Block['payload'] = {
      sequence: 0,
      timestamp: +new Date(),
      data: 'Genesis Block',
      previousHash: '',
    };

    const header: Block['header']  = {
      nonce: 0,
      blockHash: hash(JSON.stringify(payload))
    };

    return { payload, header };
  }

  get chain () {
    return this.#chain;
  }

  private get lastBlock (): Block {
    const lastIndex = this.#chain.length - 1;
    return this.#chain[lastIndex] as Block;
  }

  private get lastBlockSequence (): Block['payload']['sequence'] {
    return this.lastBlock.payload.sequence;
  }

  private get lastBlockHash (): Block['header']['blockHash'] {
    return this.lastBlock.header.blockHash;
  }

  private generateValidBlock (payload: Block['payload']): Block {
    let nonce = 0;
  
    while (true) {
      const blockHash = hash(JSON.stringify(payload))
      const proofingHash = hash(blockHash + nonce);
      if (isHashProofed({
        hash: proofingHash,
        difficulty: this.difficult,
        prefix: this.powPrefix,
      })) {
        return {
          payload,
          header: {
            nonce,
            blockHash
          }
        };
      }
      nonce += 1;
    }
  }

  mineBlock (data: any) {
    const payload: Block['payload'] = {
      sequence: this.lastBlockSequence + 1,
      timestamp: +new Date(),
      data,
      previousHash: this.lastBlockHash,
    };

    const block: Block = this.generateValidBlock(payload);

    return block;
  }

  validateBlock (block: Block) {
    const { payload, header: { nonce } } = block;

    if (payload.previousHash !== this.lastBlockHash) {
      console.error(`Invalid block #${payload.sequence}`);
      return;
    }

    if (!isHashProofed({
      hash: hash(hash(JSON.stringify(payload)) + nonce),
      difficulty: this.difficult,
      prefix: this.powPrefix,
    })) {
      console.error(`Invalid block #${payload.sequence}`);
      return;
    }

    return true;
  }

  pushBlock (block: Block) {
    if (this.validateBlock(block)) this.#chain.push(block);
  }

}