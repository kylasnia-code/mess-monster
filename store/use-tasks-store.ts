import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CleaningTask } from './types';

interface TasksState {
  tasks: CleaningTask[];
  addTask: (task: CleaningTask) => void;
  removeTask: (id: string) => void;
  clearHistory: () => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      clearHistory: () => set({ tasks: [] }),
    }),
    {
      name: 'mm-tasks',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
