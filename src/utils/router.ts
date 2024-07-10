import { FC, lazy } from 'react'

import { ROUTES } from '../constants/routes'

// pages
const TaskListPage = lazy(() => import('../pages/TaskListPage'));
const AddTaskPage = lazy(() => import('../pages/AddTaskPage'));
const EditTaskPage = lazy(() => import('../pages/EditTaskPage'));
const TaskDetailsPage = lazy(() => import('../pages/TaskDetailsPage'));

interface Route {
  key: string
  title: string
  path: string
  component: FC<{}>
}

export const routes: Route[] = [
  {
    key: 'task-list-route',
    title: 'TaskListPage',
    path: ROUTES.TASK_LIST,
    component: TaskListPage
  },
  {
    key: 'add-task-route',
    title: 'Add Task',
    path: ROUTES.ADD_TASK,
    component: AddTaskPage
  },
  {
    key: 'edit-task-route',
    title: 'Edit Task',
    path: ROUTES.EDIT_TASK,
    component: EditTaskPage
  },
  {
    key: 'task-details-route',
    title: 'Task Details',
    path: ROUTES.TASK_DETAILS,
    component: TaskDetailsPage
  },
]
