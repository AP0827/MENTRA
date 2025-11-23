"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Brain, 
  Send, 
  X, 
  Sparkles,
  AlertCircle,
  Target
} from "lucide-react";

interface ReflectionPopupProps {
  website: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReflectionPopup({ website, isOpen, onClose }: ReflectionPopupProps) {
  const [reflection, setReflection] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  const handleSubmit = async () => {
    if (!reflection.trim()) return;

    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const responses = [
        "That's a valuable insight! Consider setting a specific time limit for this activity. Would 15 minutes help you get what you need without losing focus?",
        "I understand the urge to check this site. Before proceeding, take 3 deep breaths. Does this align with your current goals?",
        "Quick checks often turn into longer sessions. What if you noted this down and came back during your designated break time?",
        "Your awareness is the first step! Consider: will this help you accomplish what you set out to do today?",
      ];
      
      setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
      setShowResponse(true);
      setIsProcessing(false);
    }, 2000);
  };

  const handleProceed = () => {
    // Log the interaction and allow user to proceed
    // User proceeded to site
    onClose();
  };

  const handleGoBack = () => {
    // Log the interaction and redirect back
    // User went back
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-b border-[hsl(var(--border))]">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  <X className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                      Mindful Moment
                    </h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                      You're about to visit <span className="font-semibold text-purple-600">{website}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {!showResponse ? (
                  <>
                    {/* Reflection Prompt */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-[hsl(var(--foreground))]">
                          Take a moment to reflect
                        </h3>
                      </div>
                      <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                        Before you proceed, help us understand your intention:
                      </p>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                          Why are you visiting this site right now?
                        </label>
                        <textarea
                          value={reflection}
                          onChange={(e) => setReflection(e.target.value)}
                          placeholder="e.g., I need a quick break, looking for specific information..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                      </div>

                      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-600">Pro Tip</p>
                          <p className="text-sm text-blue-600/80 mt-0.5">
                            Honest reflection helps our AI provide better, personalized guidance over time.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoBack}
                        className="flex-1 px-6 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors font-medium"
                      >
                        Go Back
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={!reflection.trim() || isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Get AI Guidance
                          </>
                        )}
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* AI Response */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                          <h3 className="font-semibold text-[hsl(var(--foreground))]">
                            AI Suggestion
                          </h3>
                        </div>
                        <p className="text-[hsl(var(--foreground))] leading-relaxed">
                          {aiResponse}
                        </p>
                      </div>

                      <div className="rounded-lg bg-[hsl(var(--muted))] p-4">
                        <h4 className="text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                          Your Reflection:
                        </h4>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] italic">
                          "{reflection}"
                        </p>
                      </div>

                      <div className="border-t border-[hsl(var(--border))] pt-4">
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                          Was this suggestion helpful?
                        </p>
                        <div className="flex gap-2 mb-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-lg border border-green-500/20 bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors text-sm font-medium"
                          >
                            👍 Helpful
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-colors text-sm font-medium"
                          >
                            👎 Not Helpful
                          </motion.button>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleGoBack}
                          className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg"
                        >
                          Return to Work
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleProceed}
                          className="flex-1 px-6 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors font-medium"
                        >
                          Proceed Anyway
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
