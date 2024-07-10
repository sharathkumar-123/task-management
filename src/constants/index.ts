import { FilterConfig } from "../types/Task";

export const ROWS_PER_PAGE = 5;

export const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
];

export enum TaskStatus {
    Pending = 'pending',
    Completed = 'completed',
}

export const filterConfigs: FilterConfig[] = [
    {
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Completed', value: 'completed' },
        { label: 'Pending', value: 'pending' },
      ],
    },
  ];

  