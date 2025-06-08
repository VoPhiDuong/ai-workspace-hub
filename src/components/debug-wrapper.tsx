'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Bug, X } from "lucide-react";
import dynamic from 'next/dynamic';

const DebugPanel = dynamic(() => import('@/components/debug-panel').then(mod => ({ default: mod.DebugPanel })), {
  ssr: false
});

export function DebugWrapper() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Chỉ kiểm tra development mode ở client side
    setIsDevelopment(process.env.NODE_ENV === 'development');
  }, []);

  // Không render gì nếu không phải development mode
  if (!isDevelopment) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      {!isVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsVisible(true)}
            className="rounded-full p-3 bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
            title="Mở Debug Panel"
          >
            <Bug className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Debug Panel Modal */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Debug Panel</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <DebugPanel />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 