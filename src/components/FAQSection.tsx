'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from '@/components/social-icons';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: number;
}

interface FAQSectionProps {
  initialFaqs?: FAQ[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ initialFaqs = [] }) => {
  const [faqs] = useState<FAQ[]>(initialFaqs);
  const [openId, setOpenId] = useState<number | null>(initialFaqs.length > 0 ? initialFaqs[0].id : null);

  const toggle = (id: number) => {
    if (openId === id) setOpenId(null);
    else setOpenId(id);
  };

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[var(--color-background)]" aria-labelledby="faq-title">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="faq-title" className="text-3xl font-bold text-[var(--color-primary)] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[var(--color-text)]">
            Find answers to common questions about our clinic, treatments, and policies.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-[var(--color-border)] rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-[var(--color-card-bg)] text-left hover:bg-[var(--color-background)] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-[var(--color-primary)] text-lg">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="text-[var(--color-accent)] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="text-[var(--color-primary)] flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 py-4 bg-[var(--color-card-bg)] border-t border-[var(--color-border)]">
                    <p className="text-[var(--color-text)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
