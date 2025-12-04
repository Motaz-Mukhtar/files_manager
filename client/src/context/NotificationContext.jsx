import { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';


const NotificationContext = createContext();



export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "info" // success, error, warnings, info
    });

    const notify = (message, severity = 'info') => {
        setNotification({ open: true, message, severity });
    };

    const handleClose = () => {
        setNotification( prev => ( { ...prev, open: false } ));
    };

    return (
        <NotificationContext.Provider value={{ notify }}>

        {children}


        <Snackbar
            open={notification.open}
            autoHideDuration={4000} // 4 sec
            onClose={handleClose}
            message={notification.message}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >

            <Alert onClose={handleClose} severity={notification.severity}>
                {notification.message}
            </Alert>

        </Snackbar>
        </NotificationContext.Provider>
    )
}

export const useNotification = () => useContext(NotificationContext);