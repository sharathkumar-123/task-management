import React from 'react';
import { Controller } from 'react-hook-form';
import { Select as MuiSelect, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';

interface FormSelectProps {
    name: string;
    control: any; 
    label: string;
    error?: boolean;
    helperText?: string;
    options: { value: string; label: string }[];
    isReadOnly?: boolean;
}

function Select({
    name,
    control,
    label,
    error,
    helperText,
    options,
    isReadOnly
}: FormSelectProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormControl fullWidth error={error}>
                    <InputLabel>{label}</InputLabel>
                    <MuiSelect
                        {...field}
                        value={field.value || ''}
                        disabled={isReadOnly}
                        onChange={(e) => field.onChange(e.target.value)}
                        label={label}
                        data-testid="label"
                    >
                        {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </MuiSelect>
                    {error && (
                        <Typography variant="body2" color="error">
                            {helperText}
                        </Typography>
                    )}
                </FormControl>
            )}
        />
    );
}

export default Select;
