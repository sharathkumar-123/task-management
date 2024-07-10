import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import TaskListPage from '../TaskListPage';
import TaskDetailsPage from '../TaskDetailsPage';
import { deleteTask } from '../../store/task/tasksSlice';
import AddTaskPage from '../AddTaskPage';
import EditTaskPage from '../EditTaskPage';

const mockStore = configureStore([]);

describe('TaskListPage Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            tasks: [
                { id: 1, title: 'Task 1', description: 'Description 1', completed: false, dueDate: '2024-07-15' },
                { id: 2, title: 'Task 2', description: 'Description 2', completed: true, dueDate: '2024-07-10' },
                { id: 3, title: 'Task 3', description: 'Description 3', completed: false, dueDate: '2024-07-20' },
                { id: 4, title: 'Task 4', description: 'Description 4', completed: true, dueDate: '2024-07-05' },
            ],
        });
    });

    test('renders task list correctly', () => {
        render(
            <Provider store={store}>
                <Router>
                    <TaskListPage />
                </Router>
            </Provider>
        );

        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
        expect(screen.getByText('Task 3')).toBeInTheDocument();
        expect(screen.getByText('Task 4')).toBeInTheDocument();
    });

    test('displays completed and pending tasks correctly', () => {
        render(
            <Provider store={store}>
                <Router>
                    <TaskListPage />
                </Router>
            </Provider>
        );

        expect(screen.getAllByText('Completed').length).toBe(2);
        expect(screen.getAllByText('Pending').length).toBe(2);
    });

    test('filters tasks by search query', async () => {
        render(
            <Provider store={store}>
                <Router>
                    <TaskListPage />
                </Router>
            </Provider>
        );

        const searchInput = screen.getByPlaceholderText('Search tasks...');
        fireEvent.change(searchInput, { target: { value: 'Task 1' } });

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
            expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
            expect(screen.queryByText('Task 4')).not.toBeInTheDocument();
        });
    });

    test('sorts tasks by title in ascending order', async () => {
        render(
            <Provider store={store}>
                <Router>
                    <TaskListPage />
                </Router>
            </Provider>
        );

        const dueDateColumnHeader = screen.getByText('Title');
        fireEvent.click(dueDateColumnHeader);

        await waitFor(() => {
            const tasks = store.getState().tasks;
            expect(tasks[0].title).toBe('Task 1');
            expect(tasks[1].title).toBe('Task 2');
            expect(tasks[2].title).toBe('Task 3');
            expect(tasks[3].title).toBe('Task 4');
        });
    });

    test('navigates to AddTaskPage on add task button click', async () => {
        render(
            <Provider store={store}>
                <Router>
                    <Routes>
                        <Route path="/" element={<TaskListPage />} />
                        <Route path="/add-task" element={<AddTaskPage />} />
                    </Routes>
                </Router>
            </Provider>
        );
    
        fireEvent.click(screen.getByText('Add Task'));
    
        const elements = await screen.findAllByText('Add New Task');
        expect(elements.length).toBe(2);

        fireEvent.click(screen.getByLabelText('back'));

        await screen.findByText('Task List');

        const taskList = await screen.findByText('Task List');
        expect(taskList).toBeInTheDocument();
    });

    test('navigates to TaskDetailsPage on view icon click', async () => {
        render(
            <Provider store={store}>
                <Router>
                    <Routes>
                        <Route path="/" element={<TaskListPage />} />
                        <Route path="/task-details/:id" element={<TaskDetailsPage />} />
                    </Routes>
                </Router>
            </Provider>
        );
    
        fireEvent.click(screen.getByTestId('view-task-1'));
    
        const elements = await screen.findAllByText('Task Details');
        expect(elements.length).toBe(2);

        fireEvent.click(screen.getByLabelText('back'));

        await screen.findByText('Task List');

        const taskList = await screen.findByText('Task List');
        expect(taskList).toBeInTheDocument();
    });

    test('navigates to EditTaskPage on edit icon click', async () => {
        render(
            <Provider store={store}>
                <Router>
                    <Routes>
                        <Route path="/" element={<TaskListPage />} />
                        <Route path="/edit-task/:id" element={<EditTaskPage />} />
                    </Routes>
                </Router>
            </Provider>
        );
    
        fireEvent.click(screen.getByTestId('edit-task-1'));
    
        const elements = await screen.findAllByText('Edit Task');
        expect(elements.length).toBe(2);

        fireEvent.click(screen.getByLabelText('back'));

        await screen.findByText('Task List');

        const taskList = await screen.findByText('Task List');
        expect(taskList).toBeInTheDocument();
    });

    test('deletes a task', async () => {
        store.dispatch = jest.fn();

        render(
            <Provider store={store}>
                <Router>
                    <TaskListPage />
                </Router>
            </Provider>
        );

        fireEvent.click(screen.getByTestId('delete-task-2'));

        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledWith(deleteTask(2));
        });
    });

    test('opens filter dialog on filter button click', async () => {
        render(
            <Provider store={store}>
                <Router>
                    <TaskListPage />
                </Router>
            </Provider>
        );

        fireEvent.click(screen.getByText('Filter'));

        await waitFor(() => {
            expect(screen.getByText('Apply')).toBeInTheDocument();
            expect(screen.getByText('Clear')).toBeInTheDocument();
        });
    });
});
