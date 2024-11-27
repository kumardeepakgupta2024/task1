import React, { useState, useEffect } from 'react';
import { useGetClustersQuery, useGetCountriesQuery, useSoftDeleteClusterMutation, useUpdateClusterMutation } from '../redux/apiSlice';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, TextField, Button, Grid, Container, Typography, Box,
  Menu, MenuItem
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

  const [updateCluster] = useUpdateClusterMutation();
  const [softDeleteCluster] = useSoftDeleteClusterMutation();

  const { data: countriesData, isLoading: countriesLoading, error: countriesError } = useGetCountriesQuery();
  const { data: clustersData, isLoading: clustersLoading, error: clustersError, refetch } = useGetClustersQuery({
    page,
    filters
  });

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

  const applyFilters = () => {
    setPage(1); 
  };

  const handleMenuClick = (event, cluster) => {
    setAnchorEl(event.currentTarget);
    setSelectedCluster(cluster); // Set the selected cluster for actions
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCluster(null);  // Clear selectedCluster on close
  };

  const handleEdit = () => {
    console.log('Editing cluster:', selectedCluster);
    handleMenuClose();
  };

  const handleUpdate = async () => {
    if (selectedCluster) {
      try {
        const updatedData = { ...selectedCluster, status: !selectedCluster.status };
        await updateCluster({ id: selectedCluster.id, data: updatedData }).unwrap();
        console.log('Cluster updated successfully');
      } catch (error) {
        console.error('Error updating cluster:', error);
      }
      handleMenuClose();
    }
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

  const handleDelete = async (idx) => {
    if (selectedCluster) {
      try {
        await softDeleteCluster({ id: selectedCluster.id }).unwrap();
        console.log('Cluster deleted successfully');
        handleMenuClose();
        refetch();  // Refetch the clusters to update the UI
      } catch (error) {
        console.error('Error deleting cluster:', error);
      }
    }
  };

  if (countriesLoading || clustersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Clusters
        </Typography>
        <Link to={'/'}>
          <Button sx={{ background: 'green', padding: "4px", marginBottom: '5px', color: 'white' }}>
            + New Cluster
          </Button>
        </Link>
      </Box>

      <Grid container spacing={2} alignItems="center" justifyContent="center" mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Cluster Name"
            name="cluster_name"
            value={filters.cluster_name}
            onChange={handleFilterChange}
            fullWidth
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
            required
          >
            {countriesData?.countries?.map((country) => (
              <MenuItem key={country.id} value={country.name}>
                {country.name}
              </MenuItem>
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
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="City"
            name="city_name"
            value={filters.city_name}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2} display="flex" justifyContent="center">
          <Button variant="contained" onClick={applyFilters} sx={{ height: '100%' }}>Filter</Button>
        </Grid>
      </Grid>

      {filtered?.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center">
          No data found
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                {['SL No', 'Name', 'Email', 'Country', 'State', 'City', 'Location', 'Status', "Action"].map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered?.map((cluster, index) => (
                <TableRow key={cluster.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{cluster.name}</TableCell>
                  <TableCell>{cluster.email}</TableCell>
                  <TableCell>{cluster.country_name}</TableCell>
                  <TableCell>{cluster.state_name}</TableCell>
                  <TableCell>{cluster.city_name}</TableCell>
                  <TableCell>{cluster.location}</TableCell>
                  <TableCell>{cluster.status ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <MoreVertIcon onClick={(e) => handleMenuClick(e, cluster)} />
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEdit}>Edit</MenuItem>
                      <MenuItem onClick={handleUpdate}>Update</MenuItem>
                      <MenuItem onClick={() => handleDelete(index)}>Delete</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box display="flex" justifyContent="center" mt={2}>
        <TablePagination
          component="div"
          count={clustersData?.total || 0}
          page={page - 1}
          rowsPerPage={10}
          onPageChange={handlePageChange}
        />
      </Box>
    </Container>
  );
};

export default ClusterListPage