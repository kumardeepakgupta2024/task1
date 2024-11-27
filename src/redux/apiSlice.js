import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const clusterApi = createApi({
  reducerPath: 'clusterApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://143.110.178.49/ev-charging-backend/api' }),
  endpoints: (builder) => ({
    // List Clusters with Pagination and Filters
    getClusters: builder.query({
      query: ({ page = 1, filters = {} }) => {
        const { name = '', country = '', state = '', city = '' } = filters;
        return `/clusters/list?page=${page}&cluster_name=${name}&country_name=${country}&state_name=${state}&city_name=${city}`;
      },
    }),

    
    createCluster: builder.mutation({
      query: (data) => ({
        url: 'http://143.110.178.49/ev-charging-backend/api/clusters/create ',
        method: 'POST',
        body: {
          ...data,
          latitude: '0', 
          longitude: '0', 
        },
      }),
    }),


    updateCluster: builder.mutation({
      query: ({ id, data }) => ({
        url: `http://143.110.178.49/ev-charging-backend/api/clusters/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    getClusterById: builder.query({
      query: (id) => `http://143.110.178.49/ev-charging-backend/api/clusters/show/${id} `,
    }),

    // Soft Delete Cluster
    softDeleteCluster: builder.mutation({
      query: ({ id }) => ({
        url: `http://143.110.178.49/ev-charging-backend/api/clusters/soft-delete/${id}`,
        method: 'DELETE',
      }),
    }),

  
    restoreCluster: builder.mutation({
      query: (id) => ({
        url: `http://143.110.178.49/ev-charging-backend/api/clusters/restore/${id}`,
        method: 'POST',
      }),
    }),

    // Fetch Countries
    getCountries: builder.query({
      query: (id) => '/countries', 
    }),

    // Fetch States by Country ID
    getStates: builder.query({
      query: (countryId) => `/states/${countryId}`, 
    }),

    // Fetch Cities by State ID
    getCities: builder.query({
      query: (stateId) => `/cities/${stateId}`,
    }),
  }),
});

export const {
  useGetClustersQuery,
  useCreateClusterMutation,
  useUpdateClusterMutation,
  useGetClusterByIdQuery,
  useSoftDeleteClusterMutation,
  useRestoreClusterMutation,
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetCitiesQuery,
} = clusterApi;
