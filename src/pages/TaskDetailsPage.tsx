import React from 'react';
import EditTaskPage from './EditTaskPage';

const TaskDetailsPage: React.FC = () => {

    return (
        <EditTaskPage
            isReadOnly
            pageTitle="Task Details"
        />
    );
};

export default TaskDetailsPage;
