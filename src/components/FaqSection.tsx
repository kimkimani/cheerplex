import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MessageCircle } from 'lucide-react';
import { getMarkdownContent } from '../content/markdownLoader';
import { getDefaultFaqsForPage, FaqItem } from '../utils/defaultFaqs';
import MarkdownRenderer from './MarkdownRenderer';

interface FaqSectionProps {
  pageId?: string;
  customTitle?: string;
  customDescription?: string;
}

export default function FaqSection({ 
  pageId = 'faq',
  customTitle,
  customDescription = 'Got questions about predictions, M-Pesa payments, or VIP packages? Find quick answers below.'
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const pageMd = useMemo(() => getMarkdownContent(pageId), [pageId]);

  // Parse ### Question and following lines into structured FAQ items or use per-page defaults
  const faqItems = useMemo<FaqItem[]>(() => {
    const rawFaq = pageMd.faq || '';
    if (rawFaq.trim().length > 0) {
      const items: FaqItem[] = [];
      const lines = rawFaq.split('\n');

      let currentQuestion = '';
      let currentAnswerLines: string[] = [];

      for (const line of lines) {
        const headingMatch = line.match(/^#{3,4}\s+(.+)$/) || line.match(/^\*\*(?:Q:\s*|Question:\s*)([^*]+)\*\*/i);
        if (headingMatch) {
          if (currentQuestion) {
            items.push({
              question: currentQuestion,
              answer: currentAnswerLines.join('\n').trim()
            });
            currentAnswerLines = [];
          }
          currentQuestion = headingMatch[1].replace(/^(q:\s*|question:\s*)/i, '').trim();
        } else if (currentQuestion) {
          if (!line.match(/^\s*##\s+/)) {
            currentAnswerLines.push(line);
          }
        }
      }

      if (currentQuestion) {
        items.push({
          question: currentQuestion,
          answer: currentAnswerLines.join('\n').trim()
        });
      }

      if (items.length > 0) return items;
    }

    // Unique per-page fallback if markdown doesn't have an explicit <!-- FAQ --> section
    return getDefaultFaqsForPage(pageId);
  }, [pageMd, pageId]);

  const displayTitle = useMemo(() => {
    if (customTitle) return customTitle;
    if (pageMd.faqTitle) return pageMd.faqTitle;
    if (pageMd.faqHeading) return pageMd.faqHeading;
    if (pageMd.title) {
      const shortTitle = pageMd.title.split('-')[0].trim().replace(/^#+\s*/, '');
      return `${shortTitle} - FAQ`;
    }
    return 'Frequently Asked Questions (FAQ)';
  }, [customTitle, pageMd]);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="p-5 md:p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)] text-left space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-extrabold uppercase text-[var(--text)] tracking-tight font-mono">
              {displayTitle}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] font-normal font-sans">
              {customDescription}
            </p>
          </div>
        </div>

      </div>

      {/* Structured Accordions or Markdown Renderer fallback */}
      {faqItems.length > 0 ? (
        <div className="space-y-2.5">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className={`rounded-xl border transition-all duration-150 overflow-hidden ${
                  isOpen 
                    ? 'border-blue-300 dark:border-blue-700 bg-blue-500/[0.02] shadow-xs' 
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  aria-label={`Toggle answer for question: ${item.question}`}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left bg-transparent border-none cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                      Q{idx + 1}.
                    </span>
                    <h3 className="text-xs md:text-sm font-semibold text-[var(--text)] leading-snug m-0">
                      {item.question}
                    </h3>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
                </button>

                {isOpen && (
                  <div 
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-label={`Answer for ${item.question}`}
                    className="px-4 pb-4 text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] mt-1 pt-3 font-sans"
                  >
                    <MarkdownRenderer content={item.answer} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Direct markdown fallback if no structured headers were detected */
        <div className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
          <MarkdownRenderer content={pageMd.faq || pageMd.fullContent} />
        </div>
      )}

      {/* Contact Quick Link */}
      <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--text-muted)] border-t border-[var(--border)]">
        <span className="flex items-center gap-1.5 font-sans">
          <MessageCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Have another question?
        </span>
        <a 
          href="/contact-us"
          className="text-blue-600 dark:text-blue-400 hover:underline font-bold font-mono text-[10px] uppercase"
        >
          Contact Customer Support &rarr;
        </a>
      </div>
    </section>
  );
}
