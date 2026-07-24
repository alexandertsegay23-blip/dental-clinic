'use client';

import React, { useEffect, useState } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { ChevronDown, ChevronUp } from '@/components/social-icons';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: number;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          setFaqs(data.faqs || []);
          if (data.faqs?.length > 0) {
            setOpenId(data.faqs[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggle = (id: number) => {
    if (openId === id) setOpenId(null);
    else setOpenId(id);
  };

  if (loading) {
    return (
      <section className="py-20 bg-background" aria-labelledby="faq-title">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <div className="text-primary text-lg">Loading FAQs...</div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return (
      <section className="py-20 bg-background" aria-labelledby="faq-title">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <div className="text-text/60">No FAQs available at the moment.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background" aria-labelledby="faq-title">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 id="faq-title" className="heading-2 text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="body-lg text-text/70">
            Find answers to common questions about our clinic, treatments, and policies.
          </p>
        </FadeIn>

        <FadeIn className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-border rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-card-bg text-left hover:bg-background transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-primary text-lg">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="text-primary flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 py-4 bg-card-bg border-t border-border">
                    <p className="text-text leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </FadeIn>
      </div>
    </section>
  );
}
