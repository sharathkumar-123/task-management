import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import EditTaskPage from '../EditTaskPage';
import { TaskStatus } from '../../constants';
import { editTask } from '../../store/task/tasksSlice';

const mockStore = configureStore([]);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

describe('EditTaskPage Component', () => {
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

    test('renders Edit Task page correctly', async () => {
        const taskId = 1; 
        useParams.mockReturnValue({ id: String(taskId) });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/edit-task/${taskId}`]}> 
                    <Routes>
                        <Route path="/edit-task/:id" element={<EditTaskPage isReadOnly={false} pageTitle="Edit Task" />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const elements = await screen.findAllByText('Edit Task');
        expect(elements.length).toBe(2);
       
        expect(screen.getByLabelText('Title')).toHaveValue('Task 1');
        expect(screen.getByLabelText('Due Date')).toHaveValue('2024-07-15');
        expect(screen.getByPlaceholderText('Description')).toHaveValue('Description 1');
        const inputElement = screen.getByTestId('ArrowDropDownIcon').parentNode.querySelector('input[name="status"]');
        expect(inputElement).toBeInTheDocument();
    });

    test('submits an updated task', async () => {
        const taskId = 1;
        useParams.mockReturnValue({ id: String(taskId) });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/edit-task/${taskId}`]}> 
                    <Routes>
                        <Route path="/edit-task/:id" element={<EditTaskPage isReadOnly={false} pageTitle="Edit Task" />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const titleInput = screen.getByLabelText('Title');
        const dueDateInput = screen.getByLabelText('Due Date');
        const descriptionInput = screen.getByPlaceholderText('Description');
        const inputElement = screen.getByTestId('ArrowDropDownIcon').parentNode.querySelector('input[name="status"]');
        expect(inputElement).toBeInTheDocument(); 

        fireEvent.change(titleInput, { target: { value: 'Updated Task Title' } });
        fireEvent.change(dueDateInput, { target: { value: '2024-07-31' } });
        fireEvent.change(descriptionInput, { target: { value: 'Updated Task Description' } });
        fireEvent.change(inputElement, { target: { value: TaskStatus.Pending } }); 

        fireEvent.submit(screen.getByText('Update Task')); 

        await waitFor(() => {
            const actions = store.getActions();
            const expectedPayload = {
                id: taskId,
                title: 'Updated Task Title',
                description: 'Updated Task Description',
                dueDate: '2024-07-31',
                status: TaskStatus.Pending,
                completed: false,
            };
            expect(actions).toContainEqual(editTask(expectedPayload)); 
        });
    });
});
    