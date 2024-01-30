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
    }),
    getProductsByKeySearch: builder.query<ListProduct, {search: string, skip:number}>({
      query: ({search, skip}) => ({
        url: `/products/search?q=${search}&limit=20&skip=${skip}`,
        method: 'GET'
      })
    }),
  }),
})

export const { useGetAllProductQuery, useLazyGetAllProductQuery, useLazyGetProductsByKeySearchQuery } = ProductApi;