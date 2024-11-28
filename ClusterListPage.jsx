import React, { useState, useEffect } from 'react';
import { useGetClustersQuery, useGetCountriesQuery, useSoftDeleteClusterMutation, useCreateClusterMutation, useUpdateClusterMutation, useRestoreClusterMutation, useGetStatesQuery, useGetCitiesQuery } from '../redux/apiSlice';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, TextField, Button, Grid, Container, Typography, Box,
  Menu, MenuItem, IconButton, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
  Pagination
} from '@mui/material';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ClusterListPage = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    cluster_name: '',
    country_name: '',
    state_name: '',
    city_name: ''
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [clusterForm, setClusterForm] = useState({
    name: '',
    email: '',
    country_name: '',
    state_name: '',
    city_name: '',
    location: ''
  });

  const { data: countriesData, isLoading: countriesLoading, error: countriesError } = useGetCountriesQuery();
  const { data: statesData, isLoading: statesLoading, error: stateError } = useGetStatesQuery(clusterForm.country_name, { skip: !clusterForm.country_name });
  const { data: citiesData, isLoading: citiesLoading, error: citiesError } = useGetCitiesQuery(clusterForm.state_name, { skip: !clusterForm.state_name });

  const { data: clustersData, isLoading: clustersLoading, error: clustersError, refetch } = useGetClustersQuery({ page, filters });
  const [softDeleteCluster] = useSoftDeleteClusterMutation();
  const [createCluster] = useCreateClusterMutation();
  const [updateCluster] = useUpdateClusterMutation();
  const [restoreCluster] = useRestoreClusterMutation();


console.log(clustersData?.data.map((date)=> date?.state_name),"kya aa raha ha ")
console.log(statesData,"kya aa raha ha ")


useEffect(() => {
  if (countriesError) {
      console.error('Error fetching countries:', countriesError);
  }
  if (stateError) {
      console.error('Error fetching states:', stateError);
  }
}, [countriesError, stateError]);

useEffect(() => {
  if (statesData) {
      console.error('states:', statesData);
  }
  if (stateError ) {
      console.error('Error fetching cities:', stateError );
  }
}, [statesData, stateError ]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => setPage(1);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCluster(null);
  };

  const handleMenuClick = (event, cluster) => {
    setAnchorEl(event.currentTarget);
    setSelectedCluster(cluster);
  };

  const filtered = clustersData?.data?.filter((itr) => {
    if (filters?.country_name?.length && itr?.country_name !== filters?.country_name) {
      return false;
    }

    if (filters?.cluster_name?.length && !itr?.name?.toLowerCase().includes(filters?.cluster_name?.toLowerCase())) {
      return false;
    }

    if (filters?.state_name?.length && itr?.state_name !== filters?.state_name) {
      return false;
    }

    if (filters?.city_name?.length && itr?.city_name !== filters?.city_name) {
      return false;
    }

    return true;
  });
  

  const handleDelete = async () => {
    if (selectedCluster) {
      try {
        await softDeleteCluster({ id: selectedCluster.id }).unwrap();
        console.log('Cluster deleted successfully');
        handleMenuClose();
        refetch();
      } catch (error) {
        console.error('Error deleting cluster:', error);
      }
    }
  };

  const handleRestore = async () => {
    if (selectedCluster) {
      try {
        await restoreCluster(selectedCluster.id).unwrap();
        console.log('Cluster restored successfully');
        handleMenuClose();
        refetch();
      } catch (error) {
        console.error('Error restoring cluster:', error);
      }
    }
  };

  const openClusterDialog = (cluster = null) => {
    setIsEdit(cluster);
    setClusterForm(cluster || {
      name: '',
      email: '',
      country_name: '',
      state_name: '',
      city_name: '',
      location: ''
    });
    setOpenDialog(true);
  };

  const closeClusterDialog = () => setOpenDialog(false);

  const handleClusterFormChange = (e) => {
    const { name, value } = e.target;
    setClusterForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (isEdit) {
      try {
        await updateCluster(clusterForm).unwrap();
        refetch();
      } catch (error) {
        console.error('Error updating cluster:', error);
      }
    } else {
      try {
        await createCluster(clusterForm).unwrap();
        refetch();
      } catch (error) {
        console.error('Error creating cluster:', error);
      }
    }
    closeClusterDialog();
  };

  if (countriesLoading || clustersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ background: 'linear-gradient(45deg, #f3e5f5, #e1bee7)', padding: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#673ab7' }}>Clusters</Typography>
        <Link to={'/'}><Button sx={{ backgroundColor: '#673ab7', color: 'white', padding: '8px 20px', '&:hover': { backgroundColor: '#512da8' } }}>+ New Cluster</Button></Link>
      </Box>

      <Grid container spacing={2} alignItems="center" justifyContent="center" mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Cluster Name" name="cluster_name" value={filters.cluster_name} onChange={handleFilterChange} fullWidth variant="outlined" 
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#f3f3f3', '&:hover': { backgroundColor: '#e8e8e8' } }, 
          '& .MuiInputLabel-root': { color: '#673ab7' } }} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField select label="Country" name="country_name" value={filters.country_name} onChange={handleFilterChange} fullWidth variant="outlined"
           sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#f3f3f3', '&:hover': { backgroundColor: '#e8e8e8' } }, '& .MuiInputLabel-root': { color: '#673ab7' } }} >
            
            {countriesData?.countries?.map((country) => <MenuItem key={country.id} value={country.name}>{country.name}</MenuItem>)}</TextField></Grid>
    <Grid item xs={12} sm={6} md={2}>
  <TextField
    // select
    label="State"
    name="state_name"
    value={filters.state_name}
    onChange={handleFilterChange}
    fullWidth
    variant="outlined"
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#f3f3f3',
        '&:hover': { backgroundColor: '#e8e8e8' },
      },
      '& .MuiInputLabel-root': { color: '#673ab7' },
    }}
    // disabled={!clusterForm.country_name} 
  >
    
  </TextField>
</Grid>

<Grid item xs={12} sm={6} md={2}>
  <TextField
    label="City"
    name="city_name"
    value={filters.city_name}
    onChange={handleFilterChange}
    fullWidth
    variant="outlined"
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#f3f3f3',
        '&:hover': { backgroundColor: '#e8e8e8' },
      },
      '& .MuiInputLabel-root': { color: '#673ab7' },
    }}

  >
    {citiesData?.cities?.map((city) => (
      <MenuItem key={city.id} value={city.name}>
        {city.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>
        <Grid item xs={12} sm={6} md={2} display="flex" justifyContent="center"><Button variant="contained" onClick={applyFilters} sx={{ backgroundColor: '#512da8', padding: '8px 20px', '&:hover': { backgroundColor: '#673ab7' } }}>Filter</Button></Grid>
      </Grid>

      {filtered?.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center">No data found</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '8px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Cluster Name</TableCell>
                <TableCell align="left">Country</TableCell>
                <TableCell align="left">State</TableCell>
                <TableCell align="left">City</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered?.map((cluster) => (
                <TableRow key={cluster.id}>
                  <TableCell>{cluster.name}</TableCell>
                  <TableCell>{cluster.country_name}</TableCell>
                  <TableCell>{cluster.state_name}</TableCell>
                  <TableCell>{cluster.city_name}</TableCell>
                  <TableCell>{cluster.deleted_at ? <Button sx={{ background: "#1976d2", color: 'white', width: "60px", padding: "2px 35px" }}>Dactive</Button> : <Button sx={{ background: "#3da288", color: 'white', width: "60px", padding: "2px 35px" }}  >active</Button>}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleMenuClick(e, cluster)}><MoreVertIcon /></IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={selectedCluster?.id === cluster.id}
                      onClose={handleMenuClose}
                    >
                      {cluster.deleted_at ? (
                        <MenuItem onClick={handleRestore}>Restore</MenuItem>
                      ) : (
                        <>
                          <MenuItem onClick={() => openClusterDialog(cluster)}>Edit</MenuItem>
                          <MenuItem onClick={handleDelete}>Delete</MenuItem>
                        </>
                      )}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <Box display="flex" justifyContent="center" my={2}>
        <Pagination
          count={Math.ceil((clustersData?.total || 0) / 10)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>

      <Box display="flex" justifyContent="center">
        <Typography variant="caption">{`Page ${page} of ${Math.ceil((clustersData?.total || 0) / 10)}`}</Typography>
      </Box>

      {/* Cluster Dialog */}
      <Dialog open={openDialog} onClose={closeClusterDialog}>
        <DialogTitle>{isEdit ? 'Edit Cluster' : 'Create Cluster'}</DialogTitle>
        <DialogContent>
          <TextField label="Cluster Name" name="name" value={clusterForm.name} onChange={handleClusterFormChange} fullWidth margin="normal" />
          <TextField label="Email" name="email" value={clusterForm.email} onChange={handleClusterFormChange} fullWidth margin="normal" />
          <TextField label="Location" name="location" value={clusterForm.location} onChange={handleClusterFormChange} fullWidth margin="normal" />
          <TextField select label="Country" name="country_name" value={clusterForm.country_name} onChange={handleClusterFormChange} fullWidth margin="normal">
            {countriesData?.countries?.map((country) => <MenuItem key={country.id} value={country.name}>{country.name}</MenuItem>)}
          </TextField>
          <TextField select label="State" name="state_name" value={clusterForm.state_name} onChange={handleClusterFormChange} fullWidth margin="normal">
            {statesData?.states?.map((state) => (
              <MenuItem key={state.id} value={state.name}>
                {state.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="City" name="city_name" value={clusterForm.city_name} onChange={handleClusterFormChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeClusterDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClusterListPage;
