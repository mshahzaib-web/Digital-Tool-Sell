import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toolsService } from "../services/api";
import { useAdmin } from "../context/AdminContext";
import ToolCard, { getCategoryStyles } from "../components/ToolCard";
import AdminLoginModal from "../components/AdminLoginModal";
import {
  FiClock,
  FiStar,
  FiZap,
  FiExternalLink,
  FiShoppingCart,
  FiEdit,
  FiTrash2,
  FiChevronRight,
  FiCheckCircle,
  FiShield,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";

const ToolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const [tool, setTool] = useState(null);
  const [relatedTools, setRelatedTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Login Modal Trigger
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchToolDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await toolsService.getById(id);
        if (res.data.success) {
          setTool(res.data.tool);
          setRelatedTools(res.data.relatedTools || []);
        } else {
          setError("Failed to fetch tool details.");
        }
      } catch (err) {
        console.error("Error fetching tool:", err);
        setError(
          err.response?.data?.message || "Tool not found or server error.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchToolDetails();
  }, [id]);

  const handleBuyNow = () => {
    if (!tool) return;
    const whatsappNumber = "923021547374";
    const message = `Hello, I want to buy ${tool.toolName}.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank",
    );
  };

  const handleDeleteClick = () => {
    if (!isAdmin) {
      setLoginModalOpen(true);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await toolsService.delete(id);
      if (res.data.success) {
        navigate("/tools");
      } else {
        setDeleteError("Failed to delete tool.");
      }
    } catch (err) {
      console.error("Error deleting tool:", err);
      setDeleteError(
        err.response?.data?.message ||
          "Error occurred during deletion. Double check admin session.",
      );
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowDeleteConfirm(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="inline-flex p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full">
          <FiInfo className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-805 dark:text-white">
          Product Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {error || "The tool details you requested are unavailable."}
        </p>
        <Link
          to="/tools"
          className="inline-block px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md"
        >
          Back to Browse Tools
        </Link>
      </div>
    );
  }

  const originalPrice =
    tool.discount > 0
      ? (tool.price / (1 - tool.discount / 100)).toFixed(2)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-550 dark:text-slate-450 font-medium">
        <Link to="/" className="hover:text-brand-500 transition-colors">
          Home
        </Link>
        <FiChevronRight />
        <Link to="/tools" className="hover:text-brand-500 transition-colors">
          Tools
        </Link>
        <FiChevronRight />
        <span className="text-slate-800 dark:text-white font-bold truncate max-w-[200px]">
          {tool.toolName}
        </span>
      </nav>

      {/* Main product box */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Side: Product Image & stats */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="aspect-[4/3] rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative">
            <img
              src={tool.image}
              alt={tool.toolName}
              className="w-full h-full object-cover"
            />
            {tool.discount > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-xl shadow-md">
                -{tool.discount}% Discounted
              </span>
            )}
          </div>

          {/* Small stats badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Delivery
              </span>
              <div className="flex items-center gap-1.5 text-slate-850 dark:text-white font-bold text-xs">
                <FiZap className="text-brand-500" />
                <span>{tool.deliveryTime || "Instant"}</span>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Rating
              </span>
              <div className="flex items-center gap-1 text-slate-850 dark:text-white font-bold text-xs">
                <FiStar className="fill-current text-amber-500" />
                <span>{tool.rating?.toFixed(1) || "5.0"} / 5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tool Details, specs, CTAs */}
        <div className="w-full lg:w-1/2 space-y-8">
          {/* Metadata badges and title */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryStyles(tool.category)}`}
              >
                {tool.category}
              </span>
              <span className="px-3 py-1 bg-brand-50 text-brand-600 dark:bg-brand-950/20 dark:text-brand-400 rounded-full text-xs font-bold border border-brand-100 dark:border-brand-900/30">
                {tool.pricingType}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${tool.stockStatus === "In Stock" ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30" : "bg-red-50 text-red-650 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"}`}
              >
                {tool.stockStatus || "In Stock"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {tool.toolName}
            </h1>

            {/* Price display */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                ${tool.price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-lg text-slate-400 line-through">
                  ${originalPrice}
                </span>
              )}
              <span className="text-sm text-slate-400">/ month</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Description
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Features Checklist */}
          {tool.features && tool.features.length > 0 && (
            <div className="space-y-4 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-widest">
                Included Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tool.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400"
                  >
                    <FiCheckCircle className="w-4.5 h-4.5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Seller Notes */}
          {tool.sellerNotes && (
            <div className="p-4 bg-purple-50/50 dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-2xl space-y-1.5 shadow-xs">
              <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                Seller Notes
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {tool.sellerNotes}
              </p>
            </div>
          )}

          {/* Official Website Link */}
          {tool.websiteUrl && (
            <Link
              to={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:underline"
            >
              <span>Visit Official Website</span>
              <FiExternalLink />
            </Link>
          )}

          {/* Primary Action buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <button
              onClick={handleBuyNow}
              disabled={tool.stockStatus === "Out of Stock"}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/20 hover:shadow-brand-600/35 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>Buy Now via WhatsApp</span>
            </button>

            {/* Admin actions (Update / Delete) */}
            {isAdmin ? (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to={isAdmin ? `/update-tool/${tool._id}` : "#"}
                  onClick={(e) => {
                    if (!isAdmin) {
                      e.preventDefault();
                      setLoginModalOpen(true);
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold rounded-2xl transition-all"
                >
                  <FiEdit />
                  <span>Update</span>
                </Link>

                <button
                  onClick={handleDeleteClick}
                  className="flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/25 border border-red-100 dark:border-red-900/30 text-red-650 dark:text-red-400 text-xs font-bold rounded-2xl transition-all"
                >
                  <FiTrash2 />
                  <span>Delete</span>
                </button>
              </div>
            ) : null}

            <p className="text-[10px] text-slate-450 dark:text-slate-500 text-center leading-relaxed pt-1.5 flex items-center justify-center gap-1.5">
              <FiShield />
              <span>
                Secure purchase via WhatsApp. Replacement guarantee included.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xl text-center">
            <div className="inline-flex p-3 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full">
              <FiAlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-850 dark:text-white">
                Delete Product?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-700 dark:text-slate-350">
                  '{tool.toolName}'
                </span>
                ? This database action is permanent and cannot be undone.
              </p>
              {deleteError && (
                <p className="text-xs font-semibold text-red-500">
                  {deleteError}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal Overlay */}
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Related Tools Section */}
      {relatedTools && relatedTools.length > 0 && (
        <section className="space-y-8 pt-12 border-t border-slate-200/50 dark:border-slate-800/50">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedTools.map((rel) => (
              <ToolCard key={rel._id} tool={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ToolDetails;
