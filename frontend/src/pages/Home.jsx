import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toolsService } from "../services/api";
import ToolCard from "../components/ToolCard";
import {
  FiSearch,
  FiArrowRight,
  FiZap,
  FiLock,
  FiAward,
  FiMessageSquare,
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiStar,
} from "react-icons/fi";

const Home = () => {
  const [searchVal, setSearchVal] = useState("");
  const [latestTools, setLatestTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How does the digital tools marketplace work?",
      a: "We purchase agency/premium plans of popular software in bulk or team workspaces and share access at a fraction of the original cost. After payment, you receive access credentials, custom extension access, or workspace invites.",
    },
    {
      q: "Are these accounts private or shared?",
      a: "Depending on the tool, we offer both private profile slots (e.g., Netflix profile with custom PIN, Canva Team seats) and shared premium logins. Each tool details page specifies the workspace type.",
    },
    {
      q: "What is the delivery time after purchase?",
      a: "Most purchases are delivered instantly. For complex team workspace invitations (e.g., Adobe Creative Cloud), credentials are sent via WhatsApp or email within 1-2 hours.",
    },
    {
      q: "Do you offer a replacement guarantee?",
      a: "Yes! All premium tool accounts include a full warranty matching your subscription duration. If any account encounters issues, contact our 24/7 WhatsApp support for an instant replacement.",
    },
    {
      q: "How do I make a payment?",
      a: "When you click 'Buy Now', you'll be redirected to our WhatsApp line with a pre-filled message indicating your chosen tool. We accept local bank transfers, Easypaisa, JazzCash, and major credit cards.",
    },
  ];

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await toolsService.getLatest();
        if (res.data.success) {
          setLatestTools(res.data.tools);
        }
      } catch (err) {
        console.error("Error fetching latest tools:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/tools?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="space-y-24 pb-16 transition-colors duration-300">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-transparent dark:from-brand-950/20 dark:via-slate-950 dark:to-transparent">
        {/* Abstract blur background blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-400 text-xs font-semibold rounded-full animate-float">
            <span>🎉 Premium Accounts & Subs Starting from $0.75</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans leading-tight text-slate-900 dark:text-white max-w-4xl mx-auto tracking-tight">
            Get Premium Tools <br />
            <span className="bg-gradient-to-r from-brand-500 to-purple-500 dark:from-brand-400 dark:to-purple-400 bg-clip-text text-transparent">
              At Unreal Prices
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Access premium SEO software, streaming services, design assets, and
            AI assistants. Fully verified accounts, instant delivery, 100%
            replacement guarantee.
          </p>

          {/* Search box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto flex items-center p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl focus-within:ring-2 focus-within:ring-brand-500 transition-all"
          >
            <div className="flex-1 flex items-center pl-2 text-slate-400 dark:text-slate-500">
              <FiSearch className="w-5 h-5 mr-2.5" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search tools like Canva, Semrush, Netflix..."
                className="w-full bg-transparent focus:outline-none text-slate-800 dark:text-white text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
            >
              Search
            </button>
          </form>

          {/* CTAs */}
          <div className="flex justify-center items-center gap-4 pt-2">
            <Link
              to="/tools"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-600/30 transition-all text-sm flex items-center gap-1.5"
            >
              Browse Tools
              <FiArrowRight />
            </Link>
            <Link
              to="#services"
              className="px-6 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 font-semibold rounded-xl transition-all text-sm"
            >
              Our Services
            </Link>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto border-t border-slate-200/50 dark:border-slate-800/50">
            <div>
              <p className="text-3xl font-black text-slate-800 dark:text-white">
                12+
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                Active Tools
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800 dark:text-white">
                5
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                Categories
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800 dark:text-white">
                5,120+
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                Active Users
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800 dark:text-white flex justify-center items-center gap-1">
                4.8 <FiStar className="w-5 h-5 fill-current text-amber-500" />
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                Avg Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Section (Why Choose Us) */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">
            Our Services
          </span>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            The Smartest Way to Access Premium Software % Tools
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            We bridge the gap between premium tools and affordable rates,
            offering verified premium account subscriptions with instant setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 w-fit rounded-xl">
              <FiZap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-850 dark:text-white">
              Fast Delivery
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No waiting periods. Login details, license keys, or group
              workspace invitations are processed and dispatched instantly.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 w-fit rounded-xl">
              <FiLock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-850 dark:text-white">
              Secure Payment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Safe transaction processing via local direct banking, mobile
              wallets (Easypaisa/JazzCash), and encrypted payment corridors.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-500 w-fit rounded-xl">
              <FiAward className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-850 dark:text-white">
              Premium Accounts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              100% active, legitimate premium subscriptions. Fully verified
              profiles with zero server-side disruptions or downtime.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 w-fit rounded-xl">
              <FiMessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-850 dark:text-white">
              24/7 Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dedicated customer help desk via WhatsApp for technical setups,
              troubleshooting, or instant replacements if needed.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-500 w-fit rounded-xl">
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-850 dark:text-white">
              Affordable Pricing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Unlock professional tools without breaking the bank. Save up to
              90% off standard commercial enterprise pricing levels.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">
            Categories
          </span>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            Browse by Category
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Choose from our curated collection of digital assets, design
            helpers, SEO suites, and media subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* SEO Tools Card */}
          <Link
            to="/tools?category=SEO Tools"
            className="group relative p-8 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="inline-flex p-4 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl text-emerald-500 mb-6">
              <FiTrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">
              SEO Tools
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Dominate search rankings with professional keyword research,
              backlink audits, site crawling, and competitor metrics.
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Browse category</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Streaming Services Card */}
          <Link
            to="/tools?category=Streaming Services"
            className="group relative p-8 bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900 rounded-3xl border border-rose-100 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors"></div>
            <div className="inline-flex p-4 bg-rose-500/10 dark:bg-rose-500/20 rounded-2xl text-rose-500 mb-6">
              <FiZap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">
              Streaming Services
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Access your favorite movies, TV channels, documentaries, and music
              premium accounts in crystal clear 4K resolutions.
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm font-semibold text-rose-600 dark:text-rose-400">
              <span>Browse category</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Design & AI Tools Card */}
          <Link
            to="/tools?category=Design & AI Tools"
            className="group relative p-8 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors"></div>
            <div className="inline-flex p-4 bg-purple-500/10 dark:bg-purple-500/20 rounded-2xl text-purple-500 mb-6">
              <FiAward className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">
              Design & AI Tools
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Unleash your creativity with Photoshop access, vector suites,
              premium design stock assets, and AI image engines.
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm font-semibold text-purple-600 dark:text-purple-400">
              <span>Browse category</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Latest Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-3">
            <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">
              Latest Releases
            </span>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              Freshly Added
            </h2>
          </div>
          <Link
            to="/tools"
            className="flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors border border-brand-500/25 px-4 py-2 rounded-xl hover:bg-brand-50/50 dark:hover:bg-brand-950/20"
          >
            <span>See All Tools</span>
            <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          /* Skeleton Loading State */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4"
              >
                <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl shimmer"></div>
                <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
                <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
                <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
                  <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : latestTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestTools.map((tool) => (
              <ToolCard key={tool._id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-250/20">
            <p className="text-slate-400 dark:text-slate-500 font-medium">
              No tools found in the database. Add some new tools.
            </p>
          </div>
        )}
      </section>

      {/* 5. Loved by Thousands (Testimonials) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            Loved by Thousands
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Read what our active subscribers have to say about account
            reliability and our instant support desk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="fill-current text-amber-500 w-4 h-4"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "Super happy with Moz and Semrush! Login credentials were sent
                within minutes, and the access extension works seamlessly.
                Highly recommend!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <div className="w-8 h-8 bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                  Arsalan Khan
                </h4>
                <p className="text-[10px] text-slate-400">SEO Specialist</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="fill-current text-amber-500 w-4 h-4"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "I was skeptical about buying Adobe CC at this rate, but I was
                added to their team workspace. Everything works exactly as if I
                bought it direct."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <div className="w-8 h-8 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold text-xs">
                S
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                  Sana Bilal
                </h4>
                <p className="text-[10px] text-slate-400">Graphic Designer</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="fill-current text-amber-500 w-4 h-4"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "Fast, reliable service. My Netflix PIN-locked profile was set
                up instantly. Excellent spatial sound and 4K quality. Will renew
                next month!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <div className="w-8 h-8 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold text-xs">
                N
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                  Noman Riaz
                </h4>
                <p className="text-[10px] text-slate-400">UI/UX Designer</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="fill-current text-amber-500 w-4 h-4"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "Outstanding customer support. Had an issue with Midjourney
                access late at night, and they responded via WhatsApp and
                replaced the credentials in 5 minutes."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <div className="w-8 h-8 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-xs">
                K
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                  Kamran Ali
                </h4>
                <p className="text-[10px] text-slate-400">DevOps Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Newsletter Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="relative p-8 sm:p-12 bg-gradient-to-tr from-brand-600 to-purple-500 rounded-3xl text-white shadow-xl shadow-brand-500/10 overflow-hidden text-center space-y-6">
          {/* Glass design effects */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

          <div className="inline-flex p-3 bg-white/10 rounded-full text-white mb-2">
            <FiMail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Get Exclusive Deals
          </h2>
          <p className="text-sm text-brand-100 max-w-md mx-auto leading-relaxed">
            Subscribe to our weekly newsletter to receive coupon codes, flash
            discounts, and instant updates on newly added subscription accounts.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3 pt-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-brand-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-brand-50 text-brand-600 font-bold rounded-xl transition-all shadow-md text-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          {subscribed && (
            <p className="text-xs text-brand-100 font-semibold animate-pulse pt-2">
              🎉 Thank you! You have successfully subscribed to VaultX news.
              Check your inbox soon!
            </p>
          )}
        </div>
      </section>

      {/* 7. FAQ Section (Accordion) */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Find quick answers to common queries regarding account credentials,
            support, and billing details.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full p-5 flex items-center justify-between text-left font-bold text-slate-850 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm sm:text-base"
              >
                <span>{faq.q}</span>
                {openFaq === i ? (
                  <FiChevronUp className="w-5 h-5 text-brand-500" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {openFaq === i && (
                <div className="p-5 pt-0 text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/30">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
