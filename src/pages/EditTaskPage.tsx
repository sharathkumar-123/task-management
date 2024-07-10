import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/task/store';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { EditTask } from '../types/Task';
import AddTaskPage from './AddTaskPage';
import { TaskStatus } from '../constants';
import Container from '@mui/material/Container';
import { Box, Typography } from '@mui/material';
import Button from '../components/shared/Button';

interface EditTaskPageProps {
    isReadOnly?: boolean;
    pageTitle?: string
}

const EditTaskPage: React.FC<EditTaskPageProps> = ({ isReadOnly, pageTitle = 'Edit Task' }) => {
    const { id } = useParams<{ id: string }>();
    const tasks = useSelector((state: RootState) => state.tasks);
    const navigate = useNavigate();
    const task = tasks.find(task => task.id === parseInt(id ?? ''));

    const handleGoBack = () => {
        navigate(ROUTES.TASK_LIST); 
    };
    if (!task) {
        return (
            <Container maxWidth="sm">
                <Box textAlign="center" mt={4}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Task not found
                    </Typography>
                    <Button label='Go Back' variant="contained" color="primary" onClick={handleGoBack}/>
                </Box>
            </Container>
        );
    }

    const adaptedTask: EditTask = {
        id: task?.id,
        title: task?.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.completed ? TaskStatus.Completed :  TaskStatus.Pending,
    };

    return (
        <AddTaskPage
            initialValues={adaptedTask}
            isEditFlow
            isReadOnly={isReadOnly}
            pageTitle={pageTitle}
        />
    );
};

export default EditTaskPage;
