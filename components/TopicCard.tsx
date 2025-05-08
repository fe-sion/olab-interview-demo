import React from "react";
import Image from "next/image";
import { Topic } from "../types";
import { isNaN, isNumber } from "lodash-es";

interface TopicCardProps {
  topic: Topic;
}

const getCategoryColor = (category: string): string => {
  const categories: Record<string, string> = {
    Crypto: "bg-purple-700",
    Politics: "bg-blue-700",
    Sports: "bg-blue-500",
    Business: "bg-amber-700",
    "Monad Community": "bg-gray-700",
    未分类: "bg-gray-600",
  };

  return categories[category] || "bg-gray-600";
};

const numberFormat = (num: number) => {
  if (!isNumber(num) || isNaN(num)) return "0.00";
  try {
    const res = num.toFixed(2);
    return isNaN(res) ? "0.00" : res;
  } catch (error) {
    return "0.00";
  }
};

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const trendColor =
    topic.trend.direction === "up" ? "text-green-500" : "text-red-500";
  const progressBarColor =
    topic.yesPercentage > 50 ? "bg-green-500" : "bg-red-500";

  return (
    <div className="card relative">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          {topic.labelName.length > 0 && (
            <span
              className={`category-tag ${getCategoryColor(topic.labelName[0])}`}
            >
              {topic.labelName[0]}
            </span>
          )}
          <button className="text-white opacity-50 hover:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center mb-4">
          {topic.imageUrl && (
            <div className="mr-2 w-12 h-12 relative overflow-hidden flex-shrink-0">
              <img
                src={topic.imageUrl}
                alt={topic.title}
                className="rounded-full object-cover w-full h-full"
              />
            </div>
          )}
          <h2 className="text-lg font-bold r-2-hidden align-top">
            {topic.title}
          </h2>
        </div>

        <div className="relative h-2 bg-gray-700 rounded-full mb-4">
          <div
            className={`absolute top-0 left-0 h-full ${progressBarColor} rounded-full`}
            style={{ width: `${topic.yesPercentage}%` }}
          />
          <div
            className="progress-indicator"
            style={{
              right: "-10px",
              top: "-24px",
              backgroundColor: progressBarColor,
            }}
          >
            <div className={`f-12 ${trendColor} mr-2`}>
              {topic.trend.percentage > 0 && (
                <>
                  {topic.trend.direction === "up" ? "↑" : "↓"}
                  {numberFormat(topic.trend.percentage)}%
                </>
              )}
            </div>
            {numberFormat(topic.yesPercentage)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <button className="btn-yes">
            Yes
            <div className="text-xs opacity-80">
              {numberFormat(parseFloat(topic.yesAmount))}
            </div>
          </button>
          <button className="btn-no">
            No
            <div className="text-xs opacity-80">
              {numberFormat(parseFloat(topic.noAmount))}
            </div>
          </button>
        </div>

        <div className="flex justify-between text-sm text-gray-400">
          <div>{numberFormat(parseFloat(topic.totalAmount))}</div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {topic.commentCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
