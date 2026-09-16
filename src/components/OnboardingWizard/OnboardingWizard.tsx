import React from 'react';
import { useApp } from '../../context/AppContext';
import type { FeedConfig } from '../../types';
import { Step1FeedInfo } from './Step1FeedInfo';
import { Step2SchemaProfiling } from './Step2SchemaProfiling';
import { Step3CanonicalMapping } from './Step3CanonicalMapping';
import { Step4DQRuleStudio } from './Step4DQRuleStudio';
import { Step5ReviewSubmit } from './Step5ReviewSubmit';
import { Sparkles, Check, Building2, Table, Workflow, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { 
    addFeed, 
    setActiveTab, 
    onboardingDraft: formData, 
    updateOnboardingDraft: updateFormData, 
    onboardingStep: currentStep, 
    setOnboardingStep: setCurrentStep,
    resetOnboardingDraft
  } = useApp();

  const steps = [
    { number: 1, title: 'Feed Metadata', icon: Building2 },
    { number: 2, title: 'Schema Profiling', icon: Table },
    { number: 3, title: 'Canonical Mapping', icon: Workflow },
    { number: 4, title: 'DQ Rules Studio', icon: ShieldAlert },
    { number: 5, title: 'Review & Publish', icon: CheckCircle2 },
  ];

  const handleFinalSubmit = (finalFeed: FeedConfig) => {
    addFeed(finalFeed);
    resetOnboardingDraft();
    setActiveTab('registry');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-cyan-400" />
            <span>BA Self-Service Feed Onboarding Journey</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure a standard healthcare data feed through guided schema inference, canonical mapping, plain-English DQ rules, and automated pipeline publishing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(formData.sourceOrg || formData.feedName) && (
            <button
              onClick={resetOnboardingDraft}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-full text-xs font-semibold transition-colors"
            >
              Reset Draft
            </button>
          )}
          <span className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-full text-xs font-semibold">
            Wave 1 Self-Service
          </span>
        </div>
      </div>

      {/* Step Progress Stepper */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between max-w-4xl mx-auto relative">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <div key={step.number} className="flex flex-col items-center relative z-10">
                <button
                  onClick={() => isCompleted && setCurrentStep(step.number)}
                  disabled={!isCompleted && !isCurrent}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : <Icon className="w-5 h-5" />}
                </button>
                <span className={`text-[11px] font-semibold mt-2 whitespace-nowrap ${
                  isCurrent ? 'text-cyan-300' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Content Body */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800">
        {currentStep === 1 && (
          <Step1FeedInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <Step2SchemaProfiling
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <Step3CanonicalMapping
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <Step4DQRuleStudio
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 5 && (
          <Step5ReviewSubmit
            formData={formData}
            onSubmit={handleFinalSubmit}
            onBack={() => setCurrentStep(4)}
          />
        )}
      </div>
    </div>
  );
};
