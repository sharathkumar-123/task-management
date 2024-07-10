import { Task } from '../types/Task';

export const filterTasks = (tasks: Task[], filters: Record<string, any>): Task[] => {
    return tasks.filter(task => {
        for (const key in filters) {
            if (filters.hasOwnProperty(key)) {
                const filterValue = filters[key];
                // Special case for 'Status'
                if (key === 'Status') {
                    const isCompleted = filterValue === 'completed';

                    if (task.completed !== isCompleted) {
                        return false;
                    }
                } else {
                    if (task[key as keyof Task] !== filterValue) {
                        return false;
                    }
                }
            }
        }
        return true;
    });
};

export const sortTasks = (tasks: Task[], sortBy: keyof Task | null, sortOrder: 'asc' | 'desc'): Task[] => {
    return tasks.sort((a, b) => {
        if (sortBy && sortOrder) {
            const factor = sortOrder === 'asc' ? 1 : -1;
            const valueA = a[sortBy];
            const valueB = b[sortBy];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return valueA.localeCompare(valueB) * factor;
            } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                return (valueA - valueB) * factor;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    });
};

export const searchTasks = (tasks: Task[], searchQuery: string): Task[] => {
    return tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
};
