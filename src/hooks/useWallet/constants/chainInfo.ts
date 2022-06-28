import { decimalToHex } from '../utils';
import { SupportedChainId } from './chains';

const infuraKey = '023190592fbf472fade57c802b61c7b3';
const alchemyKey = '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC';
export interface BaseChainInfo {
  readonly blockWaitMsBeforeWarning?: number;
  readonly explorer: string;
  readonly logoUrl?: string;
  readonly label: string;
  readonly nativeCurrency: {
    name: string; // e.g. 'Goerli ETH',
    symbol: string; // e.g. 'gorETH',
    decimals: number; // e.g. 18,
  };
  readonly urls: Array<string | undefined>;
  readonly blockExplorerUrls?: string[] | undefined;
}

export interface ChainInfoMap {
  readonly [chainId: number]: BaseChainInfo;
}

export const CHAIN_INFO: ChainInfoMap = {
  [SupportedChainId.MAINNET]: {
    explorer: 'https://etherscan.io/',
    label: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    urls: [
      infuraKey ? `https://mainnet.infura.io/v3/${infuraKey}` : undefined,
      alchemyKey ? `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}` : undefined,
      'https://cloudflare-eth.com',
    ].filter((url) => url !== undefined),
  },
  [SupportedChainId.RINKEBY]: {
    explorer: 'https://rinkeby.etherscan.io/',
    label: 'Rinkeby',
    nativeCurrency: { name: 'Rinkeby Ether', symbol: 'rETH', decimals: 18 },
    urls: [
      infuraKey ? `https://rinkeby.infura.io/v3/${infuraKey}` : undefined,
    ].filter((url) => url !== undefined),
  },
  [SupportedChainId.ROPSTEN]: {
    explorer: 'https://ropsten.etherscan.io/',
    label: 'Ropsten',
    nativeCurrency: { name: 'Ropsten Ether', symbol: 'ropETH', decimals: 18 },
    urls: [
      infuraKey ? `https://ropsten.infura.io/v3/${infuraKey}` : undefined,
    ].filter((url) => url !== undefined),
  },
  [SupportedChainId.KOVAN]: {
    explorer: 'https://kovan.etherscan.io/',
    label: 'Kovan',
    nativeCurrency: { name: 'Kovan Ether', symbol: 'kovETH', decimals: 18 },
    urls: [infuraKey ? `https://kovan.infura.io/v3/${infuraKey}` : undefined].filter(
      (url) => url !== undefined,
    ),
  },
  [SupportedChainId.GOERLI]: {
    explorer: 'https://goerli.etherscan.io/',
    label: 'Görli',
    nativeCurrency: { name: 'Görli Ether', symbol: 'görETH', decimals: 18 },
    urls: [
      infuraKey ? `https://goerli.infura.io/v3/${infuraKey}` : undefined,
    ].filter((url) => url !== undefined),
  },
  [SupportedChainId.POLYGON]: {
    explorer: 'https://polygonscan.com/',
    label: 'Polygon',
    nativeCurrency: { name: 'Polygon Matic', symbol: 'MATIC', decimals: 18 },
    urls: [
      infuraKey ? `https://polygon-mainnet.infura.io/v3/${infuraKey}` : undefined,
      'https://polygon-rpc.com',
    ].filter((url) => url !== undefined),
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [SupportedChainId.POLYGON_MUMBAI]: {
    explorer: 'https://mumbai.polygonscan.com/',
    label: 'Polygon Mumbai',
    nativeCurrency: {
      name: 'Polygon Mumbai Matic',
      symbol: 'mMATIC',
      decimals: 18,
    },
    urls: [
      infuraKey ? `https://polygon-mumbai.infura.io/v3/${infuraKey}` : undefined,
    ].filter((url) => url !== undefined),
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
  [SupportedChainId.BINANCE]: {
    explorer: 'https://bscscan.com/',
    label: 'BNB Smart Chain Testnet',
    nativeCurrency: {
      name: 'Binancec',
      symbol: 'BNB',
      decimals: 18,
    },
    urls: ['https://bsc-dataseed3.defibit.io'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  [SupportedChainId.BINANCE_TEST]: {
    explorer: 'https://testnet.bscscan.com/',
    label: 'BNB Smart Chain Testnet',
    nativeCurrency: {
      name: 'Polygon Mumbai Matic',
      symbol: 'BNB Test',
      decimals: 18,
    },
    urls: ['https://data-seed-prebsc-2-s2.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  },
};

function isExtendedChainInformation(chainInformation: BaseChainInfo) {
  return !!chainInformation.nativeCurrency;
}

export const getAddChainParameters = (chainId: any) => {
  const chainInformation = CHAIN_INFO[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId: decimalToHex(Number(chainId)),
      chainName: chainInformation.label,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId;
  }
};
