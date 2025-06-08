import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  content: string
  type: 'content' | 'code' | 'research' | 'workflow'
}

interface AppState {
  // UI State
  currentView: 'dashboard' | 'content-studio' | 'research' | 'productivity' | 'dev-tools'
  sidebarOpen: boolean
  theme: 'light' | 'dark'

  // Projects
  projects: Project[]
  currentProject: Project | null

  // AI Generated Content
  generatedContent: string
  isGenerating: boolean

  // Search Results
  searchResults: any[]
  isSearching: boolean

  // Actions
  setCurrentView: (view: AppState['currentView']) => void
  toggleSidebar: () => void
  toggleTheme: () => void
  
  // Project Actions
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void

  // Content Actions
  setGeneratedContent: (content: string) => void
  setIsGenerating: (loading: boolean) => void

  // Search Actions
  setSearchResults: (results: any[]) => void
  setIsSearching: (searching: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentView: 'dashboard',
      sidebarOpen: true,
      theme: 'dark', // Đổi default thành dark để consistent với UI
      projects: [],
      currentProject: null,
      generatedContent: '',
      isGenerating: false,
      searchResults: [],
      isSearching: false,

      // Actions
      setCurrentView: (view) => set({ currentView: view }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),

      // Project Actions
      createProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          projects: [newProject, ...state.projects],
        }))
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          ),
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }))
      },

      setCurrentProject: (project) => set({ currentProject: project }),

      // Content Actions
      setGeneratedContent: (content) => set({ generatedContent: content }),
      setIsGenerating: (loading) => set({ isGenerating: loading }),

      // Search Actions
      setSearchResults: (results) => set({ searchResults: results }),
      setIsSearching: (searching) => set({ isSearching: searching }),
    }),
    {
      name: 'ai-workspace-storage',
      partialize: (state) => ({
        theme: state.theme,
        projects: state.projects,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
