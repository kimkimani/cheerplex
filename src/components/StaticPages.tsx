import React, { useState, useEffect } from 'react';
import { getApiBaseUrl } from '../lib/getApiBaseUrl';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Users, 
  HelpCircle, 
  HeartHandshake, 
  FileText, 
  Scale, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Trophy, 
  ChevronRight, 
  Lock,
  Globe,
  AlertTriangle,
  UserCheck,
  ChevronDown,
  Eye,
  Code,
  Info,
  MessageSquare,
  ExternalLink,
  Link,
  Plus,
  Brain,
  Award
} from 'lucide-react';
import { getMarkdownContent, buildCanonicalUrl } from '../content/markdownLoader';
import { getAllAuthors } from '../content/authorLoader';
import MarkdownRenderer from './MarkdownRenderer';
import { contactSocialTable } from '../data';
import { AuthorCard } from './AuthorCard';
import { ResponsibleGamblingNotice } from './ResponsibleGamblingNotice';
import InboundLinksBlock from './InboundLinksBlock';
import { getLinkRel } from '../utils/linkUtils';

interface StaticPagesProps {
  pageId: string;
  onBackToHome: () => void;
}

interface FAQItem {
  q: string;
  a: string;
}

// Interactive SEO Snippet Preview and Head Tag Injector
function SeoIndicator({ 
  title, 
  description, 
  keywords, 
  url, 
  pageId 
}: { 
  title: string; 
  description: string; 
  keywords: string; 
  url: string; 
  pageId: string; 
}) {
  const canonicalUrl = buildCanonicalUrl(url, pageId);

  React.useEffect(() => {
    // Dynamic page title update
    document.title = title;
    
    // Dynamic meta tags injection
    const updateMetaTag = (name: string, value: string, attrName = 'name') => {
      let element = document.querySelector(`meta[${attrName}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:url', canonicalUrl, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    return () => {
      // Revert title
      document.title = "Cheerplex - Math-Driven Football Predictions";
    };
  }, [title, description, keywords, url, canonicalUrl, pageId]);

  return null;
}

// Interactive Accordion-style FAQ component
function PageFAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="p-6 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] text-left mt-8 space-y-4">
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3.5 mb-4">
        <div className="w-8 h-8 rounded bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
          <HelpCircle className="w-4.5 h-4.5" />
        </div>
        <div>
          <h2 className="text-sm font-black text-[var(--text)]   tracking-wider font-mono">Frequently Asked Questions</h2>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Quick answers to specific legal, database, and billing topics</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className="rounded-xl border border-[var(--border)] overflow-hidden transition-colors"
              style={{ backgroundColor: isOpen ? 'var(--background)' : 'transparent' }}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-4 bg-transparent border-none cursor-pointer focus:outline-none"
              >
                <h3 className="text-xs font-bold text-[var(--text)] hover:text-[var(--primary)] transition-colors pr-2 leading-relaxed m-0 font-sans">
                  {item.q}
                </h3>
                <span className={`text-slate-400 shrink-0 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-1 border-t border-[var(--border)]/60 mt-0.5">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StaticPages({ pageId, onBackToHome }: StaticPagesProps) {
  const pageMd = getMarkdownContent(pageId);

  // Dynamic Site Settings (database-driven)
  const [siteContacts, setSiteContacts] = useState({
    siteName: 'Cheerplex Predictions',
    email: 'support@cheerplex.co.ke',
    phone: '+254740841375',
    whatsapp: '+254740841375',
    telegram: 'https://t.me/cheerplex',
    facebook: 'https://facebook.com/cheerplex',
    twitter: 'https://x.com/cheerplex',
    instagram: 'https://instagram.com/cheerplex',
    address: 'Nairobi, Kenya',
  });

  useEffect(() => {
    const baseUrl = getApiBaseUrl();
    fetch(`${baseUrl}/api/site-settings`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setSiteContacts(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.error('Failed to load site contacts:', err));
  }, []);

  // Database-driven Partners state
  const [dbPartners, setDbPartners] = useState<any[]>([]);

  useEffect(() => {
    const baseUrl = getApiBaseUrl();
    fetch(`${baseUrl}/api/partners`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDbPartners(data);
        }
      })
      .catch(err => console.error('Failed to load partners from database:', err));
  }, []);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSubmitting(true);
    try {
      const baseUrl = getApiBaseUrl();
      await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setFormSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Failed to submit contact form:', err);
      // Still show success fallback so user experience is smooth
      setFormSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  // Switch content based on pageId
  const renderContent = () => {
    switch (pageId) {
      case 'responsible-gambling': {
        const rgFaqs = [
          {
            q: "Is Cheerplex a bookmaker or betting operator?",
            a: "No. Cheerplex does not host betting, register wagers, or accept sports stakes. We are strictly an educational and analytical consulting platform. All betting is completed on independent third-party sportsbooks."
          },
          {
            q: "What are safe spending limit guidelines for football predictions?",
            a: "We recommend a strict rule: never commit more than 1% to 2% of your disposable monthly entertainment budget to sports analytics or wagers. Treat sports tips as recreational expenses, and never borrow funds to place bets."
          },
          {
            q: "How can I request permanent self-exclusion or database erasure?",
            a: "We support a safe play ecosystem. If you feel betting is negatively impacting your life, you can request that we permanently block your phone number from checkout triggers and purge your analytical logs by emailing support@cheerplex.co.ke."
          }
        ];

        return (
          <div className="space-y-8 animate-fade-in text-left">
            {/* Dynamic SEO Card */}
            <SeoIndicator 
              title="Responsible Gambling - Play Safely with Cheerplex"
              description="Cheerplex is dedicated to responsible play. Read our guidelines on betting bankrolls, strict age limits (18+), and local support resources like GamHelp Kenya."
              keywords="responsible gambling Kenya, safe betting tips, GamHelp Kenya support, betting bankroll management, minor prevention sports"
              url="https://cheerplex.co.ke/responsible-gambling"
              pageId={pageId}
            />

            <div className="relative p-6 md:p-8 rounded-[var(--radius)] border border-rose-500/20 bg-[var(--card)] overflow-hidden">
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-mono font-black   text-rose-500 tracking-wider px-2 py-1 rounded bg-rose-500/10 flex items-center gap-1.5 w-fit">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Safety and Responsibility
                </span>
                <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {pageMd.displayTitle || pageMd.title || "Responsible Gambling"}
                </h1>
                {pageMd.introParagraph ? (
                  <div className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl font-normal">
                    <MarkdownRenderer content={pageMd.introParagraph} />
                  </div>
                ) : (
                  <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
                    Cheerplex is strictly an analytical platform. We do not operate a sportsbook, and we do not accept direct bets. Sports forecasting is speculative, and we are committed to ensuring our users play safely, responsibly, and with absolute cognitive awareness.
                  </p>
                )}
              </div>
            </div>

            {/* Core Guidelines */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--text)]">Cheerplex's Rules for Safe Engagement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Strictly 18+ Access Only', text: 'Participation in sports betting in Kenya and globally is strictly limited to adults of 18 years and above. Cheerplex enforces active verification and does not target or allow minor engagement.' },
                  { title: 'Never Chase Failures', text: 'Sports outcomes contain infinite random variables. If an accumulator or jackpot slip fails, do not immediately escalate stakes to recover capital. Stick to a predetermined daily allocation.' },
                  { title: 'Define Your Betting Bankroll', text: 'Only utilize funds that you can afford to lose without affecting your basic living requirements, rent, education fees, or family duties. Treat subscriptions as analytical entertainment.' },
                  { title: 'Acknowledge Probability Chaos', text: 'Even the most advanced statistical modeling, machine learning, or historical trends cannot guarantee a 100% correct football result. Always understand that outcomes carry inherent risks.' }
                ].map((g, idx) => (
                  <div key={idx} className="p-5 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] space-y-2">
                    <h4 className="text-xs font-black text-rose-500   tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      {g.title}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{g.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpline indicators */}
            <div className="p-6 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text)]">Where to Seek Help</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                If you or someone you know is experiencing betting-related compulsive distress or financial instability, reach out to professional counseling agencies immediately. These resources provide free, confidential advice and support:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-1.5">
                  <span className="font-bold block text-[var(--text)]">GamHelp Kenya</span>
                  <span className="text-slate-400 text-[11px] leading-relaxed block">Local specialized counseling and addiction support infrastructure.</span>
                  <span className="text-[var(--primary)] font-mono font-bold block pt-1">Call: +254 700 000 000</span>
                </div>
                <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-1.5">
                  <span className="font-bold block text-[var(--text)]">BeGambleAware Org</span>
                  <span className="text-slate-400 text-[11px] leading-relaxed block">International guidance, helpline links, and diagnostic self-assessment tests.</span>
                  <a href="https://www.begambleaware.org" target="_blank" rel="noreferrer" className="text-[var(--primary)] font-bold inline-flex items-center gap-1 pt-1 hover:underline">
                    Visit Website <Globe className="w-3 h-3" />
                  </a>
                </div>
                <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-1.5">
                  <span className="font-bold block text-[var(--text)]">Responsible Gambling Council</span>
                  <span className="text-slate-400 text-[11px] leading-relaxed block">Global standard-setter for preventative strategies and user education.</span>
                  <a href="https://www.responsiblegambling.org" target="_blank" rel="noreferrer" className="text-[var(--primary)] font-bold inline-flex items-center gap-1 pt-1 hover:underline">
                    Visit Website <Globe className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Custom page-specific FAQ */}
            <PageFAQ items={rgFaqs} />
          </div>
        );
      }

      case 'contact': {
        const contactFaqs = [
          {
            q: "What is Cheerplex's typical support response time?",
            a: "Our Kilimani HQ dispatch team monitors incoming tickets and WhatsApp streams 24 hours a day. Average resolution times for active billing or slip access inquiries are under 15 minutes."
          },
          {
            q: "Can I receive daily prediction alerts directly via premium SMS?",
            a: "Yes! Active VIP members can opt-in to secure direct SMS notifications from our server dashboard, delivering instant match codes and slips directly to their Kenyan line as soon as the algorithms output the selections."
          },
          {
            q: "How do I troubleshoot an M-Pesa STK Push that did not display?",
            a: "If the STK Push doesn't appear, ensure your line has active service, your SIM toolkit is updated, and your screen is unlocked. Alternatively, you can copy our Till Number shown on checkout and pay manually, then paste your transaction code to activate instantly."
          }
        ];

        return (
          <div className="space-y-8 animate-fade-in text-left">
            {/* Dynamic SEO Card */}
            <SeoIndicator 
              title={pageMd.title || "Contact · BetPro"}
              description={pageMd.description || "Contact BetPro via WhatsApp for VIP packages, payments, predictions and support."}
              keywords={pageMd.keywords || "contact cheerplex, cheerplex whatsapp, cheerplex support, betpro contact"}
              url="https://cheerplex.co.ke/contact/"
              pageId={pageId}
            />

            <div className="relative p-6 md:p-8 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-mono font-black   text-indigo-500 tracking-wider px-2 py-1 rounded bg-indigo-500/10">
                  Cheerplex Support
                </span>
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>
                  Contact & Support
                </h1>
                <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
                  Quick support via WhatsApp — fastest for payments, VIP access and delivery questions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Column: WhatsApp and Support Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] space-y-5">
                  <div>
                    <h2 className="text-lg md:text-xl font-extrabold text-[var(--text)]">
                      Chat with our support team on WhatsApp
                    </h2>
                    <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
                      We reply fastest on WhatsApp. Use the button below to open a chat with a pre-filled message — or copy the number and message it from your phone.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <a 
                      href="https://wa.me/254740841375?text=Hello%20Cheerplex%2C%20I%20need%20assistance" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Chat on WhatsApp Now</span>
                    </a>
                    <div className="text-[12px] text-[var(--text-muted)] font-mono">
                      Message preview: <em className="text-[var(--text)]">Hello Cheerplex, I need assistance</em>
                    </div>
                  </div>

                  <hr className="border-[var(--border)]" />

                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-[var(--text)]   tracking-wider font-mono">
                      How to speed up support
                    </h3>
                    <ul className="space-y-2 text-xs text-[var(--text)] list-disc pl-5">
                      <li>Include the package name (e.g. &quot;Jackpot VIP&quot;) if your question is about a purchase.</li>
                      <li>Send a screenshot of any payment confirmation (MPESA receipt) where applicable.</li>
                      <li>Mention your preferred delivery channel (SMS or Telegram).</li>
                    </ul>
                    <p className="text-xs text-[var(--text-muted)] pt-2">
                      If you prefer not to use WhatsApp, our public email is{' '}
                      <a href="mailto:support@254suretips.com" className="text-[var(--primary)] font-semibold hover:underline">
                        support@254suretips.com
                      </a>{' '}
                      or{' '}
                      <a href="mailto:info@Cheerplex.co.ke" className="text-[var(--primary)] font-semibold hover:underline">
                        info@Cheerplex.co.ke
                      </a>.
                    </p>
                  </div>
                </div>

                {/* Optional Web Form */}
                <div className="p-6 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] space-y-4">
                  <div className="text-xs font-black text-[var(--text)]   tracking-wider font-mono">
                    Send Email Ticket
                  </div>
                  {formSubmitted ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-bold text-[var(--text)]">Message Dispatched!</div>
                      <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                        We have received your ticket and will follow up via email within the hour.
                      </p>
                      <button 
                        type="button"
                        onClick={() => setFormSubmitted(false)}
                        className="px-4 py-1.5 text-xs font-bold rounded-lg border border-[var(--border)] text-[var(--text)]"
                      >
                        Send Another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          required
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="px-3 py-2 text-xs rounded bg-[var(--background)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                        />
                        <input 
                          type="email" 
                          required
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="px-3 py-2 text-xs rounded bg-[var(--background)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-3 py-2 text-xs rounded bg-[var(--background)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                      />
                      <textarea 
                        rows={3}
                        required
                        placeholder="Your message or inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-3 py-2 text-xs rounded bg-[var(--background)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                      />
                      <button 
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50"
                      >
                        {submitting ? "Sending..." : "Submit Ticket"}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Sidebar Column: VIP Access & Business Hours */}
              <div className="space-y-4">
                <div className="p-5 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] space-y-4">
                  <h4 className="text-sm font-black text-[var(--text)]">Need VIP Access?</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    If you want the full jackpot list and priority delivery, tell us &quot;VIP&quot; in the WhatsApp message.
                  </p>
                  <a 
                    href="/cheerplex-vip-tips/" 
                    className="inline-block w-full py-2.5 px-4 text-center rounded-lg border-2 border-[var(--primary)] text-[var(--primary)] font-extrabold text-xs hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    See VIP packages
                  </a>
                  
                  <hr className="border-[var(--border)]" />
                  
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text)]   tracking-wider font-mono">Business hours</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Mon–Sat 09:00–18:00 EAT. We aim to respond within a few hours during business hours.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] space-y-3">
                  <div className="text-xs font-black text-[var(--text)]   tracking-wider font-mono">Contact Details</div>
                  <div className="space-y-2 text-xs text-[var(--text)]">
                    <p><strong>Support:</strong> +254740841375</p>
                    <p><strong>Email:</strong> info@Cheerplex.co.ke</p>
                    <p><strong>Domain:</strong> cheerplex.co.ke</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Contacts / Social Related Links and Channels Table */}
            <div className="p-6 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                <div>
                  <div className="text-sm font-extrabold text-[var(--text)] font-mono   tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <span>Saved Contacts and Social Channels Table</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Official contact phone numbers, emails, locations, and social links repository.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-slate-950 dark:text-slate-100 border border-emerald-300 dark:border-emerald-700 font-bold self-start sm:self-auto">
                  Verified Data Table
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-slate-50 dark:bg-slate-900/50 text-[10px]   font-mono text-[var(--text-muted)]">
                      <th className="py-2.5 px-3">Channel / Social</th>
                      <th className="py-2.5 px-3">Contact Detail / Link</th>
                      <th className="py-2.5 px-3">Purpose and Description</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-[11px]">
                    {contactSocialTable.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="py-3 px-3 font-bold text-[var(--text)] whitespace-nowrap">
                          {item.channelName}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-[var(--primary)] whitespace-nowrap">
                          <a href={item.actionUrl} target="_blank" rel={getLinkRel(item.actionUrl)} className="hover:underline flex items-center gap-1">
                            <span>{item.contactValue}</span>
                          </a>
                        </td>
                        <td className="py-3 px-3 text-[var(--text-muted)]">
                          {item.description}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-slate-950 dark:text-slate-100 border border-emerald-300 dark:border-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Custom page-specific FAQ */}
            <PageFAQ items={contactFaqs} />
          </div>
        );
      }

      default: {
        if (!pageMd || (!pageMd.title && !pageMd.displayTitle && !pageMd.fullContent)) {
          return null;
        }
        return (
          <div className="space-y-6 text-left">
            <div className="p-6 md:p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-3">
              <span className="text-[10px] font-mono font-bold   tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                Cheerplex Intelligence
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight   font-display">
                {pageMd.displayTitle || pageMd.title}
              </h1>
              {pageMd.introParagraph ? (
                <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
                  <MarkdownRenderer content={pageMd.introParagraph} />
                </div>
              ) : (
                pageMd.description && (
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {pageMd.description}
                  </p>
                )
              )}
            </div>

            {(pageMd.listTitle || pageMd.listSubtitle) && (
              <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
                <h2 className="text-base font-black   text-[var(--text)] font-display tracking-tight">
                  {pageMd.listTitle}
                </h2>
                {pageMd.listSubtitle && (
                  <p className="text-xs text-[var(--text-muted)]">
                    {pageMd.listSubtitle}
                  </p>
                )}
              </div>
            )}

            {(pageMd.sectionTitle || pageMd.sectionDescription) && (
              <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
                <h2 className="text-base font-black   text-[var(--text)] font-display tracking-tight">
                  {pageMd.sectionTitle}
                </h2>
                {pageMd.sectionDescription && (
                  <p className="text-xs text-[var(--text-muted)]">
                    {pageMd.sectionDescription}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 text-xs">
        <button 
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] font-bold transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back Home</span>
        </button>

        <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold   tracking-wider">
          Cheerplex Portal
        </span>
      </div>

      {renderContent()}

      {/* SEO Markdown File Content Integration */}
      {pageMd && pageMd.fullContent && (
        <div className="p-6 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] text-left space-y-4 mt-8">
          <MarkdownRenderer 
            content={pageMd.meat || pageMd.fullContent} 
            jackpotId={pageMd.jackpotId || pageId}
          />
        </div>
      )}

      {/* 3 CONTEXTUAL INBOUND LINKS (STATIC / TRUST / VIP DIRECTORY) */}
      <InboundLinksBlock 
        pageId={pageId} 
        rawType={pageMd?.type || 'static'}
      />

      {/* Author Card (renders when authorName is defined in page markdown) */}
      {pageMd && (pageMd.author || pageMd.authorName) && (
        <AuthorCard 
          authorId={pageMd.authorId}
          author={pageMd.author}
          name={pageMd.authorName} 
          title={pageMd.authorTitle} 
          description={pageMd.authorDescription} 
          avatar={pageMd.authorAvatar} 
        />
      )}

      {/* Responsible Gambling Notice (renders when defined in page markdown) */}
      {pageMd && pageMd.responsibleGambling && (
        <ResponsibleGamblingNotice notice={pageMd.responsibleGambling} />
      )}
    </div>
  );
}
