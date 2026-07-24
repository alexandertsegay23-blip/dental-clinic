import React from 'react';
import { pricing } from '@/data/pricing';
import { Check } from '@/components/social-icons';
import Link from 'next/link';

export const PricingSection: React.FC = () => {
  return (
         <section className="py-16 bg-background" aria-labelledby="pricing-title">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="pricing-title" className="text-3xl font-bold text-primary mb-4">
            Transparent Pricing
          </h2>
          <p className="text-lg text-text max-w-2xl mx-auto">
            Quality dental care should be accessible. Here is a guide to our most requested services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {pricing.map((plan) => (
            <div 
              key={plan.id}
              className={`p-8 rounded-xl border ${
                plan.popular 
                  ? 'border-primary shadow-xl relative scale-100 md:scale-105 z-10 bg-background' 
                  : 'border-border shadow-card bg-card-bg'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-text-inverse px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold text-primary text-center mb-2">{plan.name}</h3>
              <div className="text-3xl font-extrabold text-secondary text-center mb-6">
                {plan.price}
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-text">
                    <Check size={20} className="text-success flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/appointment"
                className={`block w-full text-center py-3 rounded-md font-semibold transition-colors ${
                  plan.popular 
                    ? 'bg-primary text-text-inverse hover:bg-primary-hover' 
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
        
        <p className="text-center text-sm text-text mt-8">
          * Prices are indicative and may vary based on individual cases. Please contact us for a personalized quote.
        </p>
      </div>
    </section>
  );
};
