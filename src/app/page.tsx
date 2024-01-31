"use client";
import React from "react";
import {
  useLazyGetAllProductQuery,
  useLazyGetProductsByKeySearchQuery,
} from "../../provider/redux/query/Product";
import { ListProduct, Product } from "@/types/product.type";
import InfiniteScroll from "react-infinite-scroll-component";
import useDebounce from "@/hooks/useDebounce";
import Image from "next/image";

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
  React.useEffect(() => {
    getProduct({ limit: 20, skip: 0 })
      .unwrap()
      .then((res: ListProduct) => {
        setListProduct(res.products ?? []);
      })
      .catch((error) => {
        setError("Error fetching products. Please try again later.");
      });
  }, []);

  React.useEffect(() => {
    if (debouncedKeySearch) {
      if (debouncedKeySearch !== "") {
        setListProduct([]);
        getProductByKey({ search: debouncedKeySearch, skip: 0 })
          .unwrap()
          .then((res: ListProduct) => {
            setListProduct(res.products);
          });
      }
    } else {
      setListProduct([]);
      getProduct({ limit: 20, skip: 0 })
        .unwrap()
        .then((res: ListProduct) => {
          setListProduct(res.products ?? []);
        });
    }
  }, [debouncedKeySearch]);

  const fetchMoreData = async () => {
    if (debouncedKeySearch) {
      getProductByKey({ search: debouncedKeySearch, skip: listProduct?.length })
        .unwrap()
        .then((res: ListProduct) => {
          setListProduct(listProduct.concat(res.products));
        });
    } else
      getProduct({ limit: 20, skip: listProduct?.length })
        .unwrap()
        .then((res: ListProduct) =>
          setListProduct(listProduct.concat(res.products))
        );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setKeySearch(value);
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
                      <Image
                        className="h-[50px]"
                        src={item.images[0]}
                        alt="_"
                        width={100}
                        height={50}
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
