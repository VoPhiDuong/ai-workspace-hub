'use client';

import dynamic from 'next/dynamic';

// Dynamic import components
const ClientOnlyApp = dynamic(() => import('@/components/client-only-app').then(mod => ({ default: mod.ClientOnlyApp })), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen bg-gray-50 items-center justify-center" suppressHydrationWarning={true}>
      <div className="text-center" suppressHydrationWarning={true}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" suppressHydrationWarning={true}></div>
        <p className="text-gray-600" suppressHydrationWarning={true}>Đang tải AI Workspace Hub...</p>
      </div>
    </div>
  )
});

const DebugWrapper = dynamic(() => import('@/components/debug-wrapper').then(mod => ({ default: mod.DebugWrapper })), {
  ssr: false
});

export default function Home() {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800" 
      suppressHydrationWarning={true}
    >
      <ClientOnlyApp />
      <DebugWrapper />
    </div>
  );
}
