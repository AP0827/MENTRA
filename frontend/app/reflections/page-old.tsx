"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ReflectionCard from "@/components/ReflectionCard";
import { 
  Search, 
  Filter, 
  Download,
  MessageSquare,
  Calendar,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

// Mock data - expand with more reflections
const allReflections = [
  {
    website: "YouTube",
    reflection: "I wanted to watch a quick tutorial on React hooks, but got distracted by recommended videos.",
    aiResponse: "It's great that you're learning! Consider bookmarking the tutorial and setting a specific time block for learning. This way, you can stay focused without the temptation of recommendations.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    helpful: true,
    tags: ["learning", "programming"],
  },
  {
    website: "Twitter",
    reflection: "Just checking notifications quickly before starting work.",
    aiResponse: "Quick checks often turn into longer sessions. Try batching your social media time into dedicated breaks. Your morning focus is precious - protect it!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    helpful: true,
    tags: ["social-media", "morning"],
  },
  {
    website: "Instagram",
    reflection: "Feeling stressed, need a mental break.",
    aiResponse: "Stress is real, and breaks are important. Consider a 5-minute mindfulness exercise or a short walk instead. These alternatives often provide better restoration than scrolling.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    helpful: false,
    tags: ["stress", "break"],
  },
  {
    website: "Reddit",
    reflection: "Looking for solutions to a coding problem.",
    aiResponse: "Technical problem-solving is valuable! Set a 15-minute timer for your search. If you haven't found a solution by then, try Stack Overflow or official documentation instead.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    helpful: true,
    tags: ["programming", "problem-solving"],
  },
  {
    website: "YouTube",
    reflection: "Watching gaming videos to relax after lunch.",
    aiResponse: "Post-lunch relaxation is important, but consider whether passive video watching truly refreshes you. A short walk or stretching might provide better energy for the afternoon.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    helpful: true,
    tags: ["entertainment", "lunch-break"],
  },
  {
    website: "Twitter",
    reflection: "Checking what's trending right now.",
    aiResponse: "Staying informed is good, but trending topics can wait. Your current task deserves your full attention. Consider scheduling a specific time for news and trends.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    helpful: true,
    tags: ["news", "social-media"],
  },
  {
    website: "Instagram",
    reflection: "Just scrolling mindlessly.",
    aiResponse: "Thanks for being honest! Mindless scrolling rarely satisfies us. What if you took 5 deep breaths instead? Your mind might be asking for a different kind of rest.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    helpful: false,
    tags: ["mindless", "boredom"],
  },
  {
    website: "YouTube",
    reflection: "Looking for music to work with.",
    aiResponse: "Background music can help! Consider creating a dedicated playlist beforehand. This way, you can start working immediately without the distraction of choosing songs.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    helpful: true,
    tags: ["music", "productivity"],
  },
];

export default function Reflections() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "helpful" | "not-helpful">("all");

  const filteredReflections = allReflections.filter((reflection) => {
    const matchesSearch =
      reflection.reflection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reflection.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reflection.aiResponse.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "helpful" && reflection.helpful === true) ||
      (filterBy === "not-helpful" && reflection.helpful === false);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: allReflections.length,
    helpful: allReflections.filter((r) => r.helpful === true).length,
    notHelpful: allReflections.filter((r) => r.helpful === false).length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[hsl(var(--foreground))]">
              Reflections 💭
            </h1>
            <p className="mt-2 text-[hsl(var(--muted-foreground))]">
              Your journey of self-awareness and growth
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-white shadow-lg"
          >
            <Download className="h-4 w-4" />
            <span className="font-medium">Export Data</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Reflections</p>
                <p className="text-3xl font-bold text-[hsl(var(--foreground))] mt-1">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Helpful Responses</p>
                <p className="text-3xl font-bold text-[hsl(var(--foreground))] mt-1">{stats.helpful}</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Needs Improvement</p>
                <p className="text-3xl font-bold text-[hsl(var(--foreground))] mt-1">{stats.notHelpful}</p>
              </div>
              <ThumbsDown className="h-8 w-8 text-orange-500" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Search reflections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1">
          <Filter className="h-4 w-4 ml-2 text-[hsl(var(--muted-foreground))]" />
          {(["all", "helpful", "not-helpful"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterBy(filter)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                filterBy === filter
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              {filter === "all" ? "All" : filter === "helpful" ? "Helpful" : "Not Helpful"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-[hsl(var(--muted-foreground))]"
      >
        Showing {filteredReflections.length} of {allReflections.length} reflections
      </motion.p>

      {/* Reflections List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReflections.length > 0 ? (
          filteredReflections.map((reflection, i) => (
            <ReflectionCard
              key={i}
              {...reflection}
              delay={0.6 + i * 0.05}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-12 text-center"
          >
            <MessageSquare className="h-12 w-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
              No reflections found
            </h3>
            <p className="text-[hsl(var(--muted-foreground))]">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>

      {/* Pagination (placeholder) */}
      {filteredReflections.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 pt-4"
        >
          <button className="px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            1
          </button>
          <button className="px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors">
            2
          </button>
          <button className="px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors">
            Next
          </button>
        </motion.div>
      )}
    </div>
  );
}
