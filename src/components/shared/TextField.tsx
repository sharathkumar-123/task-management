import React from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { TextField as MUITextField, TextFieldProps } from '@mui/material';

interface FormFieldProps<T> {
    name: string;
    control: any; 
    defaultValue?: string | number | readonly string[];
    label: string;
    error?: boolean;
    helperText?: string;
    textFieldProps?: TextFieldProps;
    isReadOnly?: boolean;
}

function TextField<T extends FieldValues>({
    name,
    control,
    defaultValue,
    label,
    error,
    helperText,
    textFieldProps,
    isReadOnly,
}: FormFieldProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ''}
            render={({ field }) => (
                <MUITextField
                    {...field}
                    {...textFieldProps}
                    fullWidth
                    label={label}
                    error={error}
                    helperText={helperText}
                    disabled={isReadOnly}
                />
            )}
        />
    );
}

export default TextField;
