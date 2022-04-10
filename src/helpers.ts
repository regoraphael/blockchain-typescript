import { BinaryLike, createHash } from 'crypto';

interface ParamsIsHashProfeed {
  hash: string;
  difficulty?: number;
  prefix?: string;
}

export const generateHash = (data: BinaryLike) => createHash('sha256').update(data).digest('hex');

export const isHashProofed = ({
  hash,
  difficulty = 4,
  prefix = '0',
}:ParamsIsHashProfeed) => {
  const check = prefix.repeat(difficulty);
  return hash.startsWith(check);
};
