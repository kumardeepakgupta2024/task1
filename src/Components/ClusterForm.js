import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, Typography, CircularProgress, Grid, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCreateClusterMutation, useGetCitiesQuery, useGetCountriesQuery, useGetStatesQuery } from '../redux/apiSlice';

const ClusterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country_id: '',
        state_id: '',
        city_id: '',
        location: '',
        latitude: '0',
        longitude: '0',
    });

    const { data: countriesData, isLoading: countriesLoading, error: countriesError } = useGetCountriesQuery();
    const { data: statesData, isLoading: statesLoading, error: stateError } = useGetStatesQuery(formData.country_id, { skip: !formData.country_id });
    const { data: citiesData, isLoading: citiesLoading, error: citiesError } = useGetCitiesQuery(formData.state_id, { skip: !formData.state_id });
    const [createCluster, { isLoading: isCreating, error: createError }] = useCreateClusterMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if (countriesError || stateError) {
            console.error('Error fetching data:', countriesError || stateError);
        }
    }, [countriesError, stateError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCluster(formData).unwrap();
            alert('Cluster created successfully!');
            setFormData({
                name: '',
                email: '',
                country_id: '',
                state_id: '',
                city_id: '',
                location: '',
                latitude: '0',
                longitude: '0',
            });
            navigate('/create');
        } catch (error) {
            console.error('Error creating cluster:', error);
            alert('Failed to create cluster.');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Paper elevation={6} sx={{ p: 5, borderRadius: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h4" align="center" mb={3} color="primary.main" fontWeight="bold">
                    Create New Cluster
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {/* Cluster Name */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Cluster Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        />
                    </Grid>

                    {/* Country Dropdown */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="Country"
                            name="country_id"
                            value={formData.country_id}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="outlined"
                            disabled={countriesLoading}
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        >
                            {countriesLoading ? (
                                <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                            ) : (
                                countriesData?.countries?.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>
                                        {country.name}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>
                    </Grid>

                    {/* State Dropdown */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="State"
                            name="state_id"
                            value={formData.state_id}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="outlined"
                            disabled={!formData.country_id || statesLoading}
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        >
                            {statesLoading ? (
                                <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                            ) : (
                                statesData?.states?.map((state) => (
                                    <MenuItem key={state.id} value={state.id}>
                                        {state.name}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>
                    </Grid>

                    {/* City Dropdown */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="City"
                            name="city_id"
                            value={formData.city_id}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="outlined"
                            disabled={!formData.state_id || citiesLoading}
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        >
                            {citiesLoading ? (
                                <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                            ) : (
                                citiesData?.cities?.map((city) => (
                                    <MenuItem key={city.id} value={city.id}>
                                        {city.name}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>
                    </Grid>

                    {/* Location */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isCreating}
                            sx={{
                                mt: 3, 
                                py: 1.5, 
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                }
                            }}
                        >
                            {isCreating ? <CircularProgress size={24} color="inherit" /> : 'Create Cluster'}
                        </Button>
                    </Grid>

                    {/* Error Message */}
                    {createError && (
                        <Grid item xs={12}>
                            <Typography color="error" align="center" mt={2}>
                                Error: {createError?.data?.message || 'Failed to create cluster'}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Box>
    );
};

export default ClusterForm;
