<?php
/**
 * Cheerplex - Contact Us Page View
 */
global $SITE_CONTACTS;
?>
<section class="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs text-left space-y-4">
  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
    <span>Cheerplex Support</span>
  </div>
  <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
    Contact Customer Care &amp; Support
  </h1>
  <p class="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
    Get in touch with the Cheerplex sports analytics and subscriber billing desk in Nairobi, Kenya. We assist with M-Pesa STK push queries, VIP access activation, and algorithm methodology.
  </p>
</section>

<!-- Direct Hotline & Ticketing Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
  
  <!-- Direct Hotline Card -->
  <div class="p-6 rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white border border-blue-500/30 shadow-md space-y-4 flex flex-col justify-between">
    <div class="space-y-3">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/20 font-mono text-[10px] font-bold">
        <span>Instant Hotline</span>
      </div>
      <h3 class="text-xl font-black tracking-tight font-display text-white">
        Direct VIP Assistance Line
      </h3>
      <p class="text-xs text-slate-300 leading-relaxed">
        Speak directly with our senior sports analysts or request manual confirmation for your Safaricom M-Pesa transaction.
      </p>

      <div class="space-y-2 pt-2 font-mono text-xs">
        <div class="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
          <span class="text-slate-300">Hotline Phone:</span>
          <strong class="text-white font-bold"><?= e($SITE_CONTACTS['phone']) ?></strong>
        </div>
        <div class="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
          <span class="text-slate-300">WhatsApp Desk:</span>
          <strong class="text-emerald-400 font-bold"><?= e($SITE_CONTACTS['whatsapp']) ?></strong>
        </div>
        <div class="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
          <span class="text-slate-300">Email Address:</span>
          <strong class="text-blue-300 font-bold"><?= e($SITE_CONTACTS['email']) ?></strong>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 pt-3">
      <a 
        href="https://wa.me/254740841375" 
        target="_blank" 
        class="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-mono font-bold text-xs rounded-xl transition-all text-center no-underline shadow-xs"
      >
        Chat on WhatsApp
      </a>
      <a 
        href="tel:+254740841375" 
        class="flex-1 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-mono font-bold text-xs rounded-xl transition-all text-center no-underline shadow-xs"
      >
        Call Hotline
      </a>
    </div>
  </div>

  <!-- Interactive Web Form -->
  <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
    <div class="text-xs font-black text-slate-900 tracking-wider font-mono">
      Send Support Ticket
    </div>

    <form id="contactTicketForm" onsubmit="handleContactSubmit(event)" class="space-y-3 font-sans text-xs">
      <div>
        <label for="ticketName" class="block text-[11px] font-bold text-slate-700 font-mono mb-1">Your Full Name:</label>
        <input type="text" id="ticketName" name="name" required placeholder="e.g. Brian Ochieng" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900" />
      </div>

      <div>
        <label for="ticketEmail" class="block text-[11px] font-bold text-slate-700 font-mono mb-1">Email or Phone Number:</label>
        <input type="text" id="ticketEmail" name="email" required placeholder="e.g. 0740841375 or email@domain.com" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900" />
      </div>

      <div>
        <label for="ticketSubject" class="block text-[11px] font-bold text-slate-700 font-mono mb-1">Inquiry Subject:</label>
        <select id="ticketSubject" name="subject" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900 font-mono">
          <option value="M-Pesa STK Push Confirmation">M-Pesa STK Push Confirmation</option>
          <option value="VIP Package Inquiry">VIP Package Inquiry</option>
          <option value="Jackpot Permutations Question">Jackpot Permutations Question</option>
          <option value="Sure Odds Packs Inquiry">Sure Odds Packs Inquiry</option>
          <option value="General Feedback / Other">General Feedback / Other</option>
        </select>
      </div>

      <div>
        <label for="ticketMessage" class="block text-[11px] font-bold text-slate-700 font-mono mb-1">Message Details:</label>
        <textarea id="ticketMessage" name="message" required rows="3" placeholder="Describe your question, transaction reference, or inquiry..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900"></textarea>
      </div>

      <button 
        type="submit" 
        class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
      >
        Submit Message
      </button>

      <div id="contactSuccessMsg" class="hidden p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center font-mono font-bold">
        ✓ Your ticket has been saved into our support desk. Our team will contact you shortly!
      </div>

      <div id="contactErrorMsg" class="hidden p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-center font-mono font-bold">
        ✕ An error occurred while saving your message. Please try again or chat via WhatsApp.
      </div>
    </form>
  </div>

</div>

<!-- Official Contacts Table -->
<section class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-left space-y-4">
  <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
    <div class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
      @
    </div>
    <h3 class="text-sm font-black text-slate-900 font-display">
      Official Contact Channels Directory
    </h3>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse text-xs font-sans">
      <thead>
        <tr class="border-b border-slate-200 bg-slate-50 text-[10.5px] font-mono text-slate-600 uppercase">
          <th class="py-2.5 px-3">Channel / Social</th>
          <th class="py-2.5 px-3">Contact Detail / Link</th>
          <th class="py-2.5 px-3">Purpose &amp; Response Time</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-slate-100">
          <td class="py-2.5 px-3 font-bold text-slate-900">Safaricom Hotline</td>
          <td class="py-2.5 px-3 font-mono text-blue-600 font-bold"><?= e($SITE_CONTACTS['phone']) ?></td>
          <td class="py-2.5 px-3 text-slate-500">Live Voice Support • Immediate during business hours</td>
        </tr>
        <tr class="border-b border-slate-100">
          <td class="py-2.5 px-3 font-bold text-slate-900">WhatsApp Helpdesk</td>
          <td class="py-2.5 px-3 font-mono text-emerald-600 font-bold"><?= e($SITE_CONTACTS['whatsapp']) ?></td>
          <td class="py-2.5 px-3 text-slate-500">Fast VIP dispatch &amp; slip verification • &lt; 15 mins</td>
        </tr>
        <tr class="border-b border-slate-100">
          <td class="py-2.5 px-3 font-bold text-slate-900">Telegram Channel</td>
          <td class="py-2.5 px-3 font-mono text-blue-600"><a href="<?= e($SITE_CONTACTS['telegram']) ?>" target="_blank" class="underline">t.me/cheerplex</a></td>
          <td class="py-2.5 px-3 text-slate-500">Daily banker broadcasts &amp; free shortlist drops</td>
        </tr>
        <tr>
          <td class="py-2.5 px-3 font-bold text-slate-900">Email Desk</td>
          <td class="py-2.5 px-3 font-mono text-slate-700"><?= e($SITE_CONTACTS['email']) ?></td>
          <td class="py-2.5 px-3 text-slate-500">Partnerships, formal billing inquiries &amp; feedback</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<?php
$contactMd = loadMarkdownPage('contact');
$faqItems = $contactMd['faqItems'] ?? [];
$faqTitle = $contactMd['faqTitle'] ?? 'Frequently Asked Questions - Contact & Support';
if (!empty($faqItems)) {
    include __DIR__ . '/../components/faq_section.php';
}
?>
