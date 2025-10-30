import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // Estado del Sidebar
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  openSidebar: () => set({ sidebarOpen: true }),
  
  // Navegación activa
  activeView: 'home', // 'home', 'trivia'
  setActiveView: (view) => set({ activeView: view }),
  
  // Título del header (se actualiza dinámicamente según la página)
  pageTitle: 'Biblioteca',
  setPageTitle: (title) => set({ pageTitle: title }),
}));

