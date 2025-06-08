'use client'

import React from 'react'
import { useAppStore } from '@/store/app-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  PenTool, 
  Search, 
  Briefcase, 
  Code2, 
  Menu, 
  Sun, 
  Moon,
  Plus,
  Folder
} from 'lucide-react'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Bảng Điều Khiển', view: 'dashboard' as const },
  { icon: PenTool, label: 'Studio Nội Dung', view: 'content-studio' as const },
  { icon: Search, label: 'Trung Tâm Nghiên Cứu', view: 'research' as const },
  { icon: Briefcase, label: 'Năng Suất', view: 'productivity' as const },
  { icon: Code2, label: 'Công Cụ Dev', view: 'dev-tools' as const },
]

export function Sidebar() {
  const { 
    sidebarOpen, 
    currentView, 
    theme,
    projects,
    setCurrentView, 
    toggleSidebar, 
    toggleTheme,
    createProject 
  } = useAppStore()
  const handleCreateProject = () => {
    createProject({
      name: `Dự án mới ${projects.length + 1}`,
      description: 'Dự án được tạo bởi AI',
      content: '',
      type: 'content'
    })
  }

  return (
    <div 
      className={cn(
        "h-screen bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-600 shadow-xl transition-all duration-300 text-white",
        sidebarOpen ? "w-64" : "w-16"
      )}
      suppressHydrationWarning={true}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-600">
          <div className={cn("flex items-center space-x-2", !sidebarOpen && "justify-center")}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-bold text-lg text-white">Workspace Hub</span>
                <p className="text-xs text-gray-300">Dành cho người Việt</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 hover:bg-slate-700 text-gray-300 hover:text-white"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.view}
              variant={currentView === item.view ? "default" : "ghost"}
              className={cn(
                "w-full justify-start transition-all duration-200",
                !sidebarOpen && "justify-center px-2",
                currentView === item.view 
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md" 
                  : "hover:bg-slate-700 text-gray-300 hover:text-white"
              )}
              onClick={() => setCurrentView(item.view)}
            >
              <item.icon className={cn("h-4 w-4", sidebarOpen && "mr-2")} />
              {sidebarOpen && item.label}
            </Button>
          ))}
        </nav>

        {/* Projects Section */}
        {sidebarOpen && (
          <div className="p-4 border-t border-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-indigo-700">Dự Án</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCreateProject}
                className="h-6 w-6 hover:bg-indigo-100 text-indigo-600"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                >
                  <Folder className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs truncate">{project.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}        {/* Footer */}
        <div className="p-4 border-t border-indigo-200">
          <Button
            variant="ghost"
            size={sidebarOpen ? "default" : "icon"}
            onClick={toggleTheme}
            className={cn(
              "w-full hover:bg-indigo-100 text-indigo-700", 
              sidebarOpen ? "justify-start" : "justify-center"
            )}
          >
            {theme === 'light' ? (
              <Moon className={cn("h-4 w-4", sidebarOpen && "mr-2")} />
            ) : (
              <Sun className={cn("h-4 w-4", sidebarOpen && "mr-2")} />
            )}
            {sidebarOpen && (theme === 'light' ? 'Chế Độ Tối' : 'Chế Độ Sáng')}
          </Button>
        </div>
      </div>
    </div>
  )
}
