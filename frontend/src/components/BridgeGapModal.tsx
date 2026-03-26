'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { getGapQuestions, bridgeGapOptimize } from '@/lib/api';
import { useResumeStore } from '@/store/useResumeStore';

interface BridgeGapModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  onComplete: (newMarkdown: string) => void;
}

export default function BridgeGapModal({ isOpen, onClose, taskId, onComplete }: BridgeGapModalProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { analysisResult, setAnalysisResult } = useResumeStore();

  useEffect(() => {
    if (isOpen) {
      const fetchQuestions = async () => {
        setIsLoading(true);
        setCurrentStep(0);
        try {
          const res = await getGapQuestions(
            taskId, 
            analysisResult?.original_text, 
            analysisResult?.job_description
          );
          // Ensure we have an array
          const qList = Array.isArray(res.questions) ? res.questions : [res.questions];
          setQuestions(qList);
          setAnswers(new Array(qList.length).fill(''));
        } catch (error) {
          console.error(error);
          setQuestions(["Tell us more about your technical experience relevant to this role."]);
          setAnswers(['']);
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [isOpen, taskId]);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const combinedAnswers = questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}`).join('\n\n');
      const result = await bridgeGapOptimize(taskId, combinedAnswers);
      setAnalysisResult(result);
      onComplete(result.optimized_content.raw_text);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Optimization failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/20"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 z-10">
          <X className="h-5 w-5" />
        </button>

        <div className="p-12">
          {isLoading ? (
            <div className="h-[400px] flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                <Sparkles className="h-5 w-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-slate-900 font-black tracking-[0.3em] uppercase text-[10px] animate-pulse">Mapping Semantic Delta...</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Bridge the Gap</h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Target: 95% Match Score</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  <span>Module {currentStep + 1} of {questions.length}</span>
                  <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Synchronized</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-white">
                  <motion.div 
                    className="h-full bg-indigo-600 rounded-full"
                    animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </div>
              </div>

              {/* Question Content */}
              <div className="min-h-[220px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-black text-slate-800 leading-tight tracking-tight uppercase border-l-4 border-indigo-600 pl-6">
                      {questions[currentStep]}
                    </h3>
                    <textarea 
                      autoFocus
                      value={answers[currentStep]}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[currentStep] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      placeholder="Input specific achievements, metrics, or technologies..."
                      className="w-full h-36 p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none text-slate-700 text-sm font-medium transition-all"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                <button 
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 disabled:opacity-0 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!answers[currentStep]?.trim() || isSubmitting}
                  className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-2xl shadow-indigo-900/10 disabled:opacity-50 transition-all active:scale-95"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Finalizing Architecture...</>
                  ) : (
                    <>{currentStep === questions.length - 1 ? 'Execute Scan' : 'Next Module'} <ChevronRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
