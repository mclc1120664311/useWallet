import { useEffect, useState, useCallback } from 'react';
import * as ethers from 'ethers';
import { errorFunction, unConnectTips } from './utils';
import { getAddChainParameters } from './constants/chainInfo';
import { decimalToHex } from './utils';

const provider = (function () {
  let result: ethers.ethers.providers.Web3Provider | null;
  if (typeof window.ethereum !== 'undefined') {
    result = new ethers.providers.Web3Provider(window.ethereum, 'any');
  } else {
    result = null;
    if (process.env.platform === 'h5') {
      alert(
        'Connect failed: Please install wallet first or please refresh the browser page',
      );
    } else {
      alert('Connect failed: Please install wallet first.');
    }
  }
  return result;
})();

const { ethereum } = window;

export interface useWalletType {
  address: string;
  setAddress: (address: string) => void;
  connect: () => void;
  logOut: () => void;
  currentChainId: number;
  handleSwitchChain: (chainId: number) => void;
}

export interface useWalletProps {
  supportedChainIds: number[];
}

export const useWallet = ({ supportedChainIds }: useWalletProps): useWalletType => {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState<any>(-1);
  // const [provider, setprovider] = useState(null);
  const [isLogout, setisLogout] = useState(false);

  const logOut = useCallback(() => {
    setisLogout(true);
    setAddress('');
    unConnectTips();
  }, [setAddress]);
  const handleAccountsChanged = useCallback(
    async (accounts: any, cb?: Function) => {
      let isUnlocked = true;
      await ethereum._metamask.isUnlocked().then((result: boolean) => {
        isUnlocked = result;
      });
      if (!isUnlocked) {
        alert('MetaMask is locked');
      }
      if (accounts?.length === 0) {
        setAddress('');
        window.localStorage.setItem('userAddress', '');
        unConnectTips();
      } else {
        // 检测账户切换后更新账户地址
        setAddress(accounts[0]);
        cb && cb();
      }
    },
    [setAddress],
  );

  const connect = useCallback(
    (cb?: Function) => {
      if (!provider) {
        return alert('please connect first');
      }
      if (address) {
        return;
      }
      if (!chain) {
        return alert("this chain hasn't been supported yet.");
      }
      provider
        .send('eth_requestAccounts', [])
        .then((chainId) => handleAccountsChanged(chainId, cb))
        .catch((error: any) => {
          errorFunction(error);
        });
    },
    [handleAccountsChanged, address, chain],
  );

  const handleChainChanged = useCallback(
    (chainId: any) => {
      const _chainId = Number(chainId);
      if (supportedChainIds.includes(Number(chainId))) {
        setChain(_chainId);
      } else {
        alert("please connect first or this chain hasn't been supported yet.");
        setChain('');
        logOut();
      }
    },
    [logOut, connect],
  );

  const handleSwitchChain = useCallback(async (chainId: number) => {
    const HexString = decimalToHex(Number(chainId));
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: HexString }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      // @ts-ignore
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [getAddChainParameters(chainId)],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
    }
  }, []);

  const getChain = useCallback(() => {
    provider
      ? provider
          .getNetwork()
          .then(({ chainId }: { chainId: any }) => {
            // 将十进制结果转换为十六进制字符串
            const result_ = decimalToHex(chainId);
            handleChainChanged(result_);
          })
          .catch((error: any) => {
            errorFunction(error);
          })
      : errorFunction('Connect failed: Please install wallet first.');
  }, [handleChainChanged]);

  // 检测用户是否锁定了账户

  // 获取账户地址 (ethers)

  useEffect(() => {
    if (provider && !isLogout && chain === -1) {
      getChain();
    }
  }, [isLogout, getChain]);

  useEffect(() => {
    // chain 初始值为 -1 需等待获取chainId后才判断是否要连接
    if (![-1, ''].includes(chain)) {
      connect();
    }
  }, [chain]);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  return {
    address,
    setAddress,
    connect,
    logOut,
    currentChainId: chain,
    handleSwitchChain,
  };
};
