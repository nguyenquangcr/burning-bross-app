import { Product } from "@/types/product.type";
import Image from "next/image";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type ProductPropst = {
  listProduct: Array<Product>;
  fetchMoreData: () => void;
};

const ProductComponent = ({ fetchMoreData, listProduct }: ProductPropst) => {
  return (
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
  );
};

export default ProductComponent;
