"use client";

import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Tproduct } from "../../../utils/componentType";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [products, setProducts] = useState<Tproduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    { id: number; 
      title: string; 
      imageUrl: string 
    }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProducts = await client.fetch(
        `*[_type == "product"]{
          id,
          title,
          "imageUrl": productImage.asset->url
        }`
      );
      setProducts(fetchedProducts);
    };

    fetchData();
  }, []);

  const handleSearch = (e:any) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const results = products.filter((product) =>
      product.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(
      results.map((product) => ({
        id: product.id, 
        title: product.title,
        imageUrl: product.imageUrl,
      }))
    );
  };

  const handleProductClick = (id: number) => {
    router.push(`/productList/${id}`);
  };

  return (
    <div className="relative">
      <button className="text-xs flex" onClick={() => setShowInput(!showInput)}>
        <CiSearch className="text-3xl" />
      </button>

      {showInput && (
        <div className="absolute top-12 left-0  w-full flex justify-center items-center z-50">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-80 h-10 px-4 outline-none rounded-md border"/>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="absolute top-24 left-1/2  transform -translate-x-1/2 justify-center w-[270px] md:w-[400px] bg-white shadow-lg max-h-60 overflow-y-auto rounded-md border z-50">
          <ul>
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="p-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                onClick={() => handleProductClick(product.id)}>
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-10 h-10 object-cover rounded"/>
                <span>{product.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
