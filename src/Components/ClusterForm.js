import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, Typography, CircularProgress } from '@mui/material';
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
        if (stateError) {
            console.error('Error fetching cities:', stateError);
        }
    }, [statesData, stateError]);

    useEffect(() => {
        if (citiesData) {
            console.error('city:', citiesData);
        }
        if (createError) {
            console.error('Error fetching cities:', createError);
        }
    }, [citiesData, createError]);

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
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" mb={3}>Create Cluster</Typography>

            <TextField
                fullWidth
                label="Cluster Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
            />

            <TextField
                select
                fullWidth
                label="Country"
                name="country_id"
                value={formData.country_id}
                onChange={handleChange}
                margin="normal"
                required
                disabled={countriesLoading}
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

            <TextField
                select
                fullWidth
                label="State"
                name="state_id"
                value={formData.state_id}
                onChange={handleChange}
                margin="normal"
                required
                disabled={!formData.country_id || statesLoading}
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

            <TextField
                select
                fullWidth
                label="City"
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                margin="normal"
                required
                disabled={!formData.state_id || citiesLoading}
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

            <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                margin="normal"
                required
            />

            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isCreating} sx={{ mt: 2 }}>
                {isCreating ? 'Submitting...' : 'Submit'}
            </Button>

            {createError && <Typography color="error" mt={2}>Error: {createError?.data?.message || 'data already submitted'}</Typography>}
        </Box>
    );
};

export default ClusterForm;
