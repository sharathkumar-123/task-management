import React, { ReactElement, useState, useCallback } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/task/store';
import DataTable, { Column } from '../components/shared/DataTable';
import { deleteTask, toggleTaskCompletion } from '../store/task/tasksSlice';
import Button from "../components/shared/Button";
import SearchBox from "../components/shared/SearchBox";
import FilterDialog from "../components/FilterDialog";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Task } from "../types/Task";
import Header from '../components/Header';
import { ROWS_PER_PAGE, filterConfigs } from '../constants';
import { searchTasks, filterTasks, sortTasks } from '../utils';

const columns: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'title', label: 'Title', sortable: true },
  { id: 'description', label: 'Description' },
  { id: 'dueDate', label: 'Due Date', sortable: true },
  {
    id: 'completed',
    label: 'Status',
    render: (row: Task) => (
      <Box
        width={100}
        height={20}
        borderRadius={10}
        bgcolor={row.completed ? 'green' : 'orange'}
        display="flex"
        fontSize={10}
        justifyContent="center"
        alignItems="center"
        color="white"
        sx={{ textTransform: 'uppercase' }}
      >
        {row.completed ? 'Completed' : 'Pending'}
      </Box>
    ),
  },
  {
    id: 'actions',
    label: '',
    actions: ['edit', 'delete', 'view', 'toggle'],
  },
];

const TaskListPage: React.FC = (): ReactElement => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState<keyof Task | null>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Compute filtered tasks
  const filteredTasks = searchTasks(filterTasks(tasks, filters), searchQuery);

  // Compute sorted tasks
  const sortedTasks = sortTasks(filteredTasks, sortBy, sortOrder);

  // Compute paginated tasks
  const paginatedTasks = sortedTasks.slice(currentPage * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE + ROWS_PER_PAGE);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleSortChange = useCallback((column: keyof Task) => {
    setSortBy(column);
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  }, []);

  const handleAddTask = useCallback(() => {
    navigate(ROUTES.ADD_TASK);
  }, [navigate]);

  const handleEdit = useCallback((id: number) => {
    navigate(`edit-task/${id}`);
  }, [navigate]);

  const handleDelete = useCallback((id: number) => {
    dispatch(deleteTask(id));
  }, [dispatch]);

  const handleView = useCallback((id: number) => {
    navigate(`task-details/${id}`);
  }, [navigate]);

  const handleToggle = useCallback((id: number) => {
    dispatch(toggleTaskCompletion(id));
  }, [dispatch]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleApplyFilter = useCallback((selectedFilters: Record<string, any>) => {
    setFilters(selectedFilters);
  }, []);

  return (
    <Box sx={{ margin: '20px' }}>
      <Header title='Task List' />
      <Box sx={{ borderRadius: '10px', bgcolor: '#d0e5f7', padding: '20px', mt: 5 }}>
        <Grid container alignItems="center" justifyContent="space-evenly" sx={{ mb: 2}}>
          <Grid item xs={12 }  sx={{ mb: { xs: 2, md: 0 }}} md={4}>
            <SearchBox
              variant="outlined"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleInputChange}
              onClear={handleClearSearch}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <Button variant="contained" label="Filter" color="primary" onClick={() => setOpenFilterDialog(true)} />
          </Grid>
          <Grid item xs={6} md={4} >
            <Button variant="contained" label="Add Task" color="primary" onClick={handleAddTask} />
          </Grid>
        </Grid>

        <FilterDialog
          open={openFilterDialog}
          onClose={() => setOpenFilterDialog(false)}
          onApply={handleApplyFilter}
          filterConfigs={filterConfigs}
        />
        <Paper>
          <DataTable
            columns={columns}
            data={paginatedTasks}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            rowsPerPage={ROWS_PER_PAGE}
            totalCount={tasks.length}
            onSortChange={handleSortChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onToggle={handleToggle}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default TaskListPage;
