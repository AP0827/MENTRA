"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Calendar,
  Filter
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data
const weeklyFocusData = [
  { day: "Mon", focus: 280, distracted: 45 },
  { day: "Tue", focus: 310, distracted: 30 },
  { day: "Wed", focus: 265, distracted: 55 },
  { day: "Thu", focus: 290, distracted: 40 },
  { day: "Fri", focus: 335, distracted: 25 },
  { day: "Sat", focus: 180, distracted: 20 },
  { day: "Sun", focus: 150, distracted: 15 },
];

const productivityTrend = [
  { date: "Week 1", score: 72 },
  { date: "Week 2", score: 75 },
  { date: "Week 3", score: 78 },
  { date: "Week 4", score: 82 },
  { date: "Week 5", score: 87 },
];

const websiteDistribution = [
  { name: "YouTube", value: 35, color: "#ef4444" },
  { name: "Twitter", value: 25, color: "#3b82f6" },
  { name: "Instagram", value: 20, color: "#ec4899" },
  { name: "Reddit", value: 15, color: "#f59e0b" },
  { name: "Others", value: 5, color: "#8b5cf6" },
];

const peakHours = [
  { hour: "6 AM", distractions: 2 },
  { hour: "8 AM", distractions: 5 },
  { hour: "10 AM", distractions: 8 },
  { hour: "12 PM", distractions: 12 },
  { hour: "2 PM", distractions: 7 },
  { hour: "4 PM", distractions: 10 },
  { hour: "6 PM", distractions: 15 },
  { hour: "8 PM", distractions: 9 },
  { hour: "10 PM", distractions: 6 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Analytics 📊
          </h1>
          <p className="mt-2 text-slate-600">
            Deep insights into your digital behavior
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 py-2 text-slate-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 transition-colors shadow-sm"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </motion.button>
          
          <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-white p-1 shadow-sm">
            {(["week", "month", "year"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  timeRange === range
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Focus Time", value: "32h 15m", icon: Clock, trend: "+12%" },
          { label: "Avg. Daily Focus", value: "4h 36m", icon: Target, trend: "+8%" },
          { label: "Productivity Score", value: "87%", icon: TrendingUp, trend: "+5%" },
          { label: "Active Days", value: "7/7", icon: Calendar, trend: "Perfect!" },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            className="rounded-xl border border-sky-200/50 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg bg-gradient-to-br from-sky-500/10 to-emerald-500/10 p-3">
                <metric.icon className="h-5 w-5 text-sky-600" />
              </div>
              <span className="text-sm font-medium text-emerald-500">{metric.trend}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
            <p className="text-sm text-slate-600 mt-1">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus vs Distracted Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-2xl border border-sky-200/50 bg-white p-6 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Weekly Focus Overview
            </h3>
            <p className="text-sm text-slate-600">
              Focus time vs distracted time (minutes)
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyFocusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="focus" fill="#0ea5e9" radius={[8, 8, 0, 0]} name="Focus Time" />
              <Bar dataKey="distracted" fill="#10b981" radius={[8, 8, 0, 0]} name="Distracted Time" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Productivity Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="rounded-2xl border border-sky-200/50 bg-white p-6 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Productivity Trend
            </h3>
            <p className="text-sm text-slate-600">
              Your improvement over the past 5 weeks
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={productivityTrend}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#0ea5e9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
                name="Score %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Website Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="rounded-2xl border border-sky-200/50 bg-white p-6 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Website Distribution
            </h3>
            <p className="text-sm text-slate-600">
              Where your distractions come from
            </p>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={websiteDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {websiteDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {websiteDistribution.map((site, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: site.color }}
                />
                <span className="text-sm text-slate-900">
                  {site.name} ({site.value}%)
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Peak Distraction Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="rounded-2xl border border-sky-200/50 bg-white p-6 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Peak Distraction Hours
            </h3>
            <p className="text-sm text-slate-600">
              When you're most likely to get distracted
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="distractions" fill="#10b981" radius={[8, 8, 0, 0]} name="Distractions" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9 }}
        className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-emerald-50 p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 p-3">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Weekly Summary
            </h3>
            <p className="text-slate-900 leading-relaxed">
              Great progress this week! Your focus time increased by <strong>18%</strong> compared to last week. 
              You're most productive in the afternoon (2-4 PM), and your biggest distraction source is YouTube. 
              Consider scheduling deep work during your peak hours and setting stricter limits on video content.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
