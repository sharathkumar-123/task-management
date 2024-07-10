export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    actions?:string;
  }

  export interface EditTask {
    id?:number;
    title: string;
    description: string;
    dueDate: string;
    status: string;
  }

  interface FilterOption {
    label: string;
    value: any;
  }
  
  export interface FilterConfig {
    label: string;
    type: 'select'; // Extend for other types as needed
    options: FilterOption[];
  }