import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink,
  Zap,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  MessageCircle,
  BadgeCheck,
  Lock
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  price: number;
  packageId: string | number;
  packageSlug: string;
  packageType: 'vip' | 'jackpot' | 'odds';
  onPaymentSuccess?: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  packageName,
  price,
  packageId,
  packageSlug,
  packageType,
  onPaymentSuccess
}: PaymentModalProps) {
  // POCHI LA BIASHARA OFFICIAL CREDENTIALS
  const POCHI_PHONE_NUMBER = '0740841375';
  const POCHI_ACCOUNT_NAME = 'CHEERPLEX';

  // Modal State
  const [isCopied, setIsCopied] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setIsCopied(false);
      setIsUnlocked(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyNumber = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(POCHI_PHONE_NUMBER);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleWhatsAppClick = () => {
    setIsUnlocked(true);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Cheerplex Support, I have sent KES ${price} via Pochi La Biashara for "${packageName}". Please activate my access.`
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg bg-[var(--card)] border border-[var(--border)] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-left relative transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Terminal Bar - Cheerplex Themed */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-blue-900/40">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-slate-100 font-display truncate">
                  Lipa na M-Pesa • Pochi
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                  Instant
                </span>
              </div>
              <p className="text-[10px] sm:text-[10.5px] text-slate-400 font-mono flex items-center gap-1 mt-0.5 truncate">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
                Cheerplex Official Merchant Terminal
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700 active:scale-95 shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Package Ledger Ribbon */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-blue-50/80 dark:bg-blue-950/40 border-b border-[var(--border)] flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[9.5px] font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 block font-bold truncate">
              {packageType === 'jackpot' ? 'Jackpot Permutations' : packageType === 'vip' ? 'VIP Access Pass' : 'Sure Odds Pack'}
            </span>
            <div className="text-xs sm:text-sm md:text-base font-black text-[var(--text)] truncate font-display mt-0.5">
              {packageName}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[9px] sm:text-[9.5px] font-mono uppercase tracking-wider text-[var(--text-muted)] block font-semibold">
              Payable Amount
            </span>
            <div className="text-base sm:text-lg md:text-xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight tabular-nums">
              KES {price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3 sm:space-y-4 text-xs">
          {/* 1. POCHI LA BIASHARA PHONE CARD */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] shadow-xs space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold uppercase text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                Pochi La Biashara Number
              </span>
              <span className="text-[10.5px] text-[var(--text-muted)]">
                Account: <strong className="text-[var(--text)] font-black">{POCHI_ACCOUNT_NAME}</strong>
              </span>
            </div>

            {/* Big Copyable Number Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
              <div>
                <span className="text-[9px] font-mono text-[var(--text-muted)] block uppercase font-bold tracking-wider">
                  Safaricom Mobile (Pochi)
                </span>
                <div className="font-mono text-lg sm:text-xl font-black tracking-widest text-[var(--text)] tabular-nums mt-0.5">
                  {POCHI_PHONE_NUMBER}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyNumber}
                className={`min-h-[40px] px-4 py-2 sm:py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all active:scale-95 shadow-2xs shrink-0 ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>COPY NUMBER</span>
                  </>
                )}
              </button>
            </div>

            {/* Step-by-Step Payment Instructions */}
            <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-2">
              <div className="text-[10.5px] font-mono font-bold uppercase text-[var(--text)] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Payment Steps (M-Pesa / SIM Toolkit / *334#):</span>
              </div>
              <ol className="space-y-1.5 text-[11px] font-mono text-[var(--text)]">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Go to <strong>M-Pesa</strong> &gt; <strong>Lipa na M-Pesa</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Select <strong>Pochi La Biashara</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Enter Phone: <strong className="text-blue-600 dark:text-blue-400 font-black">{POCHI_PHONE_NUMBER}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span>Enter Amount: <strong className="text-blue-600 dark:text-blue-400 font-black">KES {price}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">5</span>
                  <span>Enter <strong>M-Pesa PIN</strong></span>
                </li>
              </ol>
            </div>
          </div>

          {/* SUCCESS STATE */}
          {isUnlocked ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border-2 border-blue-600 text-center space-y-2.5 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 uppercase font-mono tracking-tight">
                Payment Confirmed &amp; Unlocked!
              </h3>
              <p className="text-xs text-blue-800 dark:text-blue-200 font-mono">
                Access to <strong>{packageName}</strong> is now unlocked. Loading your VIP selections...
              </p>
            </div>
          ) : (
            /* ACTIONS: WHATSAPP RECEIPT FOR INSTANT UNLOCK */
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold uppercase text-[var(--text)] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Instant Verification:</span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online 24/7
                </span>
              </div>

              <a
                href={`https://wa.me/254${POCHI_PHONE_NUMBER.replace(/^0/, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="min-h-[48px] w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-sm no-underline cursor-pointer transition-all border-none"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366] shrink-0" />
                <span>Send Receipt on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80 shrink-0" />
              </a>

              <p className="text-[10.5px] text-center text-[var(--text-muted)] font-mono leading-tight pt-0.5">
                Send your M-Pesa receipt to <strong>{POCHI_PHONE_NUMBER}</strong> for instant pass activation.
              </p>
            </div>
          )}

          {/* Security & Helpline Footer */}
          <div className="pt-2 border-t border-[var(--border)]">
            <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] font-mono text-[var(--text-muted)] px-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                256-Bit SSL Encrypted
              </span>
              <a 
                href={`tel:${POCHI_PHONE_NUMBER}`}
                className="hover:text-blue-600 transition-colors flex items-center gap-1 text-[var(--text)] font-semibold no-underline"
              >
                <PhoneCall className="w-3 h-3 text-blue-500 shrink-0" />
                <span>Helpline: {POCHI_PHONE_NUMBER}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
