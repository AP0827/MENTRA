"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Brain,
  TrendingUp,
  Moon,
  Sun
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/reflections", icon: MessageSquare, label: "Reflections" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // You can add theme persistence logic here
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 border-r border-sky-200/50 bg-white p-6 flex flex-col shadow-sm"
    >
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="gradient-primary rounded-xl p-2 shadow-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
            Mentra
          </h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Mindful Focus</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                    : "text-slate-600 hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle & Stats */}
      <div className="space-y-3">
        <div className="rounded-lg bg-gradient-to-br from-sky-50 to-emerald-50 p-4 border border-sky-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Today's Focus</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">87%</div>
          <div className="mt-2 h-2 bg-white/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "87%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full gradient-primary"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-50 to-emerald-50 px-4 py-3 text-slate-700 hover:from-sky-100 hover:to-emerald-100 transition-colors border border-sky-100"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="text-sm font-medium">
            {isDark ? "Light" : "Dark"} Mode
          </span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
