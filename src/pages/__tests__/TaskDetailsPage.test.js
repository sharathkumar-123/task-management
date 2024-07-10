import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import TaskDetailsPage from '../TaskDetailsPage'; 

const mockStore = configureStore([]);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), 
    useParams: jest.fn(),
}));

describe('TaskDetailsPage Component', () => {
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

    test('renders Task Details page correctly in read-only mode', async () => {
        const taskId = 1;
        useParams.mockReturnValue({ id: String(taskId) });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/task-details/${taskId}`]}> 
                    <Routes>
                        <Route path="/task-details/:id" element={<TaskDetailsPage isReadOnly={true} pageTitle="Task Details" />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );


        const elements = await screen.findAllByText('Task Details');
        expect(elements.length).toBe(2);
        expect(screen.getByLabelText('Title')).toHaveValue('Task 1');
        expect(screen.getByLabelText('Due Date')).toHaveValue('2024-07-15');
        expect(screen.getByPlaceholderText('Description')).toHaveValue('Description 1');
        const inputElement = screen.getByTestId('ArrowDropDownIcon').parentNode.querySelector('input[name="status"]');
        expect(inputElement).toBeInTheDocument();
    });

});
