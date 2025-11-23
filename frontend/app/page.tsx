"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import ReflectionCard from "@/components/ReflectionCard";
import { getUserId, getStats, getReflections } from "@/lib/api";
import extensionBridge from "@/lib/extension-bridge";
import { 
  Clock, 
  Target, 
  Zap, 
  TrendingUp,
  Calendar,
  Award,
  Activity
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    focusTime: 0,
    distractions: 0,
    streak: 0,
    productivity: 0,
  });
  const [recentReflections, setRecentReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Try to get data from extension first (IndexedDB)
      const extensionReflections = await extensionBridge.getReflections(50);
      const extensionStats = await extensionBridge.getStats();
      
      // If extension data available, use it
      if (extensionReflections.length > 0) {
        setRecentReflections(extensionReflections.slice(0, 3));
      }
      
      if (extensionStats) {
        setStats(extensionStats);
      }
      
      // Also fetch from backend API for sync
      const userId = await getUserId();
      const [statsData, reflectionsData] = await Promise.all([
        getStats(userId),
        getReflections(userId)
      ]);
      
      // Merge data - prefer extension data if available, fallback to API
      setStats(extensionStats || statsData);
      setRecentReflections(
        extensionReflections.length > 0 
          ? extensionReflections.slice(0, 3) 
          : reflectionsData.slice(0, 3)
      );
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  }

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Welcome back! 👋
            </h1>
            <p className="mt-2 text-slate-600">
              Here's your focus summary for today
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-6 py-3 text-white shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">
                {new Date().toLocaleDateString("en-US", { 
                  weekday: "long", 
                  month: "short", 
                  day: "numeric" 
                })}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Focus Time"
          value={loading ? "..." : formatFocusTime(stats.focusTime)}
          change={stats.focusTime > 0 ? "Keep up the great work!" : "Start your focus journey"}
          icon={Clock}
          trend={stats.focusTime > 0 ? "up" : "neutral"}
          delay={0.1}
        />
        <StatCard
          title="Distractions Avoided"
          value={loading ? "..." : stats.distractions}
          change={stats.distractions > 0 ? `${stats.distractions} moment${stats.distractions === 1 ? '' : 's'} of awareness` : "No distractions yet"}
          icon={Target}
          trend={stats.distractions > 0 ? "up" : "neutral"}
          delay={0.2}
        />
        <StatCard
          title="Current Streak"
          value={loading ? "..." : `${stats.streak} day${stats.streak === 1 ? '' : 's'}`}
          change={stats.streak > 0 ? "Keep it going!" : "Start your streak today"}
          icon={Award}
          trend={stats.streak > 0 ? "up" : "neutral"}
          delay={0.3}
        />
        <StatCard
          title="Productivity Score"
          value={loading ? "..." : `${stats.productivity}%`}
          change={stats.productivity > 0 ? "On track" : "Begin tracking"}
          icon={TrendingUp}
          trend={stats.productivity > 0 ? "up" : "neutral"}
          delay={0.4}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-2xl border border-sky-200/50 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Today's Focus Activity
              </h3>
              <p className="text-sm text-slate-600">
                Your focus intervals throughout the day
              </p>
            </div>
            <Activity className="h-5 w-5 text-sky-600" />
          </div>
          
          {/* Activity visualization */}
          <div className="space-y-3">
            {stats.focusTime > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Total Focus Time</span>
                  <span className="font-medium text-slate-900">
                    {formatFocusTime(stats.focusTime)}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Start tracking your focus sessions</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="rounded-2xl border border-sky-200/50 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Quick Insights
              </h3>
              <p className="text-sm text-slate-600">
                AI-powered recommendations
              </p>
            </div>
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>

          <div className="space-y-4">
            {recentReflections.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-sky-50 to-emerald-50 hover:from-sky-100 hover:to-emerald-100 transition-colors cursor-pointer border border-sky-100"
                >
                  <span className="text-2xl">📊</span>
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Total Reflections
                    </h4>
                    <p className="text-sm text-slate-600">
                      You've reflected {recentReflections.length} time{recentReflections.length === 1 ? '' : 's'} recently
                    </p>
                  </div>
                </motion.div>
                {stats.streak > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-sky-50 to-emerald-50 hover:from-sky-100 hover:to-emerald-100 transition-colors cursor-pointer border border-sky-100"
                  >
                    <span className="text-2xl">🔥</span>
                    <div>
                      <h4 className="font-medium text-slate-900">
                        Streak Active
                      </h4>
                      <p className="text-sm text-slate-600">
                        {stats.streak} day{stats.streak === 1 ? '' : 's'} of mindful awareness
                      </p>
                    </div>
                  </motion.div>
                )}
                {stats.distractions > 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-sky-50 to-emerald-50 hover:from-sky-100 hover:to-emerald-100 transition-colors cursor-pointer border border-sky-100"
                  >
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="font-medium text-slate-900">
                        Great Progress
                      </h4>
                      <p className="text-sm text-slate-600">
                        You're building strong awareness habits
                      </p>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Zap className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Insights will appear as you use Mentra</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Reflections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Recent Reflections
            </h2>
            <p className="text-slate-600">
              Your latest interactions with Mentra
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-600 hover:to-emerald-600 transition-colors font-medium shadow-sm"
          >
            View All
          </motion.button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center py-8 text-slate-600">
              Loading reflections...
            </div>
          ) : recentReflections.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              No reflections yet. Start using the extension to track your digital wellness journey!
            </div>
          ) : (
            recentReflections.map((reflection, i) => (
              <ReflectionCard
              key={reflection.id || i}
              {...reflection}
              timestamp={new Date(reflection.createdAt || reflection.timestamp)}
              delay={0.8 + i * 0.1}
            />
          )))}
        </div>
      </motion.div>
    </div>
  );
}
