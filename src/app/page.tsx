'use client';

import { ArrowRight, BookOpen, MessageCircle, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import Silk from "@/components/shared/Silk";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative z-0 text-white">
      {/* Silk Background */}
      <div className="fixed inset-0 -z-10">
        <Silk speed={2} scale={0.2} color="#3a235e" noiseIntensity={0.4} rotation={0.1} />
      </div>

      {/* Navigation */}
      <header className="bg-white/10 backdrop-blur-md shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-purple-300" />
            <span className="text-2xl font-bold text-white">Campus Connect</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-white/90 hover:text-purple-200 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="bg-purple-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-purple-500/80 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-28 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent pb-4">
            Learn Better, Together.
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10">
            Connect, collaborate and accelerate your journey with peers around the globe.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/sign-up"
              className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full border border-white/30 hover:bg-white/20 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sign-in"
              className="bg-purple-400 text-gray-900 px-8 py-3 rounded-full hover:bg-purple-300 hover:shadow-xl transition-all duration-200"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">What You'll Love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-white" />}
              title="Connect Globally"
              description="Find and collaborate with students from different universities."
              color="from-purple-600 to-blue-600"
            />
            <FeatureCard
              icon={<MessageCircle className="h-8 w-8 text-white" />}
              title="Mentorship Matching"
              description="Get paired with peers or mentors who can help you grow."
              color="from-pink-600 to-blue-600"
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-white" />}
              title="Track Progress"
              description="Set goals, track achievements, and stay motivated."
              color="from-purple-500 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <StatCard value="10,000+" label="Active Learners" />
          <StatCard value="800+" label="Colleges Reached" />
          <StatCard value="25,000+" label="Connections Made" />
          <StatCard value="92%" label="User Satisfaction" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Join the Movement?
        </h2>
        <p className="text-lg text-white/80 mb-8">
          Sign up today and become a part of the next-gen peer learning platform.
        </p>
        <Link
          href="/signup"
          className="bg-white/10 backdrop-blur-lg text-white px-8 py-3 rounded-full text-lg hover:bg-white/20 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur text-white py-8 text-center border-t border-white/10">
        <p className="text-sm text-white/80">
          &copy; {new Date().getFullYear()} Campus Connect. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/10 shadow-md hover:shadow-xl transition-all text-center">
      <div
        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/80">{description}</p>
    </div>
  );
}

// Stat Card Component
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="backdrop-blur bg-white/10 p-6 rounded-xl border border-white/10">
      <div className="text-4xl font-bold mb-2 text-white">{value}</div>
      <div className="text-white/70">{label}</div>
    </div>
  );
}
