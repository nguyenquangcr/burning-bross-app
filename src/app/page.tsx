/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import {
  useLazyGetAllProductQuery,
  useLazyGetProductsByKeySearchQuery,
} from "../../provider/redux/query/Product";
import { ListProduct, Product } from "@/types/product.type";
import InfiniteScroll from "react-infinite-scroll-component";
import useDebounce from "@/hooks/useDebounce";

export default function Home() {
  const [getProduct] = useLazyGetAllProductQuery();
  const [getProductByKey] = useLazyGetProductsByKeySearchQuery();
  //state
  const [listProduct, setListProduct] = React.useState<Array<Product>>([]);
  const [keySearch, setKeySearch] = React.useState<string | undefined>(
    undefined
  );
  const [error, setError] = React.useState<string | null>(null);
  const debouncedKeySearch = useDebounce(keySearch, 500);

  console.log("debouncedKeySearch", debouncedKeySearch);

  React.useEffect(() => {
    getProduct({ limit: 20, skip: 0 })
      .unwrap()
      .then((res: ListProduct) => {
        setListProduct(res.products ?? []);
      })
      .catch((error) => {
        setError("Error fetching products. Please try again later."); // Set error message
      });
  }, []);

  React.useEffect(() => {
    // Fetch products when debouncedKeySearch changes
    if (debouncedKeySearch) {
      if (debouncedKeySearch !== "") {
        getProductByKey({ search: debouncedKeySearch, skip: 0 })
          .unwrap()
          .then((res: ListProduct) => {
            setListProduct(res.products);
          });
      } else {
        getProduct({ limit: 20, skip: 0 })
          .unwrap()
          .then((res: ListProduct) => {
            setListProduct(res.products ?? []);
          });
      }
    }
  }, [debouncedKeySearch]);

  const fetchMoreData = async () => {
    if (debouncedKeySearch === "") {
      getProduct({ limit: 20, skip: listProduct?.length })
        .unwrap()
        .then((res: ListProduct) =>
          setListProduct(listProduct.concat(res.products))
        );
    } else {
      getProductByKey({ search: debouncedKeySearch, skip: listProduct?.length })
        .unwrap()
        .then((res: ListProduct) => {
          setListProduct(res.products);
        });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setKeySearch(value);
    // if (value !== "") {
    //   setKeySearch(value);
    //   getProductByKey({ search: value, skip: 0 })
    //     .unwrap()
    //     .then((res: ListProduct) => {
    //       setListProduct(res.products);
    //     });
    // } else {
    //   setKeySearch(null);
    //   getProduct({ limit: 20, skip: 0 })
    //     .unwrap()
    //     .then((res: ListProduct) => {
    //       setListProduct(res.products ?? []);
    //     });
    // }
  };
  return (
    <main className="flex min-h-screen flex-col space-x-4 p-24 gap-y-10">
      <input
        placeholder="Search name product"
        className="w-[300px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        onChange={(e) => handleChange(e)}
      />
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div id="scrollableDiv" className="w-fit max-h-[600px] overflow-auto">
          <InfiniteScroll
            dataLength={listProduct?.length ?? 0}
            hasMore={true}
            next={() => fetchMoreData()}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv"
          >
            {listProduct &&
              listProduct?.map((item: Product) => {
                return (
                  <div
                    className="flex flex-row justify-start p-2 space-x-4 border border-gray-300"
                    key={item.id}
                  >
                    <div>Name: {item.title}</div>
                    <div>Price: {item.price}</div>
                    <div>
                      Image:{" "}
                      <img
                        className="h-[50px]"
                        src={item.images[0]}
                        alt="_"
                        width={100}
                      />
                    </div>
                  </div>
                );
              })}
          </InfiniteScroll>
        </div>
      )}
    </main>
  );
}
