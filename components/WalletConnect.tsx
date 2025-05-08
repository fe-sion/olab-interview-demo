import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { supportedChains } from '../lib/wagmi';

const WalletConnect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // 确保组件只在客户端渲染
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // 获取链名称
  const getChainName = (id: number) => {
    const chain = supportedChains.find(c => c.id === id);
    return chain?.name || '未知链';
  };

  // 切换网络
  const handleSwitchNetwork = (newChainId: number) => {
    if (chainId !== newChainId) {
      try {
        switchChain({ chainId: newChainId });
      } catch (error) {
        console.error('切换网络失败:', error);
      }
    }
    setIsNetworkMenuOpen(false);
  };

  // 如果组件未挂载，返回一个占位按钮
  if (!isMounted) {
    return (
      <div className="relative">
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg opacity-80">
            连接钱包
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isConnected ? (
        <div className="flex items-center">
          <button
            onClick={() => setIsNetworkMenuOpen(!isNetworkMenuOpen)}
            className="mr-2 flex items-center bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg"
          >
            <span className="mr-2 px-2 py-1 rounded bg-green-600 text-xs">
              {getChainName(chainId)}
            </span>
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            <span>{formatAddress(address || '')}</span>
          </button>
          
          {isNetworkMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 top-full z-10">
              <div className="py-1" role="menu">
                <div className="px-4 py-2 text-sm text-gray-400">切换网络</div>
                {supportedChains.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => handleSwitchNetwork(chain.id)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      chain.id === chainId ? 'bg-gray-700 text-white' : 'text-white hover:bg-gray-700'
                    }`}
                    role="menuitem"
                  >
                    {chain.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 top-full z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={() => {
                    disconnect();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  role="menuitem"
                >
                  断开连接
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            连接钱包
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 top-full z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => {
                      connect({ connector });
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                    role="menuitem"
                  >
                    {connector.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 