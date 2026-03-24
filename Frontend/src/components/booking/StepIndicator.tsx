import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const StepIndicator = ({ currentStep, totalSteps, labels }: StepIndicatorProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                  step < currentStep
                    ? 'step-completed'
                    : step === currentStep
                    ? 'step-active'
                    : 'step-inactive'
                }`}
              >
                {step < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step
                )}
              </motion.div>
              <span
                className={`mt-2 text-xs font-medium ${
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
                    transition={{ duration: 0.5 }}
                    className="h-full gradient-primary"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
