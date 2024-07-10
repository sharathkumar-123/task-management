import * as yup from 'yup';

export const taskValidationSchema = yup.object().shape({
    title: yup.string()
        .required('Title is required')
        .matches(/^[a-zA-Z0-9\s]*$/, 'Title must be alphanumeric with spaces allowed'),
    description: yup.string().required('Description is required'),
    dueDate: yup.string().required('Due Date is required'),
    status: yup.string().required('Status is required'),
});
