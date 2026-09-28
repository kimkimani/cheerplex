import React from 'react';
import { 
  Sparkles, 
  Trophy, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight
} from 'lucide-react';
import { getInboundLinks } from '../utils/inboundLinks';
import { getMarkdownContent } from '../content/markdownLoader';

interface InboundLinksBlockProps {
  pageId: string;
  rawType?: string;
  jackpotId?: string;
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  onSelectPage?: (pageId: string) => void;
  className?: string;
}

export default function InboundLinksBlock({
  pageId,
  rawType,
  jackpotId,
  customTitle,
  customSubtitle,
  customBadge,
  onSelectPage,
  className = ''
}: InboundLinksBlockProps) {
  let mdInboundTitle: string | undefined = customTitle;
  let mdInboundSubtitle: string | undefined = customSubtitle;
  let mdInboundBadge: string | undefined = customBadge;

  try {
    const md = getMarkdownContent(pageId);
    if (!mdInboundTitle) {
      mdInboundTitle = md.inboundTitle || md.inboundHeading;
    }
    if (!mdInboundSubtitle) {
      mdInboundSubtitle = md.inboundDescription || md.inboundSubtitle;
    }
    if (!mdInboundBadge) {
      mdInboundBadge = md.inboundBadge;
    }
  } catch (e) {}

  const group = getInboundLinks(pageId, rawType, jackpotId, {
    title: mdInboundTitle,
    subtitle: mdInboundSubtitle,
    badgeText: mdInboundBadge
  });

  if (!group || !group.links || group.links.length === 0) {
    return null;
  }

  const getHeaderBadge = () => {
    const defaultBadge = group.badgeText;
    switch (group.type) {
      case 'competitor':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
          badgeText: defaultBadge || 'Alternative Portals',
          badgeClass: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
          accentColor: 'border-purple-200 dark:border-purple-800/60 hover:border-purple-500',
          tagBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
          arrowColor: 'text-purple-600 dark:text-purple-400'
        };
      case 'jackpot':
        return {
          icon: <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          badgeText: defaultBadge || 'Major Kenyan Pools',
          badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
          accentColor: 'border-amber-200 dark:border-amber-800/60 hover:border-amber-500',
          tagBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
          arrowColor: 'text-amber-600 dark:text-amber-400'
        };
      case 'category':
        return {
          icon: <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
          badgeText: defaultBadge || 'Market Angles',
          badgeClass: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
          accentColor: 'border-blue-200 dark:border-blue-800/60 hover:border-blue-500',
          tagBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
          arrowColor: 'text-blue-600 dark:text-blue-400'
        };
      default:
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
          badgeText: defaultBadge || 'Platform & Trust',
          badgeClass: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
          accentColor: 'border-blue-200 dark:border-blue-800/60 hover:border-blue-500',
          tagBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          arrowColor: 'text-blue-600 dark:text-blue-400'
        };
    }
  };

  const styling = getHeaderBadge();

  return (
    <section 
      id={`inbound-links-${pageId}`} 
      aria-label={group.sectionTitle}
      className={`p-5 md:p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-left space-y-4 ${className}`}
    >
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${styling.badgeClass}`}>
              {styling.icon}
              {styling.badgeText}
            </span>
          </div>
          <h2 
            className="text-sm sm:text-base font-black text-[var(--text)] tracking-tight uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {group.sectionTitle}
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-2xl font-medium">
            {group.sectionSubtitle}
          </p>
        </div>
      </div>

      {/* 3 INBOUND LINK CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
        {group.links.map((item) => (
          <a
            key={item.id}
            id={`inbound-link-card-${item.id}`}
            href={item.url}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                if (onSelectPage) {
                  e.preventDefault();
                  onSelectPage(item.id);
                }
              }
            }}
            className="group relative flex flex-col justify-between p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-blue-500 hover:shadow-xs transition-all no-underline cursor-pointer min-h-[44px]"
          >
            {/* Top row: Icon and Tag */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xl" role="img" aria-label={item.title}>
                  {item.icon}
                </span>
                <span className={`text-[9.5px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border truncate ${styling.tagBg}`}>
                  {item.tag}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <div className="text-xs sm:text-sm font-black text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase font-mono tracking-tight leading-snug">
                  {item.title}
                </div>
                <p className="text-[11.5px] text-[var(--text-muted)] mt-1.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-bold uppercase font-mono min-h-[36px]">
              <span className={`flex items-center gap-1 group-hover:underline ${styling.arrowColor}`}>
                <span>Explore Guide</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
