import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from '../../utils/toast';
import { Task } from '../../types/Task';

const initialState: Task[] = [
  {
    id: 1,
    title: 'Buy groceries',
    description: 'Milk, Bread, Cheese, Eggs, Vegetables',
    dueDate: '2024-07-15',
    completed: false,
  },
  {
    id: 2,
    title: 'Meeting with team',
    description: 'Discuss project milestones and deadlines',
    dueDate: '2024-07-10',
    completed: false,
  },
  {
    id: 3,
    title: 'Dentist appointment',
    description: 'Routine check-up',
    dueDate: '2024-07-12',
    completed: true,
  },
];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.push(action.payload);
      toast.success('Task added successfully');
    },
    editTask: (state, action: PayloadAction<Task>) => {
      const index = state.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        toast.success('Task edited successfully');
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
        toast.success('Task deleted successfully');
      return state.filter(task => task.id !== action.payload);
    },
    toggleTaskCompletion: (state, action: PayloadAction<number>) => {
      const index = state.findIndex(task => task.id === action.payload);
      if (index !== -1) {
        state[index].completed = !state[index].completed;
        const message = state[index].completed ? 'Task marked as completed' : 'Task marked as pending';
        toast.success(message);
      }
    },
  },
});

export const { addTask, editTask, deleteTask, toggleTaskCompletion } = tasksSlice.actions;

export default tasksSlice.reducer;
