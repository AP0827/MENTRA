"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = "neutral",
  delay = 0 
}: StatCardProps) {
  const getTrendColor = () => {
    if (trend === "up") return "text-green-500";
    if (trend === "down") return "text-red-500";
    return "text-[hsl(var(--muted-foreground))]";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl border border-sky-200/50 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
    >
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100 to-emerald-100 opacity-60 blur-3xl" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {value}
            </p>
            {change && (
              <p className={`mt-2 text-sm font-medium ${getTrendColor()}`}>
                {change}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-gradient-to-br from-sky-500/10 to-emerald-500/10 p-3">
            <Icon className="h-6 w-6 text-sky-600" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
