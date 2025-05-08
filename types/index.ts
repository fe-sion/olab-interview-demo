export interface Topic {
  id: string;
  title: string;
  labelName: string[];
  yesPercentage: number;
  noPercentage: number;
  yesAmount: string;
  noAmount: string;
  totalAmount: string;
  currency: string;
  trend: {
    direction: 'up' | 'down';
    percentage: number;
  };
  commentCount: number;
  imageUrl?: string;
  chainId?: number;
} 