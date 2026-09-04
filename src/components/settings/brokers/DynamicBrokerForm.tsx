import React, { useState, useEffect } from 'react';
import { BrokerProviderDefinition } from '../../../lib/brokers/brokerTypes';
import { cn } from '../../../lib/cn';
import { 
  Eye, EyeOff, AlertCircle, Lock, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface DynamicBrokerFormProps {
  provider: BrokerProviderDefinition;
  onSubmit: (credentials: Record<string, string>, accountAlias: string) => Promise<void>;
  isLoading: boolean;
  onCancel?: () => void;
}

export const DynamicBrokerForm: React.FC<DynamicBrokerFormProps> = ({
  provider,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [accountAlias, setAccountAlias] = useState(`${provider.name} Account`);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFormData({});
    setAccountAlias(`${provider.name} Portfolio`);
    setValidationErrors({});
    setTouched({});
  }, [provider.providerId, provider.name]);

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    
    const fieldDef = provider.fields.find(f => f.id === id);
    if (fieldDef && fieldDef.regexValidation) {
      const regex = new RegExp(fieldDef.regexValidation);
      if (value && !regex.test(value)) {
        setValidationErrors(prev => ({ ...prev, [id]: fieldDef.validationErrorMessage || 'Invalid field format' }));
      } else {
        setValidationErrors(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    }
  };

  const handleBlur = (id: string) => {
    setTouched(prev => ({ ...prev, [id]: true }));
    const val = formData[id] || '';
    const fieldDef = provider.fields.find(f => f.id === id);
    if (fieldDef?.required && !val.trim()) {
      setValidationErrors(prev => ({ ...prev, [id]: `${fieldDef.label} is required` }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    
    provider.fields.forEach(field => {
      const val = formData[field.id] || '';
      if (field.required && !val.trim()) {
        errors[field.id] = `${field.label} is required`;
      }
      if (val && field.regexValidation) {
        const regex = new RegExp(field.regexValidation);
        if (!regex.test(val)) {
          errors[field.id] = field.validationErrorMessage || 'Invalid credential format';
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setTouched(provider.fields.reduce((acc, f) => ({ ...acc, [f.id]: true }), {}));
      return;
    }

    onSubmit(formData, accountAlias);
  };

  const inputCls = cn(
    'w-full h-14 rounded-xl border bg-surface-0 px-5 text-base text-primary font-bold',
    'placeholder:text-muted outline-none transition-all duration-300 font-mono shadow-inner',
    'focus:border-iris focus:bg-surface-0 focus:shadow-[0_0_0_4px_rgba(var(--color-iris),0.15)]'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans w-full">
      {/* Account Alias Input */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-secondary block">
          Account Alias <span className="font-normal text-tertiary ml-1">(Internal Label)</span>
        </label>
        <input
          type="text"
          value={accountAlias}
          onChange={e => setAccountAlias(e.target.value)}
          placeholder="e.g. Primary Trading Vault"
          className={cn(inputCls, 'font-sans font-bold text-lg text-primary')}
          required
        />
      </div>

      {/* Dynamic Fields */}
      <div className="space-y-6">
        {provider.fields.map(field => {
          const hasError = touched[field.id] && !!validationErrors[field.id];
          const isPasswordField = field.isSecret && !showSecret[field.id];
          const hasValue = !!formData[field.id];
          const isValid = hasValue && !hasError;

          return (
            <div key={field.id} className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center gap-2">
                {field.label}
                {field.required && <span className="text-danger">*</span>}
                {field.isSecret && (
                  <span className="inline-flex items-center justify-center bg-surface-2 text-tertiary w-5 h-5 rounded-md border border-border" title="Stored securely">
                    <Lock size={10} />
                  </span>
                )}
              </label>

              <div className="relative group">
                <input
                  type={isPasswordField ? 'password' : 'text'}
                  autoComplete={field.isSecret ? 'new-password' : 'off'}
                  placeholder={field.exampleFormat ? `e.g. ${field.exampleFormat}` : field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={e => handleInputChange(field.id, e.target.value)}
                  onBlur={() => handleBlur(field.id)}
                  className={cn(
                    inputCls,
                    hasError ? 'border-danger focus:border-danger focus:shadow-[0_0_0_4px_rgba(var(--color-danger),0.15)] bg-danger/5' : isValid ? 'border-success/50 bg-success/5' : 'border-border',
                    field.isSecret ? 'pr-20' : isValid ? 'pr-12' : ''
                  )}
                />
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {isValid && !field.isSecret && (
                    <CheckCircle2 size={20} className="text-success animate-in zoom-in duration-200" />
                  )}
                  
                  {field.isSecret && (
                    <button
                      type="button"
                      onClick={() => setShowSecret(prev => ({ ...prev, [field.id]: !prev[field.id] }))}
                      className="text-tertiary hover:text-primary transition-colors focus:outline-none p-1.5 rounded-md hover:bg-surface-2"
                    >
                      {showSecret[field.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {hasError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm font-bold text-danger flex items-center gap-1.5 mt-2"
                  >
                    <AlertCircle size={16} /> <span>{validationErrors[field.id]}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="pt-6 mt-6 border-t border-border flex justify-between items-center">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading} className="font-bold text-tertiary hover:text-primary">
            Review Instructions
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} className="h-12 px-8 font-bold text-base shadow-iris">
          {!isLoading && `Authenticate Connection`}
        </Button>
      </div>
    </form>
  );
};
