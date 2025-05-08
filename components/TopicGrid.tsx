import React from 'react';
import { Topic } from '../types';
import TopicCard from './TopicCard';

interface TopicGridProps {
  topics: Topic[];
}

const TopicGrid: React.FC<TopicGridProps> = ({ topics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
};

export default TopicGrid; 