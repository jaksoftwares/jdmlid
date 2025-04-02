"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaSearch, FaFilter, FaPlusCircle } from "react-icons/fa";
import api from "@/utils/api";
import { Category, LostID } from "@/types/types";

interface CacheData<T> {
  timestamp: number;
  data: T;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

const getCache = <T,>(key: string): CacheData<T> | null => {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(key);
  return cached ? JSON.parse(cached) : null;
};

const setCache = <T,>(key: string, data: T) => {
  if (typeof window === "undefined") return;
  const cache: CacheData<T> = {
    timestamp: Date.now(),
    data,
  };
  localStorage.setItem(key, JSON.stringify(cache));
};

const LostIDs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [lostIDs, setLostIDs] = useState<LostID[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cachedIDs, cachedCategories] = [
          getCache<LostID[]>('lostIDsCache'),
          getCache<Category[]>('categoriesCache'),
        ];

        const shouldFetchIDs = !cachedIDs || Date.now() - cachedIDs.timestamp > CACHE_DURATION;
        const shouldFetchCategories = !cachedCategories || Date.now() - cachedCategories.timestamp > CACHE_DURATION;

        const fetchPromises = {
          ids: shouldFetchIDs ? api.fetchLostIDs() : Promise.resolve(cachedIDs?.data || []),
          categories: shouldFetchCategories ? api.fetchIDCategories() : Promise.resolve(cachedCategories?.data || []),
        };

        const [fetchedIDs, fetchedCategories] = await Promise.all([
          fetchPromises.ids,
          fetchPromises.categories,
        ]);

        // Update state and cache
        if (shouldFetchIDs) {
          setLostIDs(fetchedIDs);
          setCache('lostIDsCache', fetchedIDs);
        } else {
          setLostIDs(cachedIDs?.data || []);
        }

        if (shouldFetchCategories) {
          setCategories(fetchedCategories);
          setCache('categoriesCache', fetchedCategories);
        } else {
          setCategories(cachedCategories?.data || []);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const filteredIDs = lostIDs.filter((id) =>
    (filter === "all" || id.category_id === filter) &&
    (searchQuery === "" || id.owner_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10 pt-24">
      <section className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-jkuatGreen">
          Search for Lost IDs
        </h1>
        <p className="text-gray-600 mt-2">
          Find and retrieve your lost identification documents easily.
        </p>
      </section>

      {loading && <p className="text-center text-gray-600">Loading lost IDs...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col md:flex-row justify-center gap-4 max-w-3xl mx-auto mb-8 ">
          <div className="relative w-full md:w-2/3 ">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by owner name..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-jkuatGreen focus:outline-none"
            />
          </div>

          <div className="relative w-full md:w-1/3 z-10">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-jkuatGreen focus:outline-none bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!loading && !error && (
        <section className="max-w-5xl mx-auto">
          {categories.map((category) => {
            const categoryIDs = filteredIDs.filter((id) => id.category_id === category.id);
            if (categoryIDs.length === 0) return null;

            return (
              <div key={category.id} className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 border-b-4 border-jkuatGreen inline-block pb-2">
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {categoryIDs.map((id) => (
                    <div
                      key={id.id}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                    >
                      <h3 className="text-xl font-semibold text-jkuatGreen">{id.owner_name}</h3>
                      <p className="text-gray-600 mt-1">ID Number: {id.id_number}</p>
                      <p className="text-gray-500 text-sm mt-1">Found at: {id.location_found}</p>
                      <p className="text-gray-500 text-sm mt-1">Date: {id.date_found}</p>
                      <Link
                        href={`/lost-ids/${id.id}`}
                        className="block text-jkuatYellow font-semibold mt-4 hover:text-yellow-500 transition"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {!loading && !error && (
        <section className="text-center mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-jkuatGreen">
            Found an ID?
          </h2>
          <p className="text-gray-600 mt-2">
            Help someone by reporting a found ID.
          </p>
          <Link
            href="/report-id"
            className="mt-4 inline-flex items-center bg-jkuatYellow text-jkuatGreen px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            <FaPlusCircle className="mr-2" /> Report Found ID
          </Link>
        </section>
      )}
    </main>
  );
};

export default LostIDs;