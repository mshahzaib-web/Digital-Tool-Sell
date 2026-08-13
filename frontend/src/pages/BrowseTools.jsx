import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toolsService } from "../services/api";
import ToolCard from "../components/ToolCard";
import {
  FiSearch,
  FiSliders,
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiRefreshCw,
  FiStar,
  FiZap,
  FiArrowRight,
} from "react-icons/fi";
import { getCategoryStyles } from "../components/ToolCard";

const BrowseTools = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State variables matching URL query params
  const initialCategory = searchParams.get("category") || "All Categories";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "newest";
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [page, setPage] = useState(initialPage);

  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalTools, setTotalTools] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await toolsService.getCategories();
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Fetch tools whenever parameters change
  useEffect(() => {
    const fetchToolsData = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          sort,
        };

        if (category && category !== "All Categories")
          params.category = category;
        if (search) params.search = search;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await toolsService.getAll(params);
        if (res.data.success) {
          setTools(res.data.tools);
          setTotalTools(res.data.total);
          setTotalPages(res.data.pages || 1);
        }
      } catch (err) {
        console.error("Error loading tools:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToolsData();
  }, [category, search, sort, minPrice, maxPrice, page]);

  // Sync URL search params
  const updateURLParams = (updatedPage = page) => {
    const params = {};
    if (category && category !== "All Categories") params.category = category;
    if (search) params.search = search;
    if (sort !== "newest") params.sort = sort;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (updatedPage > 1) params.page = String(updatedPage);

    setSearchParams(params);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
    updateURLParams(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
    updateURLParams(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
    updateURLParams(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      updateURLParams(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8">
      {/* Header and Layout control */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 mb-2">
            All Tools
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
            Browse Premium Tools
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {totalTools} {totalTools === 1 ? "tool" : "tools"} available in the
            marketplace.
          </p>
        </div>

        {/* Grid/List layout switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-xl border transition-all ${viewMode === "grid" ? "bg-brand-500 border-brand-500 text-white shadow-md" : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"}`}
            title="Grid View"
          >
            <FiGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 rounded-xl border transition-all ${viewMode === "list" ? "bg-brand-500 border-brand-500 text-white shadow-md" : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"}`}
            title="List View"
          >
            <FiList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-glass dark:shadow-glass-dark p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="w-full lg:flex-1 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <FiSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search tools by name, features, categories..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm text-slate-800 dark:text-white"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm text-slate-800 dark:text-white"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={sort}
              onChange={handleSortChange}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm text-slate-800 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Toggle Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full lg:w-32 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${showFilters ? "bg-brand-50 border-brand-500/30 text-brand-500" : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650"}`}
          >
            <FiSliders className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showFilters && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              {/* Min Price */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Min ($):
                </span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="0.00"
                  className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs text-slate-805 dark:text-white"
                />
              </div>

              {/* Max Price */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Max ($):
                </span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="10.00"
                  className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs text-slate-805 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleResetFilters}
              className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/30 rounded-xl text-xs font-medium transition-colors"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid or List Tools display */}
      {loading ? (
        /* Skeletons */
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shimmer ${viewMode === "list" ? "h-32" : "h-[420px]"}`}
            ></div>
          ))}
        </div>
      ) : tools.length > 0 ? (
        viewMode === "grid" ? (
          /* Grid View Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool._id} tool={tool} />
            ))}
          </div>
        ) : (
          /* List View Layout (Horizontal Cards) */
          <div className="space-y-4">
            {tools.map((tool) => {
              const originalPrice =
                tool.discount > 0
                  ? (tool.price / (1 - tool.discount / 100)).toFixed(2)
                  : null;
              return (
                <div
                  key={tool._id}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-4 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >
                  {/* Discount tag */}
                  {tool.discount > 0 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                      -{tool.discount}%
                    </span>
                  )}
                  {/* Image */}
                  <div className="w-24 h-20 md:w-32 md:h-24 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={tool.image}
                      alt={tool.toolName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Info Column */}
                  <div className="flex-1 text-center md:text-left space-y-1">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getCategoryStyles(tool.category)}`}
                    >
                      {tool.category}
                    </span>
                    <h3 className="font-bold text-slate-800 dark:text-white">
                      {tool.toolName}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1">
                      {tool.description}
                    </p>
                  </div>
                  {/* Rating/Delivery Speed */}
                  <div className="flex flex-row md:flex-col items-center justify-center gap-4 md:gap-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <FiStar className="fill-current" />
                      <span>{tool.rating?.toFixed(1) || "5.0"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiZap className="text-brand-500" />
                      <span>{tool.deliveryTime || "Instant"}</span>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="text-center md:text-right min-w-[100px]">
                    <div className="flex items-baseline justify-center md:justify-end gap-1.5">
                      <span className="font-extrabold text-slate-900 dark:text-white text-base">
                        ${tool.price.toFixed(2)}
                      </span>
                      {originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ${originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {tool.pricingType || "/mo"}
                    </span>
                  </div>
                  {/* View Link */}
                  <Link
                    to={`/tools/${tool._id}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all border border-slate-200 dark:border-slate-700/60"
                  >
                    <span>Details</span>
                    <FiArrowRight />
                  </Link>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 p-8 space-y-4">
          <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
            <FiFilter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            No tools found matching filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category,
            changing the price limits, or resetting your filter options.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-50 transition-colors"
            title="Previous Page"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-widest">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-50 transition-colors"
            title="Next Page"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Add New Tool Call to Action */}
      <div className="text-center py-8 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Want to list a tool?
        </p>
        <Link
          to="/add-tool"
          className="inline-flex items-center justify-center px-6 py-2.5 border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-750 dark:text-slate-350 text-xs font-bold rounded-xl transition-all"
        >
          Add New Tool
        </Link>
      </div>
    </div>
  );
};

export default BrowseTools;
