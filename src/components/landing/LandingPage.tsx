import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Check,
  ChevronRight,
  BarChart3,
  Cpu,
  Globe,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';

import heroMobileLegalRedaction from '../../assets/images/hero_mobile_legal_redaction_1790950130877.jpg';
import heroMobileLiquidMode from '../../assets/images/hero_mobile_liquid_mode_1790950144192.jpg';
import heroEnterpriseSignature from '../../assets/images/hero_enterprise_signature_1790950156744.jpg';

import featureForensicRedaction from '../../assets/images/feature_forensic_redaction_1790949726082.jpg';
import featureAiPodcastWave from '../../assets/images/feature_ai_podcast_wave_1790949738789.jpg';
import featureLiquidMobileMode from '../../assets/images/feature_liquid_mobile_mode_1790949750506.jpg';

interface LandingPageProps {
  onEnterApp: () => void;
  user: any;
  onSignIn: () => void;
  onLocalSignIn?: () => void;
  toastMessage?: string | null;
  onCloseToast?: () => void;
}

const HERO_SLIDES = [
  {
    title: "Forensic Redaction on the Move.",
    description: "Secure high-stakes information from anywhere. Our mobile-first redaction burns sensitive data directly into the pixels.",
    image: heroMobileLegalRedaction,
    accent: "text-red-600"
  },
  {
    title: "Liquid Mode Intelligence.",
    description: "Stop pinching and zooming. Experience fluid, reflowable document layouts that adapt perfectly to your smartphone screen.",
    image: heroMobileLiquidMode,
    accent: "text-amber-600"
  },
  {
    title: "Enterprise Trust, Everywhere.",
    description: "AATL certified digital signatures and A-4 compliance handshakes, verified in real-time from your executive dashboard.",
    image: heroEnterpriseSignature,
    accent: "text-blue-600"
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  user,
  onSignIn,
  onLocalSignIn,
  toastMessage,
  onCloseToast
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-100 selection:text-red-900 font-sans overflow-x-hidden">
      {/* 1. Header Contract - Mobile First */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded bg-red-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4 fill-white">
                <path d="M14.07 3h4.63L23 21h-4.32l-2.43-6.61H7.75L5.32 21H1L5.3 3h4.63l2.07 5.92L14.07 3zm-3.13 8.35L12 8.44l1.06 2.91h-2.12z" />
              </svg>
            </div>
            <span className="text-base md:text-lg font-bold tracking-tight text-slate-900">
              Chad-<span className="text-red-600">OmniPDF</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Intelligence</a>
            <a href="#security" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Security</a>
            <a href="#mobile" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Mobile</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Enterprise</a>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {onLocalSignIn && !user && (
              <button
                onClick={onLocalSignIn}
                className="px-3 py-2 text-xs md:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5"
                title="Sign in with a local enterprise profile"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                <span>Local Sign In</span>
              </button>
            )}
            <button
              onClick={onEnterApp}
              className="px-3 py-2 md:px-3.5 md:py-2.5 text-xs md:text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all active:scale-95 whitespace-nowrap hidden sm:block"
            >
              Continue as Guest
            </button>
            <button
              onClick={user ? onEnterApp : onSignIn}
              className="px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 whitespace-nowrap"
            >
              {user ? 'Enter Studio' : 'Google Login'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 p-6 space-y-4 md:hidden shadow-xl"
            >
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-900">Intelligence</a>
              <a href="#security" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-900">Security</a>
              <a href="#mobile" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-900">Mobile</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-900">Enterprise</a>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onEnterApp();
                  }}
                  className="w-full py-3 text-center text-sm font-bold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Continue as Guest
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    user ? onEnterApp() : onSignIn();
                  }}
                  className="w-full py-3 text-center text-sm font-bold text-white bg-red-600 rounded-lg"
                >
                  {user ? 'Enter Studio' : 'Google Login'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Error / Feedback Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4">
          <div className="bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-red-500/50 flex items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">{toastMessage}</span>
                <div className="text-[10px] text-slate-400 mt-1">
                  Tip: Firebase blocks localhost on AI Studio cloud projects. Click below to sign in locally.
                </div>
                {onLocalSignIn && !user && (
                  <button
                    onClick={onLocalSignIn}
                    className="mt-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Sign In with Local Account</span>
                  </button>
                )}
              </div>
            </div>
            {onCloseToast && (
              <button
                onClick={onCloseToast}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <main className="pt-16 md:pt-20">
        {/* 2. Hero Slider Section */}
        <section className="relative h-[85vh] md:h-[90vh] flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0"
            >
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img
                src={HERO_SLIDES[currentSlide].image}
                alt="Professional document workflow"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>

          <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 relative z-20 w-full">
            <div className="max-w-2xl space-y-6 md:space-y-8">
              <motion.div
                key={`badge-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 text-white font-black tracking-widest text-[10px] uppercase bg-red-600 px-3 py-1 rounded"
              >
                <Zap className="w-3 h-3" />
                Live: Version 4.8 Core Intelligence
              </motion.div>

              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tight"
              >
                {HERO_SLIDES[currentSlide].title.split(" ").map((word, i) => (
                  <span key={i} className={word.includes(".") ? HERO_SLIDES[currentSlide].accent : ""}>
                    {word}{" "}
                  </span>
                ))}
              </motion.h1>

              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg md:text-xl text-slate-100/90 leading-relaxed max-w-xl font-medium"
              >
                {HERO_SLIDES[currentSlide].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center gap-4 pt-4"
              >
                <button
                  onClick={user ? onEnterApp : onSignIn}
                  className="w-full sm:w-auto px-8 py-4 md:py-5 bg-white text-slate-900 font-black rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group active:scale-95 cursor-pointer"
                >
                  {user ? 'Enter Studio Workspace' : 'Sign In with Google'}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {onLocalSignIn && !user && (
                  <button
                    onClick={onLocalSignIn}
                    className="w-full sm:w-auto px-6 py-4 md:py-5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>Sign In with Local Profile</span>
                  </button>
                )}

                <button
                  onClick={onEnterApp}
                  className="w-full sm:w-auto px-8 py-4 md:py-5 bg-white/15 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl hover:bg-white/25 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span>Launch Guest Workspace</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-3">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 transition-all duration-300 rounded-full ${currentSlide === i ? 'w-10 bg-red-600' : 'w-4 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </section>

        {/* 3. Capabilities / Mechanism - Mobile Optimized Grid */}
        <section id="features" className="py-20 md:py-32 bg-slate-50">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20">
            <div className="space-y-6 mb-16 md:mb-24">
              <h2 className="text-sm font-black text-red-600 tracking-[0.3em] uppercase">Core Capabilities</h2>
              <p className="text-3xl md:text-6xl font-black text-slate-900 tracking-tight text-balance">
                High-Stakes Intelligence. <br className="hidden md:block" />
                <span className="text-slate-300">Absolute Integrity.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {/* Feature Cards - Ensure proper scaling on mobile */}
              {[
                {
                  title: "Forensic Redaction",
                  desc: "Permanent pixel-level destruction of PII. Unlike legacy tools, our engine purges the binary stream entirely.",
                  image: featureForensicRedaction,
                  tag: "Security"
                },
                {
                  title: "Executive Audio Briefs",
                  desc: "Turn 50-page legal filings into 5-minute dual-host podcasts. Digest core covenants, risks, and milestones passively while you commute.",
                  image: featureAiPodcastWave,
                  tag: "Efficiency"
                },
                {
                  title: "Liquid Mobile Mode",
                  desc: "AI-driven reflow that adapts perfectly to any screen. Zero pinching. Zero zooming. Pure reading mastery.",
                  image: featureLiquidMobileMode,
                  tag: "Productivity"
                }
              ].map((f, i) => (
                <button
                  key={i}
                  onClick={onEnterApp}
                  className="bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer active:scale-[0.98] text-left"
                >
                  <div className="overflow-hidden rounded-[2rem] mb-6">
                    <img
                      src={f.image}
                      alt={f.title}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="px-5 pb-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black text-red-600 tracking-widest uppercase">{f.tag}</div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-red-600 transition-colors">{f.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm font-medium">
                      {f.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Future Roadmap - Dark Mode Flow */}
        <section className="py-20 md:py-32 bg-slate-950 text-white overflow-hidden relative px-4">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="max-w-[1440px] mx-auto md:px-10 lg:px-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
              <div className="space-y-10 md:space-y-12">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tight italic">
                    The Truth is <br /> <span className="text-red-500">Immutable.</span>
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-lg font-medium">
                    Our roadmap is forged in the fires of enterprise compliance and forensic auditability.
                  </p>
                </div>

                <div className="space-y-10">
                  {[
                    { icon: BarChart3, title: "Cross-Portfolio Conflict Engine", desc: "Q3 2026: Automatic detection of contradictory clauses in massive archives." },
                    { icon: Cpu, title: "Regulatory Drift Watch", desc: "Q4 2026: Live monitoring of global legal changes against your static contracts." },
                    { icon: Globe, title: "Adversarial Forensics Lab", desc: "Q1 2027: Bit-level detection of hidden layers and 'deepfake' signatures." }
                  ].map((item, i) => (
                    <div
                      key={i}
                      onClick={onEnterApp}
                      className="flex gap-6 items-start group cursor-pointer active:translate-x-1 transition-all"
                    >
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all duration-300">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xl group-hover:text-red-500 transition-colors">{item.title}</h4>
                        <p className="text-sm text-slate-500 font-medium italic">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-10 backdrop-blur-xl">
                <div className="space-y-3">
                  <div className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px]">Studio Licensing</div>
                  <h3 className="text-3xl font-black italic tracking-tight">Accelerate Your Workspace.</h3>
                </div>

                <div className="space-y-5">
                  {[
                    "Global PDF/A-4 Forensic Standards",
                    "AATL Trusted Root Handshakes",
                    "FIPS-140-2 Level 3 Secure Stream",
                    "Unlimited Intelligence Tokens",
                    "Priority Compliance Engineering"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-bold tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={onEnterApp}
                  className="w-full py-6 bg-white text-slate-950 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs shadow-xl"
                >
                  Join the Studio Waitlist
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M14.07 3h4.63L23 21h-4.32l-2.43-6.61H7.75L5.32 21H1L5.3 3h4.63l2.07 5.92L14.07 3zm-3.13 8.35L12 8.44l1.06 2.91h-2.12z" />
                </svg>
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 uppercase">
                Chad-<span className="text-red-600">OmniPDF</span>
              </span>
            </div>
            <p className="text-lg text-slate-500 max-w-sm leading-relaxed italic font-bold">
              "Certainty of integrity. Power of intelligence."
            </p>
          </div>

          <div className="space-y-8">
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Studio Platform</h5>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li><button onClick={onEnterApp} className="hover:text-red-600 transition-colors">Workspace Login</button></li>
              <li><button onClick={onEnterApp} className="hover:text-red-600 transition-colors">Mobile Interface</button></li>
              <li><button onClick={onEnterApp} className="hover:text-red-600 transition-colors">Security Audit</button></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Compliance Center</h5>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li><button onClick={onEnterApp} className="hover:text-red-600 transition-colors">AATL Trusts</button></li>
              <li><button onClick={onEnterApp} className="hover:text-red-600 transition-colors">Privacy Shield</button></li>
              <li><button onClick={onEnterApp} className="hover:text-red-600 transition-colors">Legal Repository</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div>© 2026 Chad-OmniPDF Intelligence. Pro Edition.</div>
          <div className="flex gap-10">
            <button className="hover:text-slate-900 transition-colors underline decoration-red-600 underline-offset-8">Data Privacy</button>
            <button className="hover:text-slate-900 transition-colors underline decoration-red-600 underline-offset-8">Cookie Policy</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
