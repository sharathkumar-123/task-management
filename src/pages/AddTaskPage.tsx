import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, editTask } from '../store/task/tasksSlice';
import { Button, Grid, Typography, TextareaAutosize, Box } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { RootState } from '../store/task/store';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import TextField from '../components/shared/TextField';
import Select from '../components/shared/Select';
import { EditTask, Task } from '../types/Task';
import { taskValidationSchema } from '../utils/taskValidationSchema';
import { TaskStatus, statusOptions } from '../constants';

interface AddTaskPageProps {
    initialValues?: EditTask;
    isEditFlow?: boolean;
    isReadOnly?: boolean;
    pageTitle?: string;
}

const AddTaskPage: React.FC<AddTaskPageProps> = ({ initialValues, isEditFlow = false, isReadOnly = false, pageTitle = 'Add New Task' }) => {
    const tasks = useSelector((state: RootState) => state.tasks);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { control, handleSubmit, formState: { errors } } = useForm<EditTask>({
        resolver: yupResolver(taskValidationSchema),
        defaultValues: initialValues || {
            title: '',
            description: '',
            dueDate: '',
            status: '',
        },
    });

    const onSubmit = (data: EditTask) => {
        if (isEditFlow) {
            const updatedTask: Task = {
                id: data?.id ?? 0,
                ...data,
                completed: data.status === TaskStatus.Completed,
            };
            dispatch(editTask(updatedTask));
        } else {
            const newTask: Task = {
                id: getNextTaskId(),
                ...data,
                completed: data.status === TaskStatus.Completed,
            };
            dispatch(addTask(newTask));
        }
        navigate(ROUTES.TASK_LIST);
    };

    const getNextTaskId = () => {
        const maxId = tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
        return maxId + 1;
    };

    return (
        <>
            <Header backNavigateUrl={ROUTES.TASK_LIST} title={pageTitle} />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <Box
                    sx={{
                        width: '50%',
                        borderRadius: '10px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#d0e5f7',
                        padding: '30px',
                    }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={5}>
                            <Grid item xs={12}>
                                <Typography variant="h6">{pageTitle}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="title"
                                    control={control}
                                    label="Title"
                                    error={!!errors.title}
                                    isReadOnly={isReadOnly}
                                    helperText={errors.title?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="dueDate"
                                    control={control}
                                    label="Due Date"
                                    error={!!errors.dueDate}
                                    isReadOnly={isReadOnly}
                                    helperText={errors.dueDate?.message}
                                    textFieldProps={{
                                        type: 'date',
                                        InputLabelProps: {
                                          shrink: true,
                                        },
                                        inputProps: {
                                          min: new Date().toISOString().split('T')[0],
                                        },
                                      }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="description"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <>
                                            <TextareaAutosize
                                                {...field}
                                                aria-label="minimum height"
                                                minRows={2}
                                                placeholder="Description"
                                                disabled={isReadOnly}
                                                style={{ width: '94%', padding: '10px',fontSize:'16px', backgroundColor: '#d0e5f7' }}
                                            />
                                            {errors.description && (
                                                <Typography color="error">
                                                    {errors.description.message}
                                                </Typography>
                                            )}
                                        </>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Select
                                    name="status"
                                    control={control}
                                    isReadOnly={isReadOnly}
                                    label="Status"
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                    options={statusOptions}
                                />
                            </Grid>
                            {!isReadOnly && (
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        {isEditFlow ? 'Update Task' : 'Add Task'}
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </Box>
            </Box>
        </>
    );
};

export default AddTaskPage;
