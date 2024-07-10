import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  IconButton,
  Switch,
  Typography,
  Tooltip,
} from '@mui/material';
import { Task } from '../../types/Task';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export interface Column {
  id: keyof Task;
  label: string;
  sortable?: boolean;
  actions?: ('edit' | 'delete' | 'view' | 'toggle')[];
  render?: (row: Task) => React.ReactNode;
}

interface GenericTableProps {
  columns: Column[];
  data: Task[];
  sortBy: keyof Task | null;
  sortOrder: 'asc' | 'desc';
  onPageChange: (page: number) => void;
  currentPage: number;
  rowsPerPage: number;
  totalCount: number;
  onSortChange: (column: keyof Task) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  onToggle?: (id: number) => void;
}

const DataTable: React.FC<GenericTableProps> = ({
  columns,
  data,
  sortBy,
  sortOrder,
  onPageChange,
  currentPage,
  rowsPerPage,
  totalCount,
  onSortChange,
  onEdit,
  onDelete,
  onView,
  onToggle,
}) => {
  const handleSort = (column: keyof Task) => {
    if (sortBy === column) {
      onSortChange(column);
    } else {
      onSortChange(column);
    }
  };

  const renderActions = (row: Task) => {
    return (
      <>
        {columns.map((column) =>
          column.actions?.map((action) => (
            <React.Fragment key={`${row.id}-${action}`}>
              {getActionIcon(action, row)}
            </React.Fragment>
          ))
        )}
      </>
    );
  };

  const handleActionClick = (action: 'edit' | 'delete' | 'view' | 'toggle', id: number) => {
    switch (action) {
      case 'edit':
        if (onEdit) {
          onEdit(id);
        }
        break;
      case 'delete':
        if (onDelete) {
          onDelete(id);
        }
        break;
      case 'view':
        if (onView) {
          onView(id);
        }
        break;
      case 'toggle':
        if (onToggle) {
          onToggle(id);
        }
        break;
      default:
        break;
    }
  };

  const getActionIcon = (action: 'edit' | 'delete' | 'view' | 'toggle', row: Task) => {
    const actionIconStyle = {
      cursor: 'pointer',
      marginRight: 4,
    };

    switch (action) {
      case 'edit':
        return (
          <IconButton sx={actionIconStyle} data-testid={`edit-task-${row.id}`} onClick={() => handleActionClick('edit', row.id)}>
            <EditIcon />
          </IconButton>
        );
      case 'delete':
        return (
          <IconButton sx={actionIconStyle} data-testid={`delete-task-${row.id}`} onClick={() => handleActionClick('delete', row.id)}>
            <DeleteIcon />
          </IconButton>
        );
      case 'view':
        return (
          <IconButton  data-testid={`view-task-${row.id}`} sx={actionIconStyle} onClick={() => handleActionClick('view', row.id)}>
            <VisibilityIcon />
          </IconButton>
        );
      case 'toggle':
        return (
          <Switch
            checked={row.completed}
            data-testid={`toggle-task-${row.id}`}
            title={row.completed ? 'Mark as Pending' : 'Mark as Completed'}
            onChange={() => handleActionClick('toggle', row.id)}
            color="primary"
            inputProps={{ 'aria-label': 'toggle' }}
          />
        );
      default:
        return null;
    }
  };


  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.id.toString()}>
                    {column.render ? column.render(row) : row[column.id]}
                  </TableCell>
                ))}
                <TableCell>{renderActions(row)}</TableCell>
              </TableRow>
            )) : <TableRow>
              <TableCell colSpan={columns.length + 1}>
                <Typography sx={{ textAlign: "center" }} variant="body1">No data found</Typography>
              </TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={(e, newPage) => onPageChange(newPage)}
      />
    </Paper>
  );
};

export default DataTable;
