import { ListProduct, Product } from '@/types/product.type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ProductApi = createApi({
  reducerPath: 'ProductApi',
  baseQuery: fetchBaseQuery({baseUrl: 'https://dummyjson.com'}),
  endpoints: (builder) => ({
    getAllProduct: builder.query<ListProduct, {limit: number; skip:number}>({
      query: ({limit, skip}) => ({
        url: `/products?limit=${limit}&skip=${skip}`,
        method: 'GET'
      })
    })
  }),
})

export const { useGetAllProductQuery, useLazyGetAllProductQuery } = ProductApi;