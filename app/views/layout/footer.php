<?php
/**
 * Cheerplex - Master Footer Layout Template
 * Matches React App.tsx footer & layout endings exactly
 */
global $SITE_CONTACTS;
$currentPage = $pageId ?? 'home';
$externalLinks = getExternalLinks();
?>
      </main>

      <!-- RIGHT SIDEBAR PANEL -->
      <aside class="w-full lg:w-[320px] flex-shrink-0 space-y-6">
        <?php 
          $isJackpotPage = in_array($currentPage, ['jackpot-list', 'sportpesa-mega', 'sportpesa-midweek', 'betika-midweek', 'mozzart-grand', 'mozzart-super-daily']);
          if ($isJackpotPage) {
              include __DIR__ . '/../components/jackpot_sidebar.php';
          } else {
              include __DIR__ . '/../components/predictions_sidebar.php';
              include __DIR__ . '/../components/live_updates.php';
          }
        ?>
      </aside>

    </div>
  </div>

  <!-- INTERACTIVE FLOOR TOAST ALERTS -->
  <div id="floorToast" class="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white shadow-xl text-xs flex items-center gap-2 transition-all duration-300 hidden opacity-0">
    <div class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
    <span id="floorToastText">Toast message</span>
  </div>

  <!-- FLOATING WHATSAPP BUTTON -->
  <div class="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
    <a 
      href="https://wa.me/254740841375?text=Hello%20Cheerplex%20Support%2C%20I%20need%20today%20tips" 
      target="_blank" 
      rel="nofollow noopener noreferrer"
      aria-label="Chat with Cheerplex support on WhatsApp"
      title="Contact WhatsApp Support"
      class="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 no-underline"
    >
      <svg class="w-6 h-6 fill-current" width="24" height="24" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.925 9.925 0 0012.012 2zm0 2c2.133 0 4.14.83 5.648 2.338a7.935 7.935 0 012.338 5.646c-.001 4.41-3.587 7.996-7.996 7.996h-.003a7.936 7.936 0 01-3.801-.973l-.272-.162-2.825.668.683-2.756-.178-.283a7.938 7.938 0 01-1.213-4.184c0-4.409 3.586-7.994 7.995-7.994zm-3.084 4.5c-.171 0-.447.064-.681.318-.233.255-.892.871-.892 2.124 0 1.253.913 2.463 1.04 2.633.128.17 1.796 2.742 4.352 3.846 2.124.918 2.557.735 3.024.693.467-.043 1.508-.616 1.72-1.21.212-.595.212-1.105.148-1.211-.063-.106-.233-.17-.488-.297-.255-.127-1.508-.743-1.741-.828-.233-.085-.403-.127-.573.128-.17.254-.658.828-.807 1.002-.149.173-.297.191-.552.064-.255-.128-1.077-.397-2.052-1.266-.759-.677-1.272-1.513-1.421-1.768-.149-.255-.016-.393.111-.52.115-.114.255-.297.382-.446.128-.149.17-.255.255-.425.085-.17.043-.318-.021-.446-.064-.127-.573-1.381-.786-1.89-.207-.496-.418-.429-.573-.437-.149-.008-.318-.008-.488-.008z" />
      </svg>
    </a>
  </div>

  <!-- CHEERPLEX FOOTER -->
  <footer class="mt-20 border-t border-[var(--border)] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-slate-300 py-14 pb-28 md:pb-14 text-xs transition-colors duration-300 relative overflow-hidden text-left">
    <!-- Subtle background grid -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
      
      <!-- Main 4-Column Directory Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-left">
        
        <!-- Column 1: Cheerplex Sports Intelligence Core -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <?= renderCheerplexLogo('emblem', 42, 'shadow-md') ?>
            <div class="flex flex-col">
              <span class="font-black text-lg text-white tracking-tight flex items-center gap-1.5 font-display">
                CHEER<span class="text-blue-400">PLEX</span>
              </span>
              <span class="text-[9.5px] text-slate-400 font-mono tracking-wider">
                Your Best Sports Lab • Nairobi
              </span>
            </div>
          </div>

          <p class="leading-relaxed text-slate-400 text-xs m-0">
            Providing accurate betting predictions and tips for major jackpots and matches worldwide. Trust our experts for your betting success.
          </p>

          <!-- Direct Support & Hotline Badges -->
          <div class="pt-2 space-y-2">
            <span class="text-[10px] font-mono tracking-wider text-slate-400 font-bold block">
              Verified Dispatch Channels:
            </span>
            <div class="flex flex-wrap items-center gap-2">
              <a 
                href="https://wa.me/254740841375?text=Hello%20Cheerplex%20Support%2C%20I%20need%20today%20tips" 
                target="_blank" 
                rel="nofollow noopener noreferrer" 
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] font-bold hover:bg-emerald-900 transition-all no-underline" 
                title="WhatsApp VIP Hotline"
              >
                <?= renderIcon('message-square', 'w-3.5 h-3.5 text-emerald-400') ?>
                <span>WhatsApp 24/7</span>
              </a>
              <a 
                href="https://t.me/cheerplex" 
                target="_blank" 
                rel="nofollow noopener noreferrer" 
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/80 text-sky-300 border border-sky-800/60 font-mono text-[11px] font-bold hover:bg-sky-900 transition-all no-underline" 
                title="Telegram VIP Channel"
              >
                <?= renderIcon('send', 'w-3.5 h-3.5 text-sky-400') ?>
                <span>Telegram</span>
              </a>
              <a 
                href="<?= getPageUrl('contact') ?>"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-200 border border-slate-700 font-mono text-[11px] font-bold hover:bg-slate-700 transition-all no-underline cursor-pointer" 
                title="Contact Support Desk"
              >
                <?= renderIcon('mail', 'w-3.5 h-3.5 text-slate-300') ?>
                <span>Support</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Column 2: Mathematical Markets Directory -->
        <div class="space-y-3">
          <strong class="text-white block text-xs font-black tracking-wider font-mono border-b border-slate-800 pb-2">
            Mathematical Predictions
          </strong>
          <div class="flex flex-col gap-1.5 font-medium text-xs">
            <a href="<?= getPageUrl('category-today') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>Today's Banker Predictions</span>
              <span class="text-[10px] font-mono text-emerald-400">Live</span>
            </a>
            <a href="<?= getPageUrl('category-tomorrow') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>Tomorrow's Early Lines</span>
              <span class="text-[10px] font-mono text-slate-500">Early</span>
            </a>
            <a href="<?= getPageUrl('category-yesterday') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>Yesterday's Verified Archive</span>
              <span class="text-[10px] font-mono text-slate-500">Results</span>
            </a>
            <a href="/cheerplex-sure-tips-and-odds/" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>Target Decimal Odds Slips</span>
              <span class="text-[10px] font-mono text-amber-400">2x - 10x</span>
            </a>
            <a href="<?= getPageUrl('cheerplex-free-predictions-and-tips') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>Cheerplex Betting Tips</span>
              <span class="text-[10px] font-mono text-cyan-400">Picks</span>
            </a>
            <a href="<?= getPageUrl('vip-packages') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>Cheerplex VIP Packages</span>
              <span class="text-[10px] font-mono text-amber-300">Join VIP</span>
            </a>
          </div>
        </div>

        <!-- Column 3: Kenyan Jackpot Pools Directory -->
        <div class="space-y-3">
          <strong class="text-white block text-xs font-black tracking-wider font-mono border-b border-slate-800 pb-2">
            Kenyan Jackpot Pools
          </strong>
          <div class="flex flex-col gap-1.5 font-medium text-xs">
            <a href="<?= getPageUrl('sportpesa-mega') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>SportPesa Mega (17 Games)</span>
              <span class="text-[10px] font-mono text-emerald-400">Ksh 385M</span>
            </a>
            <a href="<?= getPageUrl('sportpesa-midweek') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>SportPesa Midweek (13 Games)</span>
              <span class="text-[10px] font-mono text-blue-400">Ksh 15M</span>
            </a>
            <a href="<?= getPageUrl('betika-midweek') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>Betika Midweek (15 Games)</span>
              <span class="text-[10px] font-mono text-blue-400">Ksh 15M</span>
            </a>
            <a href="<?= getPageUrl('mozzart-grand') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>Mozzart Grand (20 Games)</span>
              <span class="text-[10px] font-mono text-emerald-400">Ksh 200M</span>
            </a>
            <a href="<?= getPageUrl('mozzart-super-daily') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>Mozzart Super Daily (16 Games)</span>
              <span class="text-[10px] font-mono text-emerald-400">Ksh 20M</span>
            </a>
            <a href="<?= getPageUrl('cheerplex-mega-jackpot-prediction') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>Cheerplex Mega Jackpot</span>
              <span class="text-[10px] font-mono text-amber-400">Tips</span>
            </a>
            <a href="<?= getPageUrl('cheerplex-sportpesa-jackpot-prediction') ?>" class="py-1 text-slate-400 hover:text-blue-400 transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>SportPesa Jackpot Prediction</span>
              <span class="text-[10px] font-mono text-emerald-400">17 & 13</span>
            </a>
            <a href="<?= getPageUrl('jackpot-list') ?>" class="py-1 text-blue-400 font-bold hover:underline transition-colors no-underline cursor-pointer flex items-center justify-between">
              <span>View All Jackpot Pools →</span>
            </a>
          </div>
        </div>

        <!-- Column 4: Compliance, Security & Player Protection -->
        <div class="space-y-3">
          <strong class="text-white block text-xs font-black tracking-wider font-mono border-b border-slate-800 pb-2">
            Integrity & Compliance
          </strong>
          <p class="leading-relaxed text-[11px] text-slate-400 m-0">
            Betting involves risk. Please gamble responsibly and only bet what you can afford to lose. Our predictions are not guaranteed success. Must be 18+ to participate in betting.
          </p>
          <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[10.5px]">
            <div class="flex items-center justify-between text-slate-300">
              <span>Gambling Helpline:</span>
              <strong class="text-rose-400">0800 720 000</strong>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span>M-Pesa Pochi:</span>
              <strong class="text-emerald-400">0740841375</strong>
            </div>
          </div>

          <div class="pt-1">
            <a 
              href="<?= getPageUrl('responsible-gambling') ?>"
              class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[10.5px] font-mono font-bold tracking-wider border border-rose-800/80 transition-all no-underline cursor-pointer"
            >
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>Responsible Play Advisory</span>
            </a>
          </div>
        </div>

      </div>

      <!-- External Links Bar -->
      <div id="footer-external-links" class="pt-8 border-t border-slate-800/80">
        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-x-3.5 gap-y-2 text-xs">
          <?php foreach ($externalLinks as $idx => $link): ?>
            <span class="inline-flex items-center gap-3.5">
              <a
                href="<?= e($link['url']) ?>"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-slate-300 hover:text-blue-400 transition-colors no-underline hover:underline"
              >
                <?= e($link['anchorText']) ?>
              </a>
              <?php if ($idx < count($externalLinks) - 1): ?>
                <span class="text-slate-700 select-none">•</span>
              <?php endif; ?>
            </span>
          <?php endforeach; ?>
        </div>
      </div>

      <!-- Bottom Legal Copyright & Links Row -->
      <div class="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <div class="font-mono text-[11px] text-center md:text-left text-slate-400">
          © 2026 CHEERPLEX SPORTS . All rights reserved.
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3 font-mono font-bold text-[11px]">
          <a href="<?= getPageUrl('contact') ?>" class="hover:text-blue-400 text-slate-300 no-underline cursor-pointer">
            Contact
          </a>
          <span class="text-slate-700 select-none">•</span>
          <a href="<?= getPageUrl('responsible-gambling') ?>" class="hover:text-blue-400 text-slate-300 no-underline cursor-pointer">
            Responsible Gambling
          </a>
          <span class="text-slate-700 select-none">•</span>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" class="hover:text-blue-400 text-slate-300 no-underline">
            XML Sitemap
          </a>
        </div>
      </div>

    </div>
  </footer>

  <!-- MINIMALIST MOBILE BOTTOM NAVIGATION BAR -->
  <nav 
    aria-label="Mobile Bottom Navigation" 
    class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--border)] lg:hidden px-3 py-1.5 shadow-lg transition-colors"
  >
    <div class="grid grid-cols-4 items-center justify-around max-w-md mx-auto">
      <!-- 1. Mega JP -->
      <a
        href="<?= getPageUrl('sportpesa-mega') ?>"
        aria-label="SportPesa Mega Jackpot Predictions"
        class="flex flex-col items-center justify-center py-1.5 px-1 transition-colors no-underline touch-manipulation <?= $currentPage === 'sportpesa-mega' ? 'text-amber-700 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
      >
        <?= renderIcon('trophy', 'w-5 h-5 ' . ($currentPage === 'sportpesa-mega' ? 'text-amber-600' : 'text-slate-500')) ?>
        <span class="text-[10px] mt-0.5 tracking-tight font-mono font-bold">Mega JP</span>
      </a>

      <!-- 2. Midweek -->
      <a
        href="<?= getPageUrl('sportpesa-midweek') ?>"
        aria-label="Midweek Jackpot Predictions"
        class="flex flex-col items-center justify-center py-1.5 px-1 transition-colors no-underline touch-manipulation <?= in_array($currentPage, ['sportpesa-midweek', 'betika-midweek']) ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
      >
        <?= renderIcon('flame', 'w-5 h-5 ' . (in_array($currentPage, ['sportpesa-midweek', 'betika-midweek']) ? 'text-rose-600' : 'text-slate-500')) ?>
        <span class="text-[10px] mt-0.5 tracking-tight font-mono font-bold">Midweek</span>
      </a>

      <!-- 3. VIP -->
      <a
        href="<?= getPageUrl('vip-packages') ?>"
        aria-label="Cheerplex VIP Club Packages"
        class="flex flex-col items-center justify-center py-1.5 px-1 transition-colors no-underline touch-manipulation <?= in_array($currentPage, ['vip-packages', 'vip']) ? 'text-amber-700 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
      >
        <?= renderIcon('crown', 'w-5 h-5 ' . (in_array($currentPage, ['vip-packages', 'vip']) ? 'text-amber-600' : 'text-slate-500')) ?>
        <span class="text-[10px] mt-0.5 tracking-tight font-mono font-bold">VIP</span>
      </a>

      <!-- 4. Odd Packs -->
      <a
        href="/cheerplex-sure-tips-and-odds/"
        aria-label="Cheerplex Sure Tips & Decimal Odds Packs"
        class="flex flex-col items-center justify-center py-1.5 px-1 transition-colors no-underline touch-manipulation <?= ($currentPage === 'cheerplex-sure-tips-and-odds') ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900' ?>"
      >
        <?= renderIcon('layers', 'w-5 h-5 ' . ($currentPage === 'cheerplex-sure-tips-and-odds' ? 'text-blue-600' : 'text-slate-500')) ?>
        <span class="text-[10px] mt-0.5 tracking-tight font-mono font-bold">Odd Packs</span>
      </a>
    </div>
  </nav>

  <!-- INTERACTIVE SAFARICOM M-PESA STK MODAL -->
  <?php include __DIR__ . '/modal_payment.php'; ?>

  <!-- App Client-Side Interactivity Script (Deferred for Performance) -->
  <script defer src="/public/js/app.js"></script>

</body>
</html>
