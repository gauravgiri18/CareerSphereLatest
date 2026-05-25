"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  FileText,
  Mail,
  MessageSquare,
  Shield,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Industry Insights",
    description:
      "Real-time market data, salary ranges, and growth trends for your industry.",
  },
  {
    icon: FileText,
    title: "AI Resume Builder",
    description:
      "Create ATS-optimized resumes with AI-powered suggestions and improvements.",
  },
  {
    icon: MessageSquare,
    title: "Mock Interviews",
    description:
      "Practice with AI-generated technical questions tailored to your skills.",
  },
  {
    icon: Mail,
    title: "Cover Letter Generator",
    description:
      "Generate personalized cover letters for any job application instantly.",
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    description:
      "Track your interview scores and identify areas for improvement.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and never shared with third parties.",
  },
];

export function Features() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white text-center mb-16"
        >
          Everything You Need to Succeed
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
            >
              <feature.icon className="h-10 w-10 text-white mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
