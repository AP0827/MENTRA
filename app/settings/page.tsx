"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getUserId, getSettings, updateSettings } from "@/lib/api";
import {
  Settings as SettingsIcon,
  Globe,
  Brain,
  Shield,
  Database,
  Bell,
  Palette,
  Plus,
  X,
  Save,
  AlertCircle,
} from "lucide-react";

export default function Settings() {
  const [blockedSites, setBlockedSites] = useState<string[]>([]);
  const [newSite, setNewSite] = useState("");
  const [aiModel, setAiModel] = useState<"gpt4" | "local">("gpt4");
  const [notifications, setNotifications] = useState(true);
  const [dataSync, setDataSync] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      // Try extension first, then fallback to API
      const extensionBridge = (await import('@/lib/extension-bridge')).default;
      let settings = await extensionBridge.getSettings();
      let id = await extensionBridge.getUserId();
      
      if (!settings || !id) {
        id = await getUserId();
        settings = await getSettings(id);
      }
      
      setUserId(id);
      setBlockedSites(settings.blockedSites || []);
      setAiModel(settings.aiModel || "gpt4");
      setNotifications(settings.notifications !== false);
      setDataSync(settings.cloudSync || false);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  }

  async function saveAllSettings() {
    if (!userId) return;
    
    setSaving(true);
    try {
      const settingsData = {
        blockedSites,
        aiModel,
        notifications,
        cloudSync: dataSync
      };
      
      // Save to backend API
      await updateSettings(userId, settingsData);
      
      // Also update extension if available
      const extensionBridge = (await import('@/lib/extension-bridge')).default;
      const success = await extensionBridge.updateSettings(settingsData);
      
      if (success) {
        // Settings saved to extension and backend
      } else {
        // Settings saved to backend (extension not available)
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  }

  const addSite = () => {
    if (newSite && !blockedSites.includes(newSite)) {
      setBlockedSites([...blockedSites, newSite]);
      setNewSite("");
    }
  };

  const removeSite = (site: string) => {
    setBlockedSites(blockedSites.filter((s) => s !== site));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900">
          Settings ⚙️
        </h1>
        <p className="mt-2 text-slate-600">
          Customize your Mentra experience
        </p>
      </motion.div>

      {/* Blocked Websites Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-sky-200/50 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-gradient-to-br from-sky-500/10 to-emerald-500/10 p-3">
            <Globe className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Monitored Websites
            </h2>
            <p className="text-sm text-slate-600">
              Sites that trigger reflection prompts
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSite()}
              placeholder="Add website (e.g., twitter.com)"
              className="flex-1 px-4 py-2 rounded-lg border border-sky-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addSite}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-medium shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2">
            {blockedSites.map((site, i) => (
              <motion.div
                key={site}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-50 to-emerald-50 text-slate-900 border border-sky-100"
              >
                <span className="text-sm font-medium">{site}</span>
                <button
                  onClick={() => removeSite(site)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* AI Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-sky-200/50 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-gradient-to-br from-sky-500/10 to-emerald-500/10 p-3">
            <Brain className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              AI Configuration
            </h2>
            <p className="text-sm text-slate-600">
              Choose your AI model and preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">
              AI Model
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAiModel("gpt4")}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  aiModel === "gpt4"
                    ? "border-sky-500 bg-sky-500/10"
                    : "border-sky-200 bg-white"
                }`}
              >
                <h3 className="font-semibold text-slate-900 mb-1">
                  Cloud AI (GPT-4)
                </h3>
                <p className="text-sm text-slate-600">
                  Most accurate, requires API key
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAiModel("local")}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  aiModel === "local"
                    ? "border-sky-500 bg-sky-500/10"
                    : "border-sky-200 bg-white"
                }`}
              >
                <h3 className="font-semibold text-slate-900 mb-1">
                  Local AI (Ollama)
                </h3>
                <p className="text-sm text-slate-600">
                  Privacy-first, runs offline
                </p>
              </motion.button>
            </div>
          </div>

          {aiModel === "gpt4" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-slate-900">
                OpenAI API Key
              </label>
              <input
                type="password"
                placeholder="sk-..."
                className="w-full px-4 py-2 rounded-lg border border-sky-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <p className="text-xs text-slate-600">
                Your API key is stored locally and encrypted
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-sky-200/50 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-gradient-to-br from-sky-500/10 to-emerald-500/10 p-3">
            <Shield className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Privacy & Security
            </h2>
            <p className="text-sm text-slate-600">
              Control your data and privacy
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-100">
            <div>
              <h3 className="font-medium text-slate-900">
                Enable Notifications
              </h3>
              <p className="text-sm text-slate-600">
                Get reminders and insights
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notifications ? "bg-sky-500" : "bg-slate-300"
              }`}
            >
              <motion.div
                animate={{ x: notifications ? 28 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-100">
            <div>
              <h3 className="font-medium text-slate-900">
                Cloud Sync
              </h3>
              <p className="text-sm text-slate-600">
                Sync data across devices
              </p>
            </div>
            <button
              onClick={() => setDataSync(!dataSync)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                dataSync ? "bg-sky-500" : "bg-slate-300"
              }`}
            >
              <motion.div
                animate={{ x: dataSync ? 28 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
              />
            </button>
          </div>

          <div className="rounded-lg border-2 border-orange-500/20 bg-orange-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-slate-900 mb-1">
                  Data Privacy Notice
                </h3>
                <p className="text-sm text-slate-700">
                  All your reflections are encrypted using AES-GCM and stored locally on your device. 
                  We never collect or share your personal data without explicit consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-sky-200/50 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-gradient-to-br from-sky-500/10 to-emerald-500/10 p-3">
            <Database className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Data Management
            </h2>
            <p className="text-sm text-slate-600">
              Export or delete your data
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-lg border border-sky-200 bg-white hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 transition-colors text-left shadow-sm"
          >
            <h3 className="font-medium text-slate-900 mb-1">
              Export Data
            </h3>
            <p className="text-sm text-slate-600">
              Download all reflections as JSON
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-lg border border-sky-200 bg-white hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 transition-colors text-left shadow-sm"
          >
            <h3 className="font-medium text-slate-900 mb-1">
              Clear Analytics
            </h3>
            <p className="text-sm text-slate-600">
              Reset all statistics and charts
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-lg border-2 border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-colors text-left"
          >
            <h3 className="font-medium text-red-600 mb-1">Delete All Data</h3>
            <p className="text-sm text-red-600/70">
              Permanently remove everything
            </p>
          </motion.button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveAllSettings}
          disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </motion.div>
    </div>
  );
}
