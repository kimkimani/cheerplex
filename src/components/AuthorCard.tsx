import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap,
  MapPin,
  Calendar,
  UserCheck
} from 'lucide-react';
import { getAuthor, ParsedAuthor, AuthorBadge } from '../content/authorLoader';

export interface AuthorCardProps {
  authorId?: string;
  author?: ParsedAuthor;
  name?: string;
  title?: string;
  description?: string;
  avatar?: string;
  reviewerName?: string;
  reviewerTitle?: string;
  badges?: AuthorBadge[];
  lastUpdatedText?: string;
  compact?: boolean;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({
  authorId,
  author: providedAuthor,
  name,
  title,
  description,
  avatar,
  reviewerName,
  reviewerTitle,
  badges: customBadges,
  lastUpdatedText,
  compact = false
}) => {
  // Resolve full author object from author markdown loader or fallback
  const resolvedAuthor: ParsedAuthor | undefined = providedAuthor || (authorId || name ? getAuthor(authorId || name) : undefined);

  const displayName = name || resolvedAuthor?.name;
  if (!displayName) return null;

  const displayTitle = title || resolvedAuthor?.role || 'Lead Football Analyst';
  const displayDescription = description || resolvedAuthor?.shortBio;
  const displayAvatar = avatar || resolvedAuthor?.avatar;
  const displayReviewerName = reviewerName || resolvedAuthor?.reviewerName;
  const displayReviewerTitle = reviewerTitle || resolvedAuthor?.reviewerTitle;
  const displayCredentials = resolvedAuthor?.credentials;
  const displayExperience = resolvedAuthor?.experience;
  const displayBadges = customBadges && customBadges.length > 0 ? customBadges : (resolvedAuthor?.badges || []);

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <aside 
      aria-label={`Editorial profile: ${displayName}`}
      className="my-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4 sm:p-5 shadow-xs transition-colors text-left"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4">
        {/* Avatar or Minimal Monogram */}
        <div className="relative shrink-0">
          {displayAvatar ? (
            <img 
              src={displayAvatar} 
              alt={displayName}
              width={52}
              height={52}
              loading="lazy"
              decoding="async" 
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl object-cover border border-[var(--border)]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono font-black text-sm">
              {getInitials(displayName)}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-[var(--card)]">
            <CheckCircle2 className="w-3 h-3" />
          </div>
        </div>

        {/* Core Author Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-[var(--text)] tracking-tight m-0">
              {displayName}
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
              <ShieldCheck className="w-3 h-3" />
              Verified Analyst
            </span>
            {displayExperience && (
              <span className="text-[10px] font-mono text-[var(--text-muted)] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {displayExperience}
              </span>
            )}
          </div>

          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium m-0">
            {displayTitle}
          </p>

          {displayDescription && (
            <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2 pt-0.5 m-0 font-sans">
              {displayDescription}
            </p>
          )}

          {/* Minimalist Credentials / Badges Row */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {displayCredentials && (
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 px-2 py-0.5 rounded border border-[var(--border)]">
                {displayCredentials}
              </span>
            )}
            {displayBadges.slice(0, 2).map((badge, idx) => (
              <span 
                key={idx}
                className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 px-2 py-0.5 rounded border border-[var(--border)]"
              >
                {badge.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Peer Review Footer */}
      {(displayReviewerName || lastUpdatedText) && (
        <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono text-[var(--text-muted)]">
          {displayReviewerName && (
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                Audited by <strong className="text-[var(--text)]">{displayReviewerName}</strong>
                {displayReviewerTitle ? ` (${displayReviewerTitle})` : ''}
              </span>
            </div>
          )}

          {lastUpdatedText && (
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>{lastUpdatedText}</span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default AuthorCard;
