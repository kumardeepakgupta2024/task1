import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const clusterApi = createApi({
  reducerPath: 'clusterApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://143.110.178.49/ev-charging-backend/api' }),
  endpoints: (builder) => ({
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
        method: 'post',
        body: {...data},
      }),
    }),


    getClusterById: builder.query({
      query: (id) => `http://143.110.178.49/ev-charging-backend/api/clusters/show/${id} `,
    }),
    softDeleteCluster: builder.mutation({
      query: ({ id }) => ({
        url: `http://143.110.178.49/ev-charging-backend/api/clusters/soft-delete/${id}`,
        method: 'Post',
      }),
    }),


    restoreCluster: builder.mutation({
      query: (id) => ({
        url: `http://143.110.178.49/ev-charging-backend/api/clusters/restore/${id}`,
        method: 'POST',
      }),
    }),
    getCountries: builder.query({
      query: (id) => '/countries',
    }),
    getStates: builder.query({
      query: (countryId) => `/states/${countryId}`,
    }),

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
