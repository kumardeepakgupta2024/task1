import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, Typography, CircularProgress, Grid, Paper, Divider, Autocomplete } from '@mui/material';
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


    const [errors, setErrors] = useState({});


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
            setErrors({}); // Clear errors on success
            navigate('/create');
        } catch (error) {
            console.error('Error creating cluster:', error);
            // Extract field-specific errors from the API response
            if (error?.data?.errors) {  // Assuming your API returns errors in this structure
                setErrors(error.data.errors);
            } else {
                alert('Failed to create cluster. Please try again.');
            }
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
                            error={!!errors.name}
                            helperText={errors.name || ''}
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
                            error={errors.email || null}
                            helperText={errors.email || ''}
                            variant="outlined"
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        />
                    </Grid>

                    {/* Country Dropdown */}
                    <Grid item xs={12} sm={6}>
                    <Autocomplete
                            fullWidth
                            options={countriesData?.countries || []}
                            getOptionLabel={(option) => option.name}
                            value={countriesData?.countries?.find((country) => country.id === formData.country_id) || null}
                            onChange={(e, value) => setFormData({ ...formData, country_id: value?.id || '' })}
                            loading={countriesLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Country"
                                    required
                                    variant="outlined"
                                    error={countriesError?.data?.message}
                                    helperText={countriesError?.data?.message}
                                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                                />
                            )}
                        />
                    </Grid>

                    {/* State Dropdown */}
                    <Grid item xs={12} sm={6}>
                    <Autocomplete
                            fullWidth
                            options={statesData?.states || []}
                            getOptionLabel={(option) => option.name}
                            value={statesData?.states?.find((state) => state.id === formData.state_id) || null}
                            onChange={(e, value) => setFormData({ ...formData, state_id: value?.id || '' })}
                            loading={statesLoading}
                            disabled={!formData.country_id || statesLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="State"
                                    required
                                    variant="outlined"
                                    error={stateError?.data?.message}
                                    helperText={stateError?.data?.message}
                                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                                />
                            )}
                        />
                    </Grid>

                    {/* City Dropdown */}
                    <Grid item xs={12} sm={6}>
                    <Autocomplete
                            fullWidth
                            options={citiesData?.cities || []}
                            getOptionLabel={(option) => option.name}
                            value={citiesData?.cities?.find((city) => city.id === formData.city_id) || null}
                            onChange={(e, value) => setFormData({ ...formData, city_id: value?.id || '' })}
                            loading={citiesLoading}
                            disabled={!formData.state_id || citiesLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="City"
                                    required
                                    variant="outlined"
                                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                                />
                            )}
                        />
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
                            error={!!errors.location}
                            helperText={errors.location || ''}
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}

                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            // fullWidth
                            disabled={isCreating}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: 2,
                                float:"inline-end",
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                }
                            }}
                        >
                            {isCreating ? <CircularProgress size={24} color="inherit" /> : 'Save'}
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
