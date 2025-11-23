"use client";

import { motion } from "framer-motion";
import { Clock, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface ReflectionCardProps {
  website: string;
  reflection: string;
  quickResponse?: string | null;
  freeText?: string | null;
  aiResponse?: string;
  timestamp: Date;
  helpful?: boolean;
  delay?: number;
}

export default function ReflectionCard({
  website,
  reflection,
  quickResponse,
  freeText,
  aiResponse,
  timestamp,
  helpful,
  delay = 0,
}: ReflectionCardProps) {
  const displayReflection = freeText || quickResponse || reflection;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl border border-sky-200/50 bg-white p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {website.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{website}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Clock className="h-3 w-3" />
              {format(timestamp, "MMM d, h:mm a")}
            </div>
          </div>
        </div>
        {helpful !== undefined && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`rounded-lg p-2 transition-colors ${
                helpful
                  ? "bg-green-500/10 text-green-500"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`rounded-lg p-2 transition-colors ${
                helpful === false
                  ? "bg-red-500/10 text-red-500"
                  : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
              }`}
            >
              <ThumbsDown className="h-4 w-4" />
            </motion.button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-medium text-slate-600">
              Your Reflection
            </p>
            {quickResponse && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 font-medium">
                ⚡ Quick Response
              </span>
            )}
          </div>
          <p className="text-sm text-slate-900 leading-relaxed">
            {displayReflection}
          </p>
          {quickResponse && freeText && (
            <p className="text-xs text-slate-600 mt-2 italic">
              Extended: {freeText}
            </p>
          )}
        </div>

        {aiResponse && (
          <div className="rounded-lg bg-[hsl(var(--muted))] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <p className="text-xs font-medium text-[hsl(var(--foreground))]">
                AI Suggestion
              </p>
            </div>
            <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed">
              {aiResponse}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
