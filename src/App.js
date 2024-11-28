import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ClusterForm from './Components/ClusterForm';
import ClusterListPage from './Components/ClusterListPage';

import { Container, AppBar, Toolbar, Typography } from '@mui/material';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Cluster Management
            </Typography>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/create" element={<ClusterListPage />} />  
            <Route path="/" element={<ClusterForm />} />  
          </Routes>
        </Container>
      </Router>
    </Provider>
  );
}

export default App;
