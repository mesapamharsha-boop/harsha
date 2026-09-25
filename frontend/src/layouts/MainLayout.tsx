import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export interface MainLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (to: string) => void;
  brandName?: string;
  email?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
  brandName = 'LEOX',
  email = 'leoxshoots@gmail.com',
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#08080a] text-[#f2f2f4]">
      <Navbar currentPath={currentPath} onNavigate={onNavigate} />
      <main className="flex-1">{children}</main>
      <Footer navigate={onNavigate} />
    </div>
  );
};
