'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { 
  FileText, 
  Search, 
  Calendar, 
  Code, 
  Zap, 
  TrendingUp,
  Clock,
  Users,
  BarChart3
} from "lucide-react";

export function Dashboard() {
  const { projects, setCurrentView } = useAppStore();
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('vi-VN'));
    };
    
    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "Tổng Dự Án",
      value: projects.length,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Nội Dung Đã Tạo",
      value: "127",
      icon: Zap,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Truy Vấn Nghiên Cứu",
      value: "43",
      icon: Search,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Đoạn Code",
      value: "89",
      icon: Code,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const quickActions = [
    {
      title: "Tạo Nội Dung",
      description: "Tạo blog, bài viết và nội dung sáng tạo",
      icon: FileText,
      view: 'content-studio' as const,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      title: "Nghiên Cứu Chủ Đề",
      description: "Tìm kiếm và phân tích thông tin",
      icon: Search,
      view: 'research' as const,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    },
    {
      title: "Công Cụ Năng Suất",
      description: "Quản lý tác vụ và lịch trình",
      icon: Calendar,
      view: 'productivity' as const,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      title: "Công Cụ Phát Triển",
      description: "Tạo code và debug",
      icon: Code,
      view: 'dev-tools' as const,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700"
    }
  ];

  const recentProjects = projects.slice(0, 5);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800" suppressHydrationWarning={true}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              AI Workspace Hub
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mt-2">🇻🇳 Nền tảng AI cho người Việt Nam</p>
          </div>
          <div className="flex items-center justify-center lg:justify-end space-x-2 text-sm text-gray-300 bg-slate-800 rounded-lg px-4 py-3 shadow-lg border border-slate-600">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Cập nhật: </span>
            <span>{mounted ? currentTime : '--:--:--'}</span>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-slate-800 border-slate-600 border-2 hover:shadow-lg hover:shadow-slate-700/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 hover:bg-slate-750">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full bg-slate-700 border-2 border-slate-600 shadow-sm`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-300">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg border-slate-600 bg-slate-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-white">Hành Động Nhanh</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Truy cập nhanh các công cụ AI phổ biến nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className={`h-auto p-6 flex flex-col space-y-3 text-left border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${action.color} ${action.hoverColor} text-white border-transparent`}
                onClick={() => setCurrentView(action.view)}
              >
                <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm w-fit">
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{action.title}</h3>
                  <p className="text-sm text-white/90">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl hover:shadow-slate-700/20 transition-shadow duration-300 bg-slate-800 border-slate-600">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-600">
            <CardTitle className="flex items-center space-x-3 text-white">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span>Dự Án Gần Đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600 hover:shadow-md hover:shadow-slate-600/20 transition-all duration-200 hover:bg-slate-650">
                    <div>
                      <h4 className="font-semibold text-white">{project.name}</h4>
                      <p className="text-sm text-gray-300">{project.description}</p>
                    </div>
                    <div className="text-xs text-cyan-400 font-medium">
                      {mounted ? new Date(project.updatedAt).toLocaleDateString('vi-VN') : '--/--/----'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <div className="p-4 bg-slate-700 rounded-full w-fit mx-auto mb-4">
                  <FileText className="h-12 w-12 text-cyan-400" />
                </div>
                <p className="text-lg font-medium text-white">Chưa có dự án nào</p>
                <p className="text-sm">Tạo dự án đầu tiên của bạn!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl hover:shadow-slate-700/20 transition-shadow duration-300 bg-slate-800 border-slate-600">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-600">
            <CardTitle className="flex items-center space-x-3 text-white">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span>Hoạt Động Gần Đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white">Tạo nội dung đang hoạt động</span>
                </div>
                <span className="text-xs text-gray-400">2 phút trước</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-white">Hoàn thành nghiên cứu</span>
                </div>
                <span className="text-xs text-gray-400">5 phút trước</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-white">Tạo đoạn code mới</span>
                </div>
                <span className="text-xs text-gray-400">12 phút trước</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-white">Lên lịch tác vụ</span>
                </div>
                <span className="text-xs text-gray-400">1 giờ trước</span>              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
