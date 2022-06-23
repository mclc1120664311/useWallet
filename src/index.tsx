import { useEffect, useState, useCallback, useRef } from "react";
import * as ethers from "ethers";
import { errorFunction, toHome } from "./utils";
// import { useWhyDidYouUpdate } from "ahooks";
import { getAddChainParameters } from "./chainInfo";
import { decimalToHex } from "./utils";

export * from "./chainInfo";
export * from "./chains";

const provider = (function () {
  let result: ethers.ethers.providers.Web3Provider;
  if (typeof window.ethereum !== "undefined") {
    result = new ethers.providers.Web3Provider(window.ethereum, "any");
  } else {
    result = null;
    if (process.env.platform === "h5") {
      alert(
        "Connect failed: Please install wallet first or please refresh the browser page"
      );
    } else {
      alert("Connect failed: Please install wallet first.");
    }
  }
  return result;
})();

const { ethereum } = window;

interface useWalletType {
  address: string;
  setAddress: (address: string) => void;
  getAccount: () => void;
  logOut: () => void;
  handleSwitchChain: (chainId: number) => void;
}

interface useWalletProps {
  supportedChainIds: number[];
}

function useWallet({ supportedChainIds }: useWalletProps): useWalletType {
  const [address, setAddress] = useState("");
  const chain = useRef("");
  // const [provider, setprovider] = useState(null);
  const [isLogout, setisLogout] = useState(false);

  // useWhyDidYouUpdate("useWallet", { provider, address });

  const logOut = useCallback(() => {
    setisLogout(true);
    setAddress("");
    toHome();
  }, [setAddress]);
  const handleAccountsChanged = useCallback(
    async (accounts: any) => {
      let isUnlocked = true;
      await ethereum._metamask.isUnlocked().then((result: boolean) => {
        isUnlocked = result;
      });
      if (!isUnlocked) {
        alert("MetaMask is locked");
      }
      if (accounts?.length === 0) {
        setAddress("");
        window.localStorage.setItem("userAddress", "");
        toHome();
      } else {
        // 检测账户切换后更新账户地址
        setAddress(accounts[0]);
        const userAdress = window.localStorage.getItem("userAddress");
        if (!accounts[0]) return;
        if (!userAdress) {
          window.localStorage.setItem("userAddress", accounts[0]);
          setAddress(accounts[0]);
        } else if (userAdress !== accounts[0]) {
          window.localStorage.setItem("userAddress", accounts[0]);
          setAddress(accounts[0]);
          window.location.reload();
        }
      }
    },
    [setAddress]
  );

  const getAccount = useCallback(() => {
    if (!provider) {
      return alert("please connect first");
    }
    if (address) {
      return;
    }
    if (!chain.current) {
      return alert(
        "please connect first or this chain hasn't been supported yet."
      );
    }
    provider
      ? provider
          ?.send("eth_requestAccounts", [])
          .then(handleAccountsChanged)
          .catch((error: any) => {
            errorFunction(error);
          })
      : errorFunction("Connect failed: Please install wallet first.");
  }, [handleAccountsChanged, address]);

  const handleChainChanged = useCallback(
    (chainId: any) => {
      if (supportedChainIds.includes(chainId)) {
        chain.current = chainId;
        getAccount();
      } else {
        alert("This chain hasn't been supported yet.");
        chain.current = "";
        logOut();
      }
    },
    [logOut, getAccount]
  );

  const handleSwitchChain = useCallback(async (chainId: number) => {
    const HexString = decimalToHex(chainId);
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: HexString }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
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
      : errorFunction("Connect failed: Please install wallet first.");
  }, [handleChainChanged]);

  // 检测用户是否锁定了账户

  // 获取账户地址 (ethers)

  useEffect(() => {
    if (provider && !isLogout) {
      getChain();
    }
  }, [isLogout, getChain]);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }
    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  return { address, setAddress, getAccount, logOut, handleSwitchChain };
}
export default useWallet;
