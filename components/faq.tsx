"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does AI career coaching work?",
    answer:
      "CareerSphere uses Google Gemini AI to analyze your profile, industry trends, and career goals. It provides personalized recommendations for resume improvements, interview preparation, and cover letter generation based on real market data.",
  },
  {
    question: "How often is industry data updated?",
    answer:
      "Industry insights are automatically updated weekly through our background job system. You can see the last update date and next scheduled update on your dashboard.",
  },
  {
    question: "Can I export my resume as PDF?",
    answer:
      "Yes! Our resume builder includes a one-click PDF export feature. Your resume is rendered from markdown and exported as a professional PDF document.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use Clerk for authentication, encrypted database connections via NeonDB, and never share your personal data with third parties. All AI processing is done securely server-side.",
  },
  {
    question: "How does mock interview work?",
    answer:
      "Our AI generates 10 technical questions tailored to your industry, experience level, and skills. You answer multiple-choice questions, get instant feedback, and receive personalized improvement tips based on your performance.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white/5 border border-white/10 rounded-xl px-6 border-b-0"
            >
              <AccordionTrigger className="text-white hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/60">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
