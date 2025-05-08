import React, { ReactNode } from 'react';
import Head from 'next/head';
import WalletConnect from './WalletConnect';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = '预测市场 | Web3 Demo' 
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Web3预测市场应用" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-primary bg-opacity-80 shadow-md">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">预测市场</h1>
            <div className="flex items-center space-x-4">
              <nav>
                <ul className="flex space-x-4">
                  <li><a href="#" className="hover:text-yellow-400">热门</a></li>
                  <li><a href="#" className="hover:text-yellow-400">分类</a></li>
                  <li><a href="#" className="hover:text-yellow-400">创建</a></li>
                </ul>
              </nav>
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 mt-4">
        {children}
      </main>
      <footer className="bg-primary bg-opacity-80 mt-8 py-6 text-center text-gray-400">
        <div className="container mx-auto">
          <p>© 2024 预测市场 Web3 Demo</p>
        </div>
      </footer>
    </>
  );
};

export default Layout; 