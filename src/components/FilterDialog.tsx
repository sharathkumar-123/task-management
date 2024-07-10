import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { FilterConfig } from '../types/Task';

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: Record<string, any>) => void;
  filterConfigs: FilterConfig[]; 
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  onApply,
  filterConfigs,
}) => {
  const initialSelectedValues: Record<string, any> = {};

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedValues, setSelectedValues] = useState<Record<string, any>>(initialSelectedValues);

  const handleApply = () => {
    onApply(selectedValues);
    onClose();
  };

  const handleClear = () => {
    setSelectedValues({});
    onApply({});
    onClose();
  };

  const handleChange = (event: SelectChangeEvent<any>, filterLabel: string) => {
    const { value } = event.target;
    setSelectedValues(prev => ({
      ...prev,
      [filterLabel]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Filter</DialogTitle>
      <DialogContent dividers>
        {filterConfigs.map((filterConfig, index) => (
          filterConfig.type === 'select' && (
            <FormControl key={index} fullWidth sx={{ my: 1 }}>
              <InputLabel>{filterConfig.label}</InputLabel>
              <Select
                value={selectedValues[filterConfig.label] || ''}
                onChange={(event) => handleChange(event, filterConfig.label)}
                name={filterConfig.label}
                label={filterConfig.label}
              >
                {filterConfig.options.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={handleApply} variant="contained" color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
