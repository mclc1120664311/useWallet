import { useEffect, useState, useCallback } from 'react';
import * as ethers from 'ethers';
import { errorFunction } from './utils';
import { getAddChainParameters } from './constants/chainInfo';
import { decimalToHex } from './utils';

const provider = (function () {
  let result: ethers.ethers.providers.Web3Provider | null;
  if (typeof window.ethereum !== 'undefined') {
    result = new ethers.providers.Web3Provider(window.ethereum, 'any');
  } else {
    result = null;
    alert('Connect failed: Please install wallet first.');
  }
  return result;
})();

const { ethereum } = window;

export interface useWalletType {
  address: string;
  setAddress: (address: string) => void;
  connect: () => Promise<any>;
  logOut: () => void;
  isLogout: Boolean;
  currentChainId: number;
  handleSwitchChain: (chainId: number) => Promise<any>;
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
  }, [setAddress]);
  const handleAccountsChanged = useCallback(
    (accounts: any) => {
      return new Promise(async (resolve, reject) => {
        let isUnlocked = true;
        await ethereum._metamask.isUnlocked().then((result: boolean) => {
          isUnlocked = result;
        });
        if (!isUnlocked) {
          setAddress('');
          reject(new Error('MetaMask is locked'));
        }
        if (accounts?.length === 0) {
          setAddress('');
          reject('please connect first');
        } else {
          // 检测账户切换后更新账户地址
          setisLogout(false);
          setAddress(accounts[0]);
          resolve({ address: accounts[0] });
        }
      });
    },
    [setAddress],
  );

  const connect: useWalletType['connect'] = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!provider) {
        return reject(new Error('please connect first'));
      }
      if (address) {
        return;
      }
      // if (!chain) {
      //   return reject(new Error("this chain hasn't been supported yet."));
      // }
      provider
        .send('eth_requestAccounts', [])
        .then(async (chainId) => {
          try {
            const res = await handleAccountsChanged(chainId);
            resolve(res);
          } catch (err) {
            reject(err);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }, [handleAccountsChanged, address]);

  const handleChainChanged = useCallback(
    (chainId: any) => {
      const _chainId = Number(chainId);
      if (supportedChainIds.includes(Number(chainId))) {
        setChain(_chainId);
        setisLogout(false);
      } else {
        console.log("please connect first or this chain hasn't been supported yet.");
        setChain('');
        logOut();
      }
    },
    [logOut, supportedChainIds],
  );

  const handleSwitchChain = useCallback(async (chainId: number) => {
    return new Promise(async (resolve, reject) => {
      const HexString = decimalToHex(Number(chainId));
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: HexString }],
        });
        setisLogout(false);
        setChain(chainId);
        resolve({ chainId });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        // @ts-ignore
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [getAddChainParameters(chainId)],
            });
            setChain(chainId);
          } catch (addError) {
            reject(addError);
          }
        }
        reject(switchError);
      }
    });
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
    if (provider && !isLogout) {
      getChain();
    }
  }, [isLogout, getChain, chain]);

  useEffect(() => {
    // chain 初始值为 -1 需等待获取chainId后才判断是否要连接
    const init = async () => {
      try {
        await connect();
      } catch (err) {
        console.log(err);
      }
    };
    if (![-1, ''].includes(chain) && !isLogout) {
      init();
    }
  }, [chain, connect, isLogout]);

  useEffect(() => {
    const handleAccountChange = async (accounts: any) => {
      try {
        await handleAccountsChanged(accounts);
      } catch (err) {
        console.log(err);
      }
    };
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
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
    isLogout,
  };
};
