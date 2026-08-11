import React from "react";
import { Link } from "react-router-dom";
import { FiStar, FiZap, FiArrowRight } from "react-icons/fi";

export const getCategoryStyles = (category) => {
  const cat = String(category).toLowerCase();
  if (cat.includes("design") || cat.includes("creative")) {
    return "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30";
  }
  if (cat.includes("seo") || cat.includes("marketing")) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30";
  }
  if (cat.includes("ai") && !cat.includes("design")) {
    return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30";
  }
  if (cat.includes("writing") || cat.includes("grammarly")) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30";
  }
  if (cat.includes("streaming") || cat.includes("netflix")) {
    return "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/30";
  }
  return "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50";
};

const ToolCard = ({ tool }) => {
  const {
    _id,
    toolName,
    image,
    category,
    price,
    discount,
    rating,
    deliveryTime,
    description,
    pricingType,
  } = tool;

  // Calculate original price based on discount
  const originalPrice =
    discount > 0 ? (price / (1 - discount / 100)).toFixed(2) : null;

  return (
    <>
      <Link to={`/tools/${_id}`}>
        <div className="glass-card relative flex flex-col justify-between h-[420px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-glass dark:shadow-glass-dark">
          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm">
              -{discount}%
            </span>
          )}

          {/* Image and Icon area */}
          <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden border-b border-slate-200 dark:border-slate-800">
            <img
              src={image}
              alt={toolName}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            {/* Soft decorative background glow under image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            {/* Pricing Type Badge */}
            {pricingType && (
              <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-white/90 dark:bg-slate-900/90 text-[10px] font-semibold text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-800">
                {pricingType.includes("Subscription") ? "Monthly" : "Lifetime"}
              </span>
            )}
          </div>

          {/* Content Details */}
          <div className="flex-1 flex flex-col p-4">
            {/* Category */}
            <div className="mb-2">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryStyles(category)}`}
              >
                {category}
              </span>
            </div>

            {/* Tool Name */}
            <h3 className="text-base font-bold text-slate-800 dark:text-white truncate mb-1">
              {toolName}
            </h3>

            {/* Short Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3 flex-grow">
              {description}
            </p>

            {/* Rating and Delivery speed */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pt-2 border-t border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-1 font-semibold text-amber-500">
                <FiStar className="fill-current text-amber-500" />
                <span>{rating ? rating.toFixed(1) : "5.0"}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiZap className="text-brand-500" />
                <span>{deliveryTime || "Instant"}</span>
              </div>
            </div>

            {/* Price and Action View Link */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    ${price.toFixed(2)}
                  </span>
                  {originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ${originalPrice}
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-slate-400">
                  {pricingType}
                </span>
              </div>

              <span className="flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
                <span>View</span>
                <FiArrowRight />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ToolCard;
