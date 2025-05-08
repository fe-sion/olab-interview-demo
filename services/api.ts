import axios from 'axios';
import { Topic } from '../types';
import { multiply } from 'lodash-es';
import { getChainApiParam } from '../lib/wagmi';

const API_URL = 'https://api-monad.olab.xyz/api/v2/topic';

interface ApiResponse {
  result: {
    list: any[];
    total: number;
  };
  errno: number;
  errmsg: string;
}

export interface TopicsParams {
  chainId?: number;
  page?: number;
  limit?: number;
}

export const fetchTopics = async (params: TopicsParams = {}): Promise<{topics: Topic[], total: number}> => {
  try {
    // 设置默认参数
    const { 
      chainId,
      page = 1,
      limit = 12
    } = params;
    
    // 获取链对应的API参数
    const chainParam = chainId ? getChainApiParam(chainId) : 10143; // 默认使用Monad Testnet
    
    const response = await axios.get<ApiResponse>(
      `${API_URL}?status=2&isShow=1&page=${page}&limit=${limit}&topicType=2&keywords=&sortBy=1&chainId=${chainParam}`
    );

    if (response.data.errno !== 0) {
      throw new Error(response.data.errmsg);
    }
    
    // 转换API响应为我们的Topic类型
    const topics = response.data.result.list.map(item => {
      const yesPercentage = multiply(item.yesBuyPrice, 100);
      const noPercentage = 100 - yesPercentage;
      
      // 确保 trend.direction 是 'up' 或 'down'
      const trendDirection: 'up' | 'down' = item.incRate >= 0 ? 'up' : 'down';
      
      return {
        id: item.topicId,
        title: item.title,
        labelName: item.labelName,
        yesPercentage: yesPercentage,
        noPercentage: noPercentage,
        yesAmount: `${parseFloat(item.yesBuyPrice).toFixed(2)} ${item.yesRemainToken || 'USDT'}`,
        noAmount: `${parseFloat(item.noBuyPrice).toFixed(2)} ${item.noRemainToken || 'USDT'}`,
        totalAmount: `${parseFloat(item.volume).toFixed(2)} ${item.token || 'USDT'}`,
        currency: item.token || 'USDT',
        trend: {
          direction: trendDirection,
          percentage: multiply(Math.abs(item.incRate || 0), 100)
        },
        commentCount: item.commentCount || 0,
        imageUrl: item.thumbnailUrl,
        chainId: chainParam, // 添加链ID信息
      };
    });
    
    return {
      topics,
      total: response.data.result.total || 0
    };
  } catch (error) {
    console.error('获取预测话题失败:', error);
    return {
      topics: [],
      total: 0
    };
  }
}; 