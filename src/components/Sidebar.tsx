import React from 'react';
import { 
  Trophy, 
  Crown, 
  Percent, 
  ShieldCheck, 
  TrendingUp, 
  X,
  ChevronRight,
  Flame,
  Calendar,
  MessageCircle,
  AlertTriangle,
  History
} from 'lucide-react';
import { VipPackage } from '../types';
import { getPageUrl } from '../utils/navigation';
import CheerplexLogo from './CheerplexLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  firstVipPackage?: VipPackage | null;
  onOpenPayment?: (pkgName: string, price: number, id: string | number, slug: string, type: 'vip' | 'jackpot' | 'odds') => void;
  activePage: string;
  onSelectPage: (pageId: string) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  activePage,
  onSelectPage
}: SidebarProps) {
  
  const handleNavClick = (pageId: string) => {
    onClose();
    if (pageId === 'odds-packs') {
      onSelectPage('home');
      requestAnimationFrame(() => {
        const el = document.getElementById('odds-packs');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      onSelectPage(pageId);
    }
  };

  const topJackpots = [
    { id: 'sportpesa-mega', name: 'SportPesa Mega Jackpot', games: '17 Games', prize: 'Ksh 385M', badge: 'Active' },
    { id: 'sportpesa-midweek', name: 'SportPesa Midweek', games: '13 Games', prize: 'Ksh 15M', badge: 'Active' },
    { id: 'betika-midweek', name: 'Betika Midweek JP', games: '15 Games', prize: 'Ksh 15M', badge: 'Midweek' },
    { id: 'mozzart-grand', name: 'Mozzart Grand JP', games: '20 Games', prize: 'Ksh 200M', badge: 'Active' },
    { id: 'mozzart-super-daily', name: 'Mozzart Super Daily', games: '16 Games', prize: 'Ksh 20M', badge: 'Daily' },
  ];

  const marketChannels = [
    { label: "Home Predictions", icon: TrendingUp, id: 'home', tag: "Live" },
    { label: "Today's Free Tips", icon: Flame, id: 'category-today', tag: "Hot" },
    { label: "Tomorrow's Tips", icon: Calendar, id: 'category-tomorrow', tag: "Pre-Match" },
    { label: "Yesterday's Results", icon: History, id: 'category-yesterday', tag: "Verified" },
    { label: "All Jackpots Hub", icon: Trophy, id: 'jackpot-list', tag: "Pools" },
    { label: "Decimal Odds Packs", icon: Percent, id: 'odds-packs', tag: "2+ & 5+" },
    { label: "Cheerplex VIP Club", icon: Crown, id: 'vip-packages', tag: "Join VIP" }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay with Smooth Blur */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-[3px] transition-opacity duration-300"
        />
      )}

      {/* Main Sidebar Wrapper */}
      <aside className={`
        fixed top-0 left-0 h-screen w-[320px] max-w-[85vw] flex-shrink-0 z-50 lg:hidden
        bg-[var(--card)] border-r border-[var(--border)] shadow-2xl
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Drawer Scrollable Content */}
        <div className="flex flex-col h-full overflow-y-auto scrollbar-none p-4 sm:p-5 space-y-5 text-left">
          {/* Header & Mobile Close Button */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <CheerplexLogo variant="emblem" size={30} className="shadow-xs" />
              <div 
                className="font-black text-base sm:text-lg tracking-tight text-[var(--text)] font-display"
              >
                CHEERPLEX<span className="text-blue-600 dark:text-blue-400 font-mono text-xs font-bold ml-1">.KE</span>
              </div>
            </div>

            <button 
              onClick={onClose}
              aria-label="Close menu drawer"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-slate-100 dark:hover:bg-slate-800 border-none bg-transparent cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Top Jackpots Quick Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold">
                Top Jackpots
              </span>
              <button 
                onClick={() => handleNavClick('jackpot-list')}
                className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {topJackpots.map((jp) => {
                const targetUrl = getPageUrl(jp.id);
                return (
                  <a
                    key={jp.id}
                    href={targetUrl}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault();
                        handleNavClick(jp.id);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-[var(--border)] hover:border-blue-400 transition-all flex items-center justify-between text-left cursor-pointer group no-underline"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                        <Trophy className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {jp.name}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)]">
                          {jp.games}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
                        {jp.prize}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation & Markets Group */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block">
              Predictions & Markets
            </span>
            <nav className="space-y-1">
              {marketChannels.map((item) => {
                const IconComponent = item.icon;
                const isActive = activePage === item.id;
                const targetUrl = getPageUrl(item.id);
                return (
                  <a
                    key={item.id}
                    href={targetUrl}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault();
                        handleNavClick(item.id);
                      }
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-all no-underline cursor-pointer border ${
                      isActive 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                        : 'border-transparent text-[var(--text)] hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {item.tag}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* WhatsApp Support Direct Button */}
          <div className="pt-2">
            <a
              href="https://wa.me/254740841375?text=Hello%20Cheerplex%20Support%2C%20I%20need%20assistance%20with%20predictions"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 no-underline transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>WhatsApp Support (0740841375)</span>
            </a>
          </div>

          {/* Trust Indicators Section */}
          <div className="border-t border-[var(--border)] pt-3.5 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Safaricom M-Pesa Instant Verification</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Responsible Gaming: Strictly 18+ Only</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
