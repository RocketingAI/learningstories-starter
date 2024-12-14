"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, User2 } from "lucide-react";

interface Coach {
  role: string;
  name: string;
  comment: string;
}

interface CoachingOverlayProps {
  coaches: Coach[];
  onUseComment: (comment: string) => void;
}

export function CoachingOverlay({ coaches, onUseComment }: CoachingOverlayProps) {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-hide comment after 5 seconds if not hovering
  useEffect(() => {
    if (selectedCoach && !isHovering) {
      const timer = setTimeout(() => {
        setSelectedCoach(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedCoach, isHovering]);

  return (
    <div className="fixed bottom-32 right-8 flex flex-col items-end gap-3 z-50">
      <AnimatePresence>
        {selectedCoach && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="max-w-md"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{selectedCoach.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedCoach.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => onUseComment(selectedCoach.comment)}
                  className="inline-flex items-center gap-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded-md transition-colors"
                >
                  <MessageSquarePlus className="h-3 w-3" />
                  <span>Use Feedback</span>
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedCoach.comment}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <AnimatePresence>
          {coaches.map((coach, index) => (
            <motion.button
              key={coach.name}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: index * 0.1 }}
              className={`relative group`}
              onClick={() => setSelectedCoach(coach === selectedCoach ? null : coach)}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center">
                <User2 className="h-5 w-5 text-primary" />
              </div>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white dark:bg-gray-800 text-xs py-1 px-2 rounded shadow whitespace-nowrap">
                  {coach.name}
                </div>
              </div>
              {coach === selectedCoach && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
