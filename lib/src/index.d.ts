export * from "./chainInfo";
export * from "./chains";
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
declare function useWallet({ supportedChainIds }: useWalletProps): useWalletType;
export default useWallet;
