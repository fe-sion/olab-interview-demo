import React, { useState, useEffect } from 'react';
import { supportedChains } from '../lib/wagmi';

interface ChainSelectorProps {
  onChainChange: (chainId: number) => void;
  disabled?: boolean;
  currentChain?: number;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({ 
  onChainChange, 
  disabled = false,
  currentChain = 10143 // 默认选择 Monad Testnet 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // 确保组件只在客户端渲染
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 获取当前选中的链
  const selectedChain = supportedChains.find(chain => chain.id === currentChain) || supportedChains[0];

  // 如果组件未挂载，返回一个占位按钮
  if (!isMounted) {
    return (
      <div className="relative">
        <button
          disabled={true}
          className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm bg-gray-800"
        >
          <span>加载中...</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
          disabled 
            ? 'bg-gray-700 opacity-50 cursor-not-allowed' 
            : 'bg-gray-800 hover:bg-gray-700'
        }`}
      >
        <span>{selectedChain.name}</span>
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
      
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-48 bg-gray-800 rounded-md shadow-lg">
          <ul className="py-1">
            {supportedChains.map((chain) => (
              <li 
                key={chain.id}
                className={`px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer ${
                  chain.id === currentChain ? 'bg-gray-700' : ''
                }`}
                onClick={() => {
                  onChainChange(chain.id);
                  setIsOpen(false);
                }}
              >
                {chain.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChainSelector; 