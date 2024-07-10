import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import AddTaskPage from '../AddTaskPage';
import { addTask } from '../../store/task/tasksSlice';

const mockStore = configureStore([]);

describe('AddTaskPage Component', () => {
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

    test('renders Add Task page correctly', async () => {
        render(
            <Provider store={store}>
                <Router>
                    <AddTaskPage />
                </Router>
            </Provider>
        );

        const elements = await screen.findAllByText('Add New Task');
        expect(elements.length).toBe(2);
        expect(screen.getByLabelText('Title')).toBeInTheDocument();
        expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
        const inputElement = screen.getByTestId('ArrowDropDownIcon').parentNode.querySelector('input[name="status"]');
        expect(inputElement).toBeInTheDocument();
    });

    test('submits a new task', async () => {
        render(
            <Provider store={store}>
                <Router>
                    <AddTaskPage />
                </Router>
            </Provider>
        );

        const titleInput = screen.getByLabelText('Title');
        const dueDateInput = screen.getByLabelText('Due Date');
        const descriptionInput = screen.getByLabelText('minimum height');
        const inputElement = screen.getByTestId('ArrowDropDownIcon').parentNode.querySelector('input[name="status"]');
        expect(inputElement).toBeInTheDocument();


        fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
        fireEvent.change(dueDateInput, { target: { value: '2024-07-31' } });
        fireEvent.change(descriptionInput, { target: { value: 'New Task Description' } });
        fireEvent.change(inputElement, { target: { value: 'pending' } });

        fireEvent.submit(screen.getByText('Add Task'));

        await waitFor(() => {
            const actions = store.getActions();
            const expectedPayload = {
                id: 5,
                title: 'New Task Title',
                description: 'New Task Description',
                dueDate: '2024-07-31',
                status: 'pending',
                completed: false,
            };
            expect(actions).toContainEqual(addTask(expectedPayload));
        });
    });
});
