import { http, createConfig } from 'wagmi';
import { type Chain, mainnet, sepolia, zkSync, base } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

// 自定义 Monad 链定义
const monad = {
  id: 1337,
  name: 'Monad',
  network: 'monad',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MONAD',
  },
  rpcUrls: {
    public: { http: ['https://rpc.monad.xyz'] },
    default: { http: ['https://rpc.monad.xyz'] },
  },
} as const;

// 自定义 Monad Testnet 链定义
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MONAD',
  },
  rpcUrls: {
    public: { http: ['https://rpc-testnet.monad.xyz'] },
    default: { http: ['https://rpc-testnet.monad.xyz'] },
  },
} as const;

// Base 链已经在 wagmi/chains 中定义 (id 8453)

// 默认支持的链
export const supportedChains = [mainnet, monad, monadTestnet] as const;

// 特定链ID到API请求参数的映射
export const chainToApiParamMap: Record<number, number> = {
  1: 1, // Ethereum mainnet
  1337: 10143, // Monad (测试环境使用 Monad Testnet 的参数)
  10143: 10143, // Monad Testnet
};

// 获取chainId对应的API参数
export const getChainApiParam = (chainId: number): number => {
  return chainToApiParamMap[chainId] || 10143; // 默认使用Monad Testnet的参数
};

// wagmi 配置
export const config = createConfig({
  chains: supportedChains,
  transports: {
    [mainnet.id]: http(),
    [monad.id]: http(),
    [monadTestnet.id]: http(),
  },
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
}); 