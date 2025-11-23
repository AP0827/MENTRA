"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReflectionPopup from "@/components/ReflectionPopup";
import { Eye } from "lucide-react";

export default function PopupDemo() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState("YouTube");

  const websites = [
    "YouTube",
    "Twitter",
    "Instagram",
    "Reddit",
    "Facebook",
    "TikTok",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-6"
      >
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-[hsl(var(--foreground))]">
            Reflection Popup Demo 🎭
          </h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            This is what users see when they try to visit a distracting website
          </p>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-3">
              Select a website to test:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {websites.map((site) => (
                <motion.button
                  key={site}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedWebsite(site)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                    selectedWebsite === site
                      ? "border-purple-600 bg-purple-500/10 text-purple-600"
                      : "border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                  }`}
                >
                  {site}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsPopupOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg"
          >
            <Eye className="h-5 w-5" />
            Show Reflection Popup for {selectedWebsite}
          </motion.button>

          <div className="rounded-lg bg-[hsl(var(--muted))] p-4">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              <strong>Note:</strong> In the actual browser extension, this popup will automatically 
              appear when users navigate to monitored websites. They'll need to reflect on their 
              intention before proceeding.
            </p>
          </div>
        </div>
      </motion.div>

      <ReflectionPopup
        website={selectedWebsite}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
}
