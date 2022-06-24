import { decimalToHex } from '../utils';
import { SupportedChainId } from './chains';

const infuraKey = '023190592fbf472fade57c802b61c7b3';
const alchemyKey = '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC';
export interface BaseChainInfo {
  readonly blockWaitMsBeforeWarning?: number;
  readonly docs: string;
  readonly bridge?: string;
  readonly explorer: string;
  readonly infoLink: string;
  readonly logoUrl?: string;
  readonly label: string;
  readonly helpCenterUrl?: string;
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
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    urls: [
      infuraKey ? `https://mainnet.infura.io/v3/${infuraKey}` : undefined,
      alchemyKey ? `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}` : undefined,
      'https://cloudflare-eth.com',
    ].filter((url) => url !== undefined),
  },
  [SupportedChainId.RINKEBY]: {
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://rinkeby.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Rinkeby',
    nativeCurrency: { name: 'Rinkeby Ether', symbol: 'rETH', decimals: 18 },
    urls: [
      infuraKey ? `https://rinkeby.infura.io/v3/${infuraKey}` : undefined,
    ].filter((url) => url !== undefined),
  },
  [SupportedChainId.ROPSTEN]: {
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://ropsten.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Ropsten',
    nativeCurrency: { name: 'Ropsten Ether', symbol: 'ropETH', decimals: 18 },
    urls: [
      infuraKey ? `https://ropsten.infura.io/v3/${infuraKey}` : undefined,
    ].filter((url) => url !== undefined),
  },
  [SupportedChainId.KOVAN]: {
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://kovan.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Kovan',
    nativeCurrency: { name: 'Kovan Ether', symbol: 'kovETH', decimals: 18 },
    urls: [infuraKey ? `https://kovan.infura.io/v3/${infuraKey}` : undefined].filter(
      (url) => url !== undefined,
    ),
  },
  [SupportedChainId.GOERLI]: {
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://goerli.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Görli',
    nativeCurrency: { name: 'Görli Ether', symbol: 'görETH', decimals: 18 },
    urls: [
      infuraKey ? `https://goerli.infura.io/v3/${infuraKey}` : undefined,
    ].filter((url) => url !== undefined),
  },
  [SupportedChainId.POLYGON]: {
    bridge: 'https://wallet.polygon.technology/bridge',
    docs: 'https://polygon.io/',
    explorer: 'https://polygonscan.com/',
    infoLink: 'https://info.uniswap.org/#/polygon/',
    label: 'Polygon',
    nativeCurrency: { name: 'Polygon Matic', symbol: 'MATIC', decimals: 18 },
    urls: [
      infuraKey ? `https://polygon-mainnet.infura.io/v3/${infuraKey}` : undefined,
      'https://polygon-rpc.com',
    ].filter((url) => url !== undefined),
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [SupportedChainId.POLYGON_MUMBAI]: {
    bridge: 'https://wallet.polygon.technology/bridge',
    docs: 'https://polygon.io/',
    explorer: 'https://mumbai.polygonscan.com/',
    infoLink: 'https://info.uniswap.org/#/polygon/',
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
