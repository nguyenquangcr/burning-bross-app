"use client";
import React from "react";
import {
  useGetAllProductQuery,
  useLazyGetAllProductQuery,
} from "../../provider/redux/query/Product";
import { ListProduct, Product } from "@/types/product.type";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  // const { data, isError, isLoading } = useGetAllProductQuery({
  //   limit: 20,
  //   skip: 20,
  // });

  const [getProduct] = useLazyGetAllProductQuery();
  //state
  const [listProduct, setListProduct] = React.useState<ListProduct | null>(
    null
  );

  React.useEffect(() => {
    getProduct({ limit: 20, skip: 0 })
      .unwrap()
      .then((res: ListProduct) => {
        setListProduct(res);
      });
  }, []);

  const fetchMoreData = () => {
    getProduct({ limit: 20, skip: listProduct?.products?.length ?? 0 })
      .unwrap()
      .then((res: ListProduct) => {
        setListProduct(res);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div id="scrollableDiv" className="max-w-max max-h-[200px] overflow-auto">
        <InfiniteScroll
          dataLength={listProduct?.products?.length ?? 0}
          hasMore={true}
          next={() => fetchMoreData()}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
        >
          {listProduct &&
            listProduct.products?.map((item: Product) => {
              return <div key={item.id}>{item.title}</div>;
            })}
        </InfiniteScroll>
      </div>
    </main>
  );
}
