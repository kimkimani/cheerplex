<?php
/**
 * Cheerplex - Official Pochi La Biashara Payment Modal Component
 * Matches React PaymentModal.tsx & Cheerplex GitHub repository 1:1
 */
$pochiPhoneNumber = '0740841375';
$pochiAccountName = 'CHEERPLEX';
?>
<div 
  id="paymentModalOverlay" 
  onclick="if(event.target === this) closePaymentModal()"
  class="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md hidden opacity-0 transition-opacity duration-200"
>
  <div 
    id="paymentModalCard" 
    role="dialog"
    aria-modal="true"
    class="w-full max-w-lg bg-[var(--card)] border border-[var(--border)] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-left relative transform scale-95 transition-all duration-200"
  >
    
    <!-- Top Header Terminal Bar - Cheerplex Themed -->
    <div class="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-blue-900/40">
      <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
          <?= renderIcon('smartphone', 'w-4 h-4 sm:w-5 sm:h-5 text-blue-400') ?>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-slate-100 font-display truncate">
              Lipa na M-Pesa • Pochi
            </span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
              Instant
            </span>
          </div>
          <p class="text-[10px] sm:text-[10.5px] text-slate-400 font-mono flex items-center gap-1 mt-0.5 truncate m-0">
            <?= renderIcon('shield-check', 'w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0') ?>
            <span>Cheerplex Official Merchant Terminal</span>
          </p>
        </div>
      </div>

      <button 
        type="button" 
        onclick="closePaymentModal()" 
        aria-label="Close modal"
        class="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700 active:scale-95 shrink-0 ml-2"
      >
        <?= renderIcon('x', 'w-4 h-4') ?>
      </button>
    </div>

    <!-- Selected Package Ledger Ribbon -->
    <div class="px-4 py-3 sm:px-5 sm:py-3.5 bg-blue-50/80 border-b border-[var(--border)] flex items-center justify-between gap-3">
      <div class="min-w-0 flex-1">
        <span id="modalPackageTypeLabel" class="text-[9.5px] font-mono uppercase tracking-wider text-blue-700 block font-bold truncate">
          VIP Access Pass
        </span>
        <div id="modalPackageName" class="text-xs sm:text-sm md:text-base font-black text-slate-900 truncate font-display mt-0.5">
          Cheerplex Premium VIP Slip
        </div>
      </div>
      <div class="text-right shrink-0">
        <span class="text-[9px] sm:text-[9.5px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
          Payable Amount
        </span>
        <div id="modalPackagePrice" class="text-base sm:text-lg md:text-xl font-black text-blue-600 font-mono tracking-tight tabular-nums">
          KES 150
        </div>
      </div>
    </div>

    <!-- Scrollable Modal Body -->
    <div class="p-3.5 sm:p-5 overflow-y-auto space-y-3 sm:space-y-4 text-xs">
      <!-- 1. POCHI LA BIASHARA PHONE CARD -->
      <div class="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-[var(--border)] shadow-xs space-y-3">
        <div class="flex items-center justify-between text-[11px] font-mono">
          <span class="font-bold uppercase text-blue-700 flex items-center gap-1.5">
            <?= renderIcon('badge-check', 'w-4 h-4 text-blue-600 shrink-0') ?>
            <span>Pochi La Biashara Number</span>
          </span>
          <span class="text-[10.5px] text-slate-500">
            Account: <strong class="text-slate-900 font-black"><?= e($pochiAccountName) ?></strong>
          </span>
        </div>

        <!-- Big Copyable Number Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-[var(--border)] shadow-xs">
          <div>
            <span class="text-[9px] font-mono text-slate-500 block uppercase font-bold tracking-wider">
              Safaricom Mobile (Pochi)
            </span>
            <div id="pochiPhoneDisplay" class="font-mono text-lg sm:text-xl font-black tracking-widest text-slate-900 tabular-nums mt-0.5">
              <?= e($pochiPhoneNumber) ?>
            </div>
          </div>

          <button
            type="button"
            id="btnCopyPochiNumber"
            onclick="copyPochiNumber('<?= e($pochiPhoneNumber) ?>')"
            class="min-h-[40px] px-4 py-2 sm:py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all active:scale-95 shadow-2xs shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <span id="copyPochiIcon"><?= renderIcon('copy', 'w-4 h-4 text-white') ?></span>
            <span id="copyPochiText">COPY NUMBER</span>
          </button>
        </div>

        <!-- Step-by-Step Payment Instructions -->
        <div class="p-3 rounded-xl bg-white border border-[var(--border)] space-y-2">
          <div class="text-[10.5px] font-mono font-bold uppercase text-slate-900 flex items-center gap-1.5">
            <?= renderIcon('zap', 'w-3.5 h-3.5 text-blue-600 shrink-0') ?>
            <span>Payment Steps (M-Pesa / SIM Toolkit / *334#):</span>
          </div>
          <ol class="space-y-1.5 text-[11px] font-mono text-slate-800 m-0 pl-0 list-none">
            <li class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Go to <strong>M-Pesa</strong> &gt; <strong>Lipa na M-Pesa</strong></span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Select <strong>Pochi La Biashara</strong></span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Enter Phone: <strong class="text-blue-600 font-black"><?= e($pochiPhoneNumber) ?></strong></span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">4</span>
              <span>Enter Amount: <strong id="modalStepAmount" class="text-blue-600 font-black">KES 150</strong></span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">5</span>
              <span>Enter <strong>M-Pesa PIN</strong></span>
            </li>
          </ol>
        </div>
      </div>

      <!-- ACTIONS: WHATSAPP RECEIPT FOR INSTANT UNLOCK -->
      <div id="paymentActionState" class="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-[var(--border)] space-y-2.5">
        <div class="flex items-center justify-between text-[11px] font-mono">
          <span class="font-bold uppercase text-slate-900 flex items-center gap-1.5">
            <?= renderIcon('zap', 'w-3.5 h-3.5 text-blue-600 shrink-0') ?>
            <span>Instant Verification:</span>
          </span>
          <span class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online 24/7</span>
          </span>
        </div>

        <a
          id="modalWhatsappLink"
          href="https://wa.me/254740841375"
          target="_blank"
          rel="nofollow noopener noreferrer"
          onclick="handlePaymentWhatsappClick()"
          class="min-h-[48px] w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-sm no-underline cursor-pointer transition-all border-none"
        >
          <?= renderIcon('message-circle', 'w-4 h-4 fill-white text-[#25D366] shrink-0') ?>
          <span>Send Receipt on WhatsApp</span>
          <?= renderIcon('external-link', 'w-3.5 h-3.5 text-white/80 shrink-0') ?>
        </a>

        <p class="text-[10.5px] text-center text-slate-500 font-mono leading-tight pt-0.5 m-0">
          Send your M-Pesa receipt to <strong><?= e($pochiPhoneNumber) ?></strong> for instant pass activation.
        </p>
      </div>

      <!-- SUCCESS STATE -->
      <div id="paymentSuccessState" class="hidden p-5 sm:p-6 rounded-2xl bg-blue-50 border-2 border-blue-600 text-center space-y-2.5">
        <div class="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
          <?= renderIcon('check-circle-2', 'w-7 h-7 text-white') ?>
        </div>
        <h3 class="text-sm font-bold text-blue-900 uppercase font-mono tracking-tight m-0">
          Payment Confirmed &amp; Unlocked!
        </h3>
        <p class="text-xs text-blue-800 font-mono m-0">
          Access to <strong id="modalSuccessPkgName">Cheerplex VIP</strong> is now unlocked. Loading your VIP selections...
        </p>
      </div>

      <!-- Security & Helpline Footer -->
      <div class="pt-2 border-t border-[var(--border)]">
        <div class="flex items-center justify-between text-[10px] sm:text-[10.5px] font-mono text-slate-500 px-1">
          <span class="flex items-center gap-1">
            <?= renderIcon('lock', 'w-3 h-3 text-blue-600 shrink-0') ?>
            <span>256-Bit SSL Encrypted</span>
          </span>
          <a 
            href="tel:<?= e($pochiPhoneNumber) ?>"
            class="hover:text-blue-600 transition-colors flex items-center gap-1 text-slate-900 font-semibold no-underline"
          >
            <?= renderIcon('phone-call', 'w-3 h-3 text-blue-500 shrink-0') ?>
            <span>Helpline: <?= e($pochiPhoneNumber) ?></span>
          </a>
        </div>
      </div>
    </div>

  </div>
</div>

