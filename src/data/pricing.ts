export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular: boolean;
}

export const pricing: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic Care',
    price: '$99',
    popular: false,
    features: [
      'Dental examination',
      'Professional cleaning',
      'X-rays (if needed)',
      'Oral hygiene instructions',
      'Fluoride treatment',
    ],
  },
  {
    id: 'standard',
    name: 'Standard Care',
    price: '$199',
    popular: true,
    features: [
      'Everything in Basic Care',
      'Teeth whitening',
      'Cavity filling (up to 2)',
      'Gum disease screening',
      'Priority scheduling',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Care',
    price: '$349',
    popular: false,
    features: [
      'Everything in Standard Care',
      'Root canal treatment',
      'Crown placement',
      'Dental implants consultation',
      '24/7 emergency support',
      'Annual check-ups included',
    ],
  },
];