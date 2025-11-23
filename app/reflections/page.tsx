"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ReflectionCard from "@/components/ReflectionCard";
import extensionBridge from "@/lib/extension-bridge";
import { getUserId, getReflections } from "@/lib/api";
import { 
  Search, 
  Filter, 
  Download,
  MessageSquare,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Zap
} from "lucide-react";

interface Reflection {
  id?: number;
  userId?: string;
  website: string;
  domain?: string;
  url?: string;
  reflection: string;
  prompt?: string;
  quickResponse?: string | null;
  freeText?: string | null;
  aiResponse?: string;
  timestamp: number;
  createdAt?: string;
  helpful?: boolean | null;
  tags?: string[];
}

export default function Reflections() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "helpful" | "not-helpful">("all");
  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [allReflections, setAllReflections] = useState<Reflection[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuickOnly, setShowQuickOnly] = useState(false);

  useEffect(() => {
    loadReflections();
  }, []);

  async function loadReflections() {
    try {
      // Try extension IndexedDB first
      const extensionReflections = await extensionBridge.getReflections(200);
      
      // Also get from API
      const userId = await getUserId();
      const apiReflections = await getReflections(userId);
      
      // Combine and deduplicate
      const combined: Reflection[] = [
        ...extensionReflections.map((r: any) => ({
          ...r,
          website: r.website || r.domain || 'Unknown',
          reflection: r.freeText || r.quickResponse || r.reflection || '',
          timestamp: r.timestamp || Date.now()
        })),
        ...apiReflections.map((r: any) => ({
          ...r,
          website: r.website || 'Unknown',
          reflection: r.reflection || '',
          timestamp: r.createdAt ? new Date(r.createdAt).getTime() : Date.now()
        }))
      ];

      // Sort by timestamp descending
      combined.sort((a, b) => b.timestamp - a.timestamp);
      
      // Extract unique domains
      const uniqueDomains = Array.from(
        new Set(
          combined
            .map(r => r.domain || (r.website ? new URL(r.website).hostname.replace('www.', '') : ''))
            .filter(Boolean)
        )
      );
      
      setAllReflections(combined);
      setDomains(uniqueDomains);
      setLoading(false);
    } catch (error) {
      console.error('Error loading reflections:', error);
      setLoading(false);
    }
  }

  const filteredReflections = allReflections.filter((reflection) => {
    // Search filter
    const matchesSearch =
      reflection.reflection?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reflection.website?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reflection.aiResponse?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reflection.quickResponse?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Helpful filter
    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "helpful" && reflection.helpful === true) ||
      (filterBy === "not-helpful" && reflection.helpful === false);

    // Domain filter
    const matchesDomain = 
      filterDomain === "all" ||
      reflection.domain === filterDomain ||
      reflection.website?.includes(filterDomain);

    // Quick response filter
    const matchesQuickOnly = 
      !showQuickOnly || reflection.quickResponse;

    return matchesSearch && matchesFilter && matchesDomain && matchesQuickOnly;
  });

  const stats = {
    total: allReflections.length,
    helpful: allReflections.filter(r => r.helpful === true).length,
    quickResponses: allReflections.filter(r => r.quickResponse).length,
    thisWeek: allReflections.filter(r => {
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return r.timestamp > weekAgo;
    }).length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900">
          Reflection History 📝
        </h1>
        <p className="mt-2 text-slate-600">
          Review your mindful moments and digital wellness journey
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-sky-200/50 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-sky-600" />
            <span className="text-sm font-medium text-slate-600">
              Total Reflections
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.total}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-sky-200/50 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-slate-600">
              Helpful Insights
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.helpful}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-sky-200/50 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-slate-600">
              Quick Responses
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.quickResponses}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-sky-200/50 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-sky-600" />
            <span className="text-sm font-medium text-slate-600">
              This Week
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.thisWeek}
          </p>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search reflections, websites, or responses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-sky-200 
                     bg-white text-slate-900 placeholder:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
          />
        </div>

        {/* Helpful Filter */}
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as any)}
          className="px-4 py-3 rounded-xl border border-sky-200 
                   bg-white text-slate-900
                   focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-sm"
        >
          <option value="all">All Feedback</option>
          <option value="helpful">Helpful Only</option>
          <option value="not-helpful">Not Helpful</option>
        </select>

        {/* Domain Filter */}
        <select
          value={filterDomain}
          onChange={(e) => setFilterDomain(e.target.value)}
          className="px-4 py-3 rounded-xl border border-sky-200 
                   bg-white text-slate-900
                   focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-sm"
        >
          <option value="all">All Domains</option>
          {domains.map(domain => (
            <option key={domain} value={domain}>{domain}</option>
          ))}
        </select>

        {/* Quick Response Toggle */}
        <button
          onClick={() => setShowQuickOnly(!showQuickOnly)}
          className={`px-4 py-3 rounded-xl border transition-all font-medium shadow-sm
            ${showQuickOnly 
              ? 'border-sky-500 bg-sky-500/10 text-sky-600' 
              : 'border-sky-200 bg-white text-slate-700'
            }`}
        >
          <Zap className="inline h-4 w-4 mr-2" />
          Quick Only
        </button>

        {/* Export */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r 
                   from-sky-500 to-emerald-500 text-white font-medium shadow-sm"
        >
          <Download className="h-5 w-5" />
          Export
        </motion.button>
      </motion.div>

      {/* Results Count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-slate-600"
      >
        Showing {filteredReflections.length} of {allReflections.length} reflections
      </motion.p>

      {/* Reflections List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4"></div>
            <p>Loading your reflections...</p>
          </div>
        ) : filteredReflections.length === 0 ? (
          <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No reflections found</p>
            <p className="text-sm">
              {searchQuery || filterBy !== "all" || filterDomain !== "all" || showQuickOnly
                ? "Try adjusting your filters"
                : "Start using the extension to track your digital wellness journey!"}
            </p>
          </div>
        ) : (
          filteredReflections.map((reflection, i) => (
            <ReflectionCard
              key={reflection.id || i}
              {...reflection}
              timestamp={new Date(reflection.timestamp)}
              delay={0.7 + (i * 0.05)}
            />
          ))
        )}
      </div>
    </div>
  );
}
