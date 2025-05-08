import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import TopicGrid from '../components/TopicGrid';
import ChainSelector from '../components/ChainSelector';
import { fetchTopics, TopicsParams } from '../services/api';
import { Topic } from '../types';
import { useChainId, useAccount } from 'wagmi';

interface HomeProps {
  initialTopics: Topic[];
  initialTotal: number;
}

const Home: React.FC<HomeProps> = ({ initialTopics, initialTotal }) => {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<number>(10143); // 默认 Monad Testnet
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalTopics, setTotalTopics] = useState<number>(initialTotal);
  const [hasMoreTopics, setHasMoreTopics] = useState<boolean>(initialTotal > initialTopics.length);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const walletChainId = useChainId();
  const { isConnected } = useAccount();
  
  // 确保组件只在客户端渲染
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 当钱包连接时使用钱包链ID，否则使用手动选择的链ID
  const effectiveChainId = isConnected ? walletChainId : selectedChain;

  const loadTopics = async (params: TopicsParams) => {
    try {
      const result = await fetchTopics({
        ...params,
        chainId: effectiveChainId
      });
      return result;
    } catch (err) {
      console.error('获取数据失败:', err);
      setError('获取数据失败，请稍后再试');
      return { topics: [], total: 0 };
    }
  };

  const refreshTopics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loadTopics({ page: 1 });
      setTopics(result.topics);
      setTotalTopics(result.total);
      setCurrentPage(1);
      setHasMoreTopics(result.topics.length < result.total);
    } catch (err) {
      // 错误已在 loadTopics 中处理
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreTopics = async () => {
    if (isLoadingMore || !hasMoreTopics) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const result = await loadTopics({ page: nextPage });
      
      if (result.topics.length > 0) {
        setTopics(prev => [...prev, ...result.topics]);
        setCurrentPage(nextPage);
        setHasMoreTopics(topics.length + result.topics.length < result.total);
      } else {
        // 如果没有返回新数据，说明已经加载完所有数据
        setHasMoreTopics(false);
      }
    } catch (err) {
      // 错误已在 loadTopics 中处理
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 当有效链ID变化时刷新话题
  useEffect(() => {
    if (isMounted) {
      refreshTopics();
    }
  }, [effectiveChainId, isMounted]);

  useEffect(() => {
    // 自动刷新数据，每60秒一次
    if (!isMounted) return;
    
    const intervalId = setInterval(() => {
      refreshTopics();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [effectiveChainId, isMounted]);

  // 渲染底部按钮部分
  const renderBottomButton = () => {
    if (!isMounted) {
      return <div className="h-12"></div>; // 占位高度
    }
    
    if (isLoading) {
      return null;
    }
    
    if (hasMoreTopics) {
      return (
        <button 
          onClick={loadMoreTopics}
          disabled={isLoadingMore}
          className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-600 disabled:opacity-50"
        >
          {isLoadingMore ? '加载中...' : '查看更多话题'}
        </button>
      );
    } else if (topics.length > 0) {
      return (
        <div className="py-3 px-4 bg-gray-800 rounded-md inline-block">
          <p className="text-gray-400">已加载全部话题</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Layout title="预测市场 | 热门话题">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">热门预测话题</h2>
          <div className="flex items-center space-x-3">
            {isMounted && !isConnected && (
              <ChainSelector 
                onChainChange={setSelectedChain}
                currentChain={selectedChain}
              />
            )}
            <button 
              onClick={refreshTopics}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? '加载中...' : '刷新'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {isMounted && (
          <div className="mb-4 text-sm text-gray-400">
            {isConnected ? (
              <p>当前显示来自连接钱包链的话题</p>
            ) : (
              <p>未连接钱包，使用选择的链显示话题</p>
            )}
          </div>
        )}
        
        {topics.length > 0 ? (
          <TopicGrid topics={topics} />
        ) : (
          <div className="text-center p-8 bg-primary bg-opacity-50 rounded-xl">
            {isLoading ? (
              <p>加载中...</p>
            ) : (
              <p>暂无预测话题</p>
            )}
          </div>
        )}
      </div>
      
      <div className="text-center mt-8">
        {renderBottomButton()}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const result = await fetchTopics();
    return {
      props: {
        initialTopics: result.topics,
        initialTotal: result.total,
      },
      // 每10分钟重新生成页面
      revalidate: 600,
    };
  } catch (error) {
    console.error('预加载数据失败:', error);
    return {
      props: {
        initialTopics: [],
        initialTotal: 0,
      },
      revalidate: 60,
    };
  }
};

export default Home; 