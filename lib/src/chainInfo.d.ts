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
        name: string;
        symbol: string;
        decimals: number;
    };
    readonly urls: Array<string | undefined>;
    readonly blockExplorerUrls?: string[] | undefined;
}
export interface ChainInfoMap {
    readonly [chainId: number]: BaseChainInfo;
}
export declare const CHAIN_INFO: ChainInfoMap;
export declare const getAddChainParameters: (chainId: any) => any;
