'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, Search, Settings, User } from 'lucide-react'

export function Header() {
  const { sidebarOpen, currentView } = useAppStore()
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    setMounted(true)
    setCurrentDate(new Date().toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }))
  }, [])

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Bảng Điều Khiển'
      case 'content-studio':
        return 'Studio Nội Dung AI'
      case 'research':
        return 'Trung Tâm Nghiên Cứu'
      case 'productivity':
        return 'Bộ Công Cụ Năng Suất'
      case 'dev-tools':
        return 'Công Cụ Phát Triển'
      default:
        return 'AI Workspace Hub'
    }
  }
  return (
    <header 
      className="h-16 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600 shadow-lg backdrop-blur"
      suppressHydrationWarning={true}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
          <p className="text-sm text-gray-300">
            Được hỗ trợ bởi AI • {mounted ? currentDate : 'Loading...'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm bất cứ thứ gì..."
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative hover:bg-slate-600 text-gray-300 hover:text-white">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-slate-600 text-gray-300 hover:text-white">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-slate-600 text-gray-300 hover:text-white">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
