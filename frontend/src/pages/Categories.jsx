import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toolsService } from "../services/api";
import {
  FiCompass,
  FiTrendingUp,
  FiSearch,
  FiFeather,
  FiTv,
  FiCpu,
  FiPlusCircle,
  FiArrowRight,
} from "react-icons/fi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to match category description
  const getCategoryDescription = (name) => {
    const n = String(name).toLowerCase();
    if (n.includes("design")) {
      return "Create stunning visuals, generate AI art, and access premium creative suites at unbeatable prices.";
    }
    if (n.includes("seo")) {
      return "Dominate search rankings with professional keyword research, competitor analysis, and site audit tools.";
    }
    if (n.includes("ai") && !n.includes("design")) {
      return "Leverage the power of artificial intelligence for writing, analysis, coding, and creative work.";
    }
    if (n.includes("writing")) {
      return "Write better, faster, and more effectively with AI-powered writing assistants and grammar checkers.";
    }
    if (n.includes("streaming")) {
      return "Stream unlimited movies, shows, and music in the best quality without breaking the bank.";
    }
    return "Explore premium subscription accounts and digital platforms to level up your work and workflow.";
  };

  // Helper to match category icons
  const getCategoryIcon = (name) => {
    const n = String(name).toLowerCase();
    if (n.includes("design")) {
      return <FiCompass className="w-6 h-6 text-purple-500" />;
    }
    if (n.includes("seo")) {
      return <FiSearch className="w-6 h-6 text-emerald-500" />;
    }
    if (n.includes("ai") && !n.includes("design")) {
      return <FiCpu className="w-6 h-6 text-blue-500" />;
    }
    if (n.includes("writing")) {
      return <FiFeather className="w-6 h-6 text-amber-500" />;
    }
    if (n.includes("streaming")) {
      return <FiTv className="w-6 h-6 text-red-500" />;
    }
    return <FiPlusCircle className="w-6 h-6 text-slate-500" />;
  };

  // Helper to match category border colors for premium cards
  const getCategoryBorderClass = (name) => {
    const n = String(name).toLowerCase();
    if (n.includes("design"))
      return "hover:border-purple-300 border-purple-100/50 dark:border-slate-800 bg-purple-500/5 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400";
    if (n.includes("seo"))
      return "hover:border-emerald-300 border-emerald-100/50 dark:border-slate-800 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    if (n.includes("ai") && !n.includes("design"))
      return "hover:border-blue-300 border-blue-100/50 dark:border-slate-800 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400";
    if (n.includes("writing"))
      return "hover:border-amber-300 border-amber-100/50 dark:border-slate-800 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400";
    if (n.includes("streaming"))
      return "hover:border-red-300 border-rose-100/50 dark:border-slate-800 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400";
    return "hover:border-brand-300 border-slate-200 bg-slate-500/5 text-brand-600 dark:text-brand-400";
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await toolsService.getCategories();
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
          Categories
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
          Browse by Category
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Find exactly what you need from our curated collection of premium
          digital tools and subscription services.
        </p>
      </div>

      {loading ? (
        /* Skeletons */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shimmer"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => {
            const borderGlowClass = getCategoryBorderClass(cat.name);
            return (
              <Link
                key={i}
                to={`/tools?category=${encodeURIComponent(cat.name)}`}
                className={`group relative p-8 bg-white dark:bg-slate-900 rounded-3xl border shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 overflow-hidden flex flex-col justify-between h-72 ${borderGlowClass}`}
              >
                {/* Decorative background glow */}
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl bg-current opacity-5 group-hover:opacity-10 transition-opacity"></div>

                <div className="space-y-4">
                  {/* Category icon */}
                  <div className="inline-flex p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-850 text-current">
                    {getCategoryIcon(cat.name)}
                  </div>

                  <h3 className="text-xl font-bold text-slate-850 dark:text-white group-hover:text-brand-500 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {getCategoryDescription(cat.name)}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100/50 dark:border-slate-800/50">
                  <span className="text-xs font-semibold text-brand-500">
                    {cat.count} {cat.count === 1 ? "tool" : "tools"}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-brand-500 group-hover:underline">
                    <span>Browse</span>
                    <FiArrowRight />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Request Tool CTA */}
      <div className="text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-2xl mx-auto space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Can't find what you're looking for?
        </p>
        <Link
          to="https://wa.me/923021547374?text=Hello,%20I%20want%2520to%20request%20a%20digital%20tool."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-brand-600/30 transition-all text-sm"
        >
          Request a tool on WhatsApp
        </Link>
      </div>
    </div>
  );
};

export default Categories;
