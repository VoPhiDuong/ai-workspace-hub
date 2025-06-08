'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { useHydration } from '@/hooks/use-hydration';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { ContentStudio } from '@/components/content-studio';
import { ResearchCenter } from '@/components/research-center';
import { ProductivitySuite } from '@/components/productivity-suite';
import { DevelopmentTools } from '@/components/development-tools';
import { Dashboard } from '@/components/dashboard';

export function ClientOnlyApp() {
  const { currentView, setCurrentView } = useAppStore();
  const hasHydrated = useHydration();

  // Set default view sau khi hydrate
  useEffect(() => {
    if (hasHydrated && !currentView) {
      setCurrentView('dashboard');
    }
  }, [hasHydrated, currentView, setCurrentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'content-studio':
        return <ContentStudio />;
      case 'research':
        return <ResearchCenter />;
      case 'productivity':
        return <ProductivitySuite />;
      case 'dev-tools':
        return <DevelopmentTools />;
      default:
        return <Dashboard />;
    }
  };

  // Loading state để tránh hydration mismatch
  if (!hasHydrated) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Đang khởi tạo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800" suppressHydrationWarning={true}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-800/50 via-gray-800/30 to-slate-700/40">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
} 