'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckSquare, 
  Calendar, 
  Clock, 
  Users, 
  Target,
  Plus,
  MoreHorizontal,
  Filter,
  SortAsc
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number;
  type: 'meeting' | 'deadline' | 'reminder';
}

export function ProductivitySuite() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Hoàn thành đề xuất dự án AI',
      description: 'Soạn thảo và xem xét tài liệu đề xuất',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      category: 'Công việc'
    },    {
      id: '2',
      title: 'Xem xét báo cáo tuần',
      completed: true,
      priority: 'medium',
      category: 'Kinh doanh'
    },
    {
      id: '3',
      title: 'Họp nhóm hàng ngày',
      completed: false,
      priority: 'medium',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      category: 'Họp hành'
    }
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Họp khởi động dự án',
      description: 'Phiên lập kế hoạch ban đầu cho tính năng AI mới',
      date: new Date(Date.now() + 3 * 60 * 60 * 1000),
      duration: 60,
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Hạn nộp báo cáo quý',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      duration: 0,
      type: 'deadline'
    }
  ]);

  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const, category: 'Work' });

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      category: newTask.category
    };
    
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', category: 'Work' });
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/30 border-red-700';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      case 'low': return 'text-green-400 bg-green-900/30 border-green-700';
      default: return 'text-gray-400 bg-gray-800 border-gray-600';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return 'Không xác định';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const upcomingEvents = events.filter(event => event.date > new Date()).length;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Bộ Công Cụ Năng Suất
          </h1>
          <p className="text-lg text-gray-300 mt-2">⚡ Quản lý tác vụ và thời gian hiệu quả</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
            <Filter className="h-4 w-4 mr-2" />
            Lọc
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
            <SortAsc className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <CheckSquare className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{completedTasks}/{totalTasks}</p>
                <p className="text-sm text-gray-300">Tasks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{upcomingEvents}</p>
                <p className="text-sm text-gray-300">Upcoming Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">85%</p>
                <p className="text-sm text-gray-300">Weekly Goal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-600">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-gray-300">Task Manager</TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-gray-300">Calendar</TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-gray-300">Notes</TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-gray-300">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5" />
                <span>Task Manager</span>
              </CardTitle>
              <CardDescription>
                Organize and track your tasks efficiently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Task */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="space-y-3">
                  <Input
                    placeholder="Task title..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      placeholder="Category"
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    />
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <Button onClick={addTask}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        task.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}
                    >
                      {task.completed && <CheckSquare className="h-3 w-3 text-white" />}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {task.category}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Due {task.dueDate.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Calendar & Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      event.type === 'meeting' ? 'bg-blue-500' : 
                      event.type === 'deadline' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-gray-600">{event.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{event.date.toLocaleString()}</span>
                        {event.duration > 0 && <span>{event.duration} minutes</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Write your notes here..."
                rows={10}
                className="w-full"
              />
              <div className="flex justify-end mt-4">
                <Button>Save Note</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Goals & Objectives</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Complete AI Project", progress: 75, deadline: "Next Week" },
                  { title: "Learn New Framework", progress: 40, deadline: "End of Month" },
                  { title: "Improve Productivity", progress: 85, deadline: "Ongoing" },
                  { title: "Team Leadership", progress: 60, deadline: "Next Quarter" }
                ].map((goal, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">{goal.title}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{goal.progress}% complete</span>
                      <span>{goal.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
