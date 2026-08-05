import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const StepIndicator = ({ currentStep, totalSteps, labels }: StepIndicatorProps) => {
  return (
    <div className="sticky top-16 z-30 -mx-4 mb-8 px-4 py-4 sm:mx-0 sm:rounded-2xl sm:px-6 bg-background/80 backdrop-blur-md border-b border-border/60 sm:border sm:border-border/60">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: step === currentStep ? [1, 1.06, 1] : 1, opacity: 1 }}
                  transition={step === currentStep ? { scale: { duration: 2.2, repeat: Infinity }, opacity: { duration: 0.25 } } : { duration: 0.25 }}
                  className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                    step < currentStep
                      ? 'step-completed'
                      : step === currentStep
                      ? 'step-active'
                      : 'step-inactive'
                  }`}
                >
                  {step < currentStep ? (
                    <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 420, damping: 22 }}>
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.span>
                  ) : (
                    step
                  )}
                </motion.div>
                <span
                  className={`mt-2 hidden sm:block text-xs font-medium ${
                    step <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {labels[index]}
                </span>
              </div>

              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 mx-2">
                  <div className="h-1 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: step < currentStep ? '100%' : '0%' }}
                      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full gradient-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-xs font-medium text-muted-foreground sm:hidden">
          {labels[currentStep - 1]}
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;
