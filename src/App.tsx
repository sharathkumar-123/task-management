import React, { Suspense } from 'react';
import './App.css';
import { Box, ThemeProvider } from '@mui/material';
import { useMobile } from './hooks/helper.hooks';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoaderComponent from './components/shared/LoaderComponent';
import { routes as appRoutes } from "./utils/router";
import { ROUTES } from './constants/routes';
import theme from './theme/theme';
import { Provider } from 'react-redux';
import { store } from './store/task/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const isMobile = useMobile();
  const height = window.innerHeight;

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Box
          height={isMobile ? height : "100vh"}
          display="flex"
          flexDirection="column"
        >
          <Router>
            <Routes>
              {appRoutes.map((route) => (
                <Route
                  key={route.key}
                  path={route.path}
                  element={
                    <Suspense fallback={<LoaderComponent />}>
                      <route.component />
                    </Suspense>
                  }
                />
              ))}
              {/* In case of invalid route navigate to listing page */}
              <Route path="*" element={<Navigate to={ROUTES.TASK_LIST} replace />} />
            </Routes>
          </Router>
          <ToastContainer
            position="top-right"
            theme="light"
            style={{ zIndex: 99999999 }}
          />
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
