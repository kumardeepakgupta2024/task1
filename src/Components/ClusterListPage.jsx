import React, { useState, useEffect } from 'react';
import { useGetClustersQuery, useGetCountriesQuery, useSoftDeleteClusterMutation, useCreateClusterMutation, useUpdateClusterMutation } from '../redux/apiSlice';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, TextField, Button, Grid, Container, Typography, Box,
  Menu, MenuItem, IconButton, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle
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
  const { data: clustersData, isLoading: clustersLoading, error: clustersError, refetch } = useGetClustersQuery({ page, filters });
  const [softDeleteCluster] = useSoftDeleteClusterMutation();
  const [createCluster] = useCreateClusterMutation();
  const [updateCluster] = useUpdateClusterMutation();

  useEffect(() => {
    if (countriesError) {
      console.error('Error fetching countries:', countriesError);
    }
    if (clustersError) {
      console.error('Error fetching clusters:', clustersError);
    }
  }, [countriesError, clustersError]);

  const handlePageChange = (_, newPage) => setPage(newPage + 1);

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


  console.log(selectedCluster,"dddddddddd")
  const openClusterDialog = (cluster = null) => {
    setIsEdit(!!cluster);
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
        console.log('Cluster updated successfully');
        refetch();
      } catch (error) {
        console.error('Error updating cluster:', error);
      }
    } else {
      try {
        await createCluster(clusterForm).unwrap();
        console.log('Cluster created successfully');
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
        <Link to={'/'}>
          <Button sx={{
            backgroundColor: '#673ab7', color: 'white', padding: '8px 20px', '&:hover': { backgroundColor: '#512da8' }
          }}>
            + New Cluster
          </Button>
        </Link>
      </Box>

      {/* Filter Form */}
      <Grid container spacing={2} alignItems="center" justifyContent="center" mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Cluster Name"
            name="cluster_name"
            value={filters.cluster_name}
            onChange={handleFilterChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px', 
                backgroundColor: '#f3f3f3', 
                '&:hover': { backgroundColor: '#e8e8e8' }
              },
              '& .MuiInputLabel-root': { color: '#673ab7' },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            select
            label="Country"
            name="country_name"
            value={filters.country_name}
            onChange={handleFilterChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px', 
                backgroundColor: '#f3f3f3', 
                '&:hover': { backgroundColor: '#e8e8e8' }
              },
              '& .MuiInputLabel-root': { color: '#673ab7' },
            }}
          >
            {countriesData?.countries?.map((country) => (
              <MenuItem key={country.id} value={country.name}>{country.name}</MenuItem>
            ))}
          </TextField>
        </Grid>


        <Grid item xs={12} sm={6} md={2}>
          <TextField
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
                '&:hover': { backgroundColor: '#e8e8e8' }
              },
              '& .MuiInputLabel-root': { color: '#673ab7' },
            }}
          />
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
                '&:hover': { backgroundColor: '#e8e8e8' }
              },
              '& .MuiInputLabel-root': { color: '#673ab7' },
            }}
          />
        </Grid>


        <Grid item xs={12} sm={6} md={2} display="flex" justifyContent="center">
          <Button 
            variant="contained" 
            onClick={applyFilters} 
            sx={{
              backgroundColor: '#512da8', 
              padding: '8px 20px', 
              '&:hover': { backgroundColor: '#673ab7' }
            }}
          >
            Filter
          </Button>
        </Grid>
      </Grid>

      {/* Display Clusters Table */}
      {filtered?.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center">
          No data found
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflowX: 'auto' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#673ab7', color: 'white' }}>
              <TableRow>
                {['SL No', 'Name', 'Email', 'Country', 'State', 'City', 'Location', 'Status', "Action"].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', color: 'white' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered?.map((cluster, index) => (
                <TableRow key={cluster.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{cluster.name}</TableCell>
                  <TableCell>{cluster.email}</TableCell>
                  <TableCell>{cluster.country_name}</TableCell>
                  <TableCell>{cluster.state_name}</TableCell>
                  <TableCell>{cluster.city_name}</TableCell>
                  <TableCell>{cluster.location}</TableCell>
                  <TableCell>{cluster.deleted_at ? cluster.deleted_at : "active" }</TableCell>
                  <TableCell>
                    <IconButton onClick={(event) => handleMenuClick(event, cluster)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={clustersData?.meta?.total || 0}
        page={page - 1}
        onPageChange={handlePageChange}
      />

      {/* Menu for Actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => openClusterDialog(selectedCluster)}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      {/* Cluster Form Dialog */}
      <Dialog open={openDialog} onClose={closeClusterDialog}>
        <DialogTitle>{isEdit ? 'Edit Cluster' : 'Create Cluster'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Render form inputs for cluster */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cluster Name"
                name="name"
                value={clusterForm.name}
                onChange={handleClusterFormChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={clusterForm.email}
                onChange={handleClusterFormChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Country"
                name="country_name"
                value={clusterForm.country_name}
                onChange={handleClusterFormChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="State"
                name="state_name"
                value={clusterForm.state_name}
                onChange={handleClusterFormChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                name="city_name"
                value={clusterForm.city_name}
                onChange={handleClusterFormChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                value={clusterForm.location}
                onChange={handleClusterFormChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeClusterDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClusterListPage;
