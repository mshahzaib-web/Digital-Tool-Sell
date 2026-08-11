import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toolsService } from "../services/api";
import { useAdmin } from "../context/AdminContext";
import {
  FiArrowLeft,
  FiPlus,
  FiAlertCircle,
  FiCheckCircle,
  FiLock,
} from "react-icons/fi";

const AddTool = () => {
  const { isAdmin, login } = useAdmin();
  const navigate = useNavigate();

  // Admin login form states (if not logged in)
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Tool Form States
  const [toolName, setToolName] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Design & AI Tools");
  const [pricingType, setPricingType] = useState("Monthly Subscription");
  const [price, setPrice] = useState("");
  const [stockStatus, setStockStatus] = useState("In Stock");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("Instant");
  const [discount, setDiscount] = useState("0");
  const [rating, setRating] = useState("4.8");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sellerNotes, setSellerNotes] = useState("");

  // Submit states
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    if (!adminUsername || !adminPassword) {
      setLoginError("Credentials are required.");
      setLoginLoading(false);
      return;
    }

    const result = await login(adminUsername, adminPassword);
    setLoginLoading(false);
    if (!result.success) {
      setLoginError(result.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitLoading(true);

    // Validation
    if (
      !toolName ||
      !image ||
      !category ||
      !price ||
      !pricingType ||
      !description
    ) {
      setFormError(
        "Please fill in all required fields marked with an asterisk (*).",
      );
      setSubmitLoading(false);
      return;
    }

    const numericPrice = Number(price);
    const numericDiscount = Number(discount);
    const numericRating = Number(rating);

    if (isNaN(numericPrice) || numericPrice < 0) {
      setFormError("Price must be a valid positive number.");
      setSubmitLoading(false);
      return;
    }

    if (
      isNaN(numericDiscount) ||
      numericDiscount < 0 ||
      numericDiscount > 100
    ) {
      setFormError("Discount must be a percentage between 0 and 100.");
      setSubmitLoading(false);
      return;
    }

    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      setFormError("Rating must be a number between 1.0 and 5.0.");
      setSubmitLoading(false);
      return;
    }

    try {
      const payload = {
        toolName,
        image,
        category,
        price: numericPrice,
        pricingType,
        description,
        features, // will be split by newline in controller
        stockStatus,
        deliveryTime,
        sellerNotes,
        websiteUrl,
        rating: numericRating,
        discount: numericDiscount,
      };

      const res = await toolsService.create(payload);
      if (res.data.success) {
        setFormSuccess("Tool added to the marketplace successfully!");
        // Clear Form
        setToolName("");
        setImage("");
        setPrice("");
        setDescription("");
        setFeatures("");
        setWebsiteUrl("");
        setSellerNotes("");
        setDiscount("0");
        setRating("4.8");

        setTimeout(() => {
          navigate("/tools");
        }, 2000);
      } else {
        setFormError("Failed to save tool data.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setFormError(
        err.response?.data?.message ||
          "Error occurred while creating tool. Check admin authorization.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Render Login Panel if not logged in
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-brand-500/10 dark:bg-brand-500/20 text-brand-500 rounded-full mb-2">
            <FiLock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-850 dark:text-white">
            Admin Authentication Required
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You must be logged in as an administrator to list new digital
            products on VaultX.
          </p>
        </div>

        {loginError && (
          <div className="flex items-center gap-2 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-red-650 dark:text-red-400 text-xs">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form
          onSubmit={handleAdminLogin}
          className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-650 dark:text-slate-400 mb-2 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="e.g. mshahzaib"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-650 dark:text-slate-400 mb-2 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg transition-all text-sm"
          >
            {loginLoading ? "Logging in..." : "Sign In as Admin"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8">
      {/* Top breadcrumb action */}
      <Link
        to="/tools"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-500 transition-colors"
      >
        <FiArrowLeft />
        <span>Back to Tools</span>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
          List a New Tool
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Fill in the details to add a new tool to the marketplace.
        </p>
      </div>

      {/* Errors / Success alerts */}
      {formError && (
        <div className="flex items-center gap-2.5 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl text-red-650 dark:text-red-400 text-sm">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-450 text-sm">
          <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Form Content */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-glass dark:shadow-glass-dark"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Tool Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Tool Name *
            </label>
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="e.g. Semrush Pro"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
              required
            />
          </div>

          {/* Image URL */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Image URL *
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            >
              <option value="Design & AI Tools">Design & AI Tools</option>
              <option value="SEO Tools">SEO Tools</option>
              <option value="AI Tools">AI Tools</option>
              <option value="Writing Tools">Writing Tools</option>
              <option value="Streaming Services">Streaming Services</option>
            </select>
          </div>

          {/* Pricing Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Pricing Type *
            </label>
            <select
              value={pricingType}
              onChange={(e) => setPricingType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            >
              <option value="Monthly Subscription">Monthly Subscription</option>
              <option value="Subscription">Subscription</option>
              <option value="Fixed Price">Fixed Price</option>
            </select>
          </div>

          {/* Price (USD) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Price (USD) *
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="9.99"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
              required
            />
          </div>

          {/* Stock Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Stock Status *
            </label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Description *
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this tool does and its key benefits..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
              required
            ></textarea>
          </div>

          {/* Features */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Features (one per line)
            </label>
            <textarea
              rows="4"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Keyword Research&#10;Competitor Analysis&#10;Site Audit"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            ></textarea>
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Delivery Time
            </label>
            <input
              type="text"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              placeholder="Instant"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            />
          </div>

          {/* Discount Percentage */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Rating (1-5)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="4.8"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Official Website URL
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            />
          </div>

          {/* Seller Notes */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-2">
              Seller Notes
            </label>
            <textarea
              rows="3"
              value={sellerNotes}
              onChange={(e) => setSellerNotes(e.target.value)}
              placeholder="Any additional notes for buyers..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm dark:text-white"
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/50">
          <Link
            to="/tools"
            className="px-5 py-2.5 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitLoading}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-600/30 transition-all text-xs disabled:opacity-50"
          >
            <FiPlus />
            <span>
              {submitLoading ? "Saving..." : "Add Tool to Marketplace"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTool;
