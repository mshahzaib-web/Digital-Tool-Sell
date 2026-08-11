import { Link } from "react-router-dom";
import { FiTwitter, FiGithub, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About Section */}
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-purple-500 text-white">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <span className="text-lg font-bold font-sans tracking-tight text-slate-900 dark:text-white">
                VaultX
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              The premium marketplace for digital tools, software subscriptions,
              and creative assets. Instant delivery, verified accounts.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                to="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-brand-500 transition-all"
              >
                <FiTwitter className="w-4 h-4" />
              </Link>
              <Link
                to="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-brand-500 transition-all"
              >
                <FiGithub className="w-4 h-4" />
              </Link>
              <Link
                to="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-brand-500 transition-all"
              >
                <FiLinkedin className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/tools"
                  className="text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
                >
                  All Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/tools?category=SEO Tools"
                  className="text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
                >
                  SEO Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/tools?category=Design & AI Tools"
                  className="text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
                >
                  Design Assets
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="#terms"
                  className="text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="#privacy"
                  className="text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#refund"
                  className="text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#support"
                  className="text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-slate-200 dark:border-slate-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© 2026 VaultX Digital Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="cursor-pointer hover:text-brand-500">English</span>
            <span className="cursor-pointer hover:text-brand-500">USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
