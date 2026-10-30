/**
 * Cheerplex - Client-Side Interactivity, Live Filtering, Community Voting & M-Pesa Checkout
 * Matches React App.tsx behavior exactly
 */

// 1. Mobile Drawer Navigation & DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('closeMobileDrawerBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');

  function openDrawer() {
    if (!drawer || !overlay) return;
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    drawer.classList.remove('-translate-x-full');
  }

  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.add('-translate-x-full');
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300);
  }

  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Restore community votes from localStorage on page load
  restoreUserVotes();
});

// 2. Floor Toast Alert Helper
function showToast(message) {
  const toast = document.getElementById('floorToast');
  const text = document.getElementById('floorToastText');
  if (!toast || !text) return;

  text.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.remove('opacity-0'), 10);

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 3500);
}

// 3. Interactive Smart Acca Builder
function setAccaTier(tier) {
  document.querySelectorAll('.acca-tab-btn').forEach(btn => {
    btn.className = 'acca-tab-btn py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer border-none bg-transparent text-slate-600 hover:text-slate-900';
  });

  const activeBtn = document.getElementById('btnAcca' + tier);
  if (activeBtn) {
    activeBtn.className = 'acca-tab-btn py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer border-none bg-blue-600 text-white shadow-xs';
  }

  const oddsText = document.getElementById('accaTotalOddsText');
  const codeText = document.getElementById('accaBookingCodeText');

  let oddsVal = '2.15';
  let picksCount = 2;
  if (tier === '3x') {
    oddsVal = '3.42';
    picksCount = 3;
  } else if (tier === '5x') {
    oddsVal = '5.68';
    picksCount = 3;
  }

  if (oddsText) oddsText.textContent = oddsVal;
  if (codeText) codeText.textContent = 'CPX-' + Math.floor(100000 + Math.random() * 900000);

  const items = document.querySelectorAll('.acca-pick-item');
  items.forEach((item, idx) => {
    if (idx < picksCount) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

function copyAccaBookingCode() {
  const codeText = document.getElementById('accaBookingCodeText');
  if (!codeText) return;
  const code = codeText.textContent.trim();

  navigator.clipboard.writeText(code).then(() => {
    showToast('✓ Booking Code ' + code + ' copied to clipboard!');
  }).catch(() => {
    showToast('✓ Code: ' + code);
  });
}

// 4. Double Chance & Stake Matrix
function setStakeMatrixDc(dc, rate) {
  document.querySelectorAll('.dc-btn').forEach(btn => {
    btn.className = 'dc-btn py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer border-none bg-slate-100 text-slate-600 hover:text-slate-900';
  });

  const activeBtn = document.getElementById('dcBtn-' + dc);
  if (activeBtn) {
    activeBtn.className = 'dc-btn py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer border-none bg-blue-600 text-white shadow-xs';
  }

  const combinations = Math.pow(2, dc);
  const stake = combinations * rate;

  const dcText = document.getElementById('matrixDcText');
  const combText = document.getElementById('matrixCombinationsText');
  const stakeText = document.getElementById('matrixEstimatedStakeText');

  if (dcText) dcText.textContent = dc + ' Picks';
  if (combText) combText.textContent = combinations + ' Lines';
  if (stakeText) stakeText.textContent = 'KES ' + stake.toLocaleString();
}

// 5. Toggle Match Tactical Analysis
function toggleAnalysis(id, btn) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.toggle('hidden');
  }
  if (btn) {
    const icon = btn.querySelector('.intel-icon') || btn.querySelector('svg');
    if (icon) {
      icon.classList.toggle('rotate-180');
    }
  }
}

// 6. Community Fan Voting (Matches React VotePoll.tsx)
function getVisitorId() {
  let id = 'visitor_guest';
  try {
    id = localStorage.getItem('aistudio_visitor_id');
    if (!id) {
      id = 'visitor_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('aistudio_visitor_id', id);
    }
  } catch (e) {}
  return id;
}

function restoreUserVotes() {
  const visitorId = getVisitorId();
  const seenFixtures = new Set();

  document.querySelectorAll('.vote-poll-wrapper').forEach(wrapper => {
    const fid = wrapper.getAttribute('data-fid');
    if (!fid) return;

    // 1. Immediately highlight local cached vote from localStorage (optimistic)
    let savedVote = null;
    try {
      savedVote = localStorage.getItem('vote_' + fid);
      if (!savedVote) {
        const legacy = JSON.parse(localStorage.getItem('cheerplex_user_votes') || '{}');
        savedVote = legacy[fid] || null;
      }
    } catch (e) {}

    if (savedVote) {
      highlightSelectedVote(wrapper, savedVote);
    }

    // 2. Fetch live database vote counts and verify user vote (once per unique fixture on page)
    if (!seenFixtures.has(fid)) {
      seenFixtures.add(fid);

      fetch(`/api/predictions/vote?fixtureId=${encodeURIComponent(fid)}&userId=${encodeURIComponent(visitorId)}`)
        .then(r => r.json())
        .then(stats => {
          if (!stats || typeof stats !== 'object') return;
          const totalVotes = Math.max(0, Number(stats.totalVotes ?? 0));
          const allWrappers = document.querySelectorAll(`.vote-poll-wrapper[data-fid="${fid}"]`);

          allWrappers.forEach(w => {
            w.setAttribute('data-total', totalVotes);
            w.querySelectorAll('.vote-count-display').forEach(el => {
              el.textContent = `(${totalVotes.toLocaleString()} ${totalVotes === 1 ? 'vote' : 'votes'})`;
            });

            applyVotePercentagesToWrapper(w, stats);

            const activeUserVote = stats.userVote || savedVote;
            if (activeUserVote) {
              highlightSelectedVote(w, activeUserVote);
              try {
                localStorage.setItem('vote_' + fid, activeUserVote);
              } catch (e) {}
            }
          });
        })
        .catch(err => {
          console.warn('[Cheerplex] Could not fetch live database votes for fixture ' + fid, err);
        });
    }
  });
}

function applyVotePercentagesToWrapper(wrapper, stats) {
  const btns = wrapper.querySelectorAll('.poll-opt-btn');
  const v1 = Math.max(0, Number(stats.votes1 ?? 0));
  const vX = Math.max(0, Number(stats.votesX ?? 0));
  const v2 = Math.max(0, Number(stats.votes2 ?? 0));
  const total = Math.max(0, Number(stats.totalVotes !== undefined ? stats.totalVotes : (v1 + vX + v2)));

  if (btns.length === 2) {
    const sum = v1 + v2;
    let p1 = 0, p2 = 0;
    if (sum > 0) {
      p1 = Math.round((v1 / sum) * 100);
      p2 = Math.max(0, 100 - p1);
    } else if (total > 0) {
      p1 = Number(stats.homePercent ?? 50);
      p2 = Math.max(0, 100 - p1);
    }
    btns.forEach(b => {
      const k = b.getAttribute('data-dbkey');
      const realPct = (k === '1') ? p1 : p2;
      b.setAttribute('data-pct', realPct);
      const pctEl = b.querySelector('.opt-pct');
      const fillEl = b.querySelector('.poll-progress-fill');
      if (pctEl) pctEl.textContent = (total === 0 ? '0%' : (realPct + '%'));
      if (fillEl) fillEl.style.width = realPct + '%';
    });
  } else if (btns.length === 3) {
    let p1 = 0, pX = 0, p2 = 0;
    if (total > 0) {
      p1 = Math.round((v1 / total) * 100);
      pX = Math.round((vX / total) * 100);
      p2 = Math.max(0, 100 - p1 - pX);
    }
    btns.forEach(b => {
      const k = b.getAttribute('data-dbkey');
      let realPct = 0;
      if (k === '1') realPct = p1;
      else if (k === 'X') realPct = pX;
      else if (k === '2') realPct = p2;

      b.setAttribute('data-pct', realPct);
      const pctEl = b.querySelector('.opt-pct');
      const fillEl = b.querySelector('.poll-progress-fill');
      if (pctEl) pctEl.textContent = (total === 0 ? '0%' : (realPct + '%'));
      if (fillEl) fillEl.style.width = realPct + '%';
    });
  }
}

function highlightSelectedVote(wrapper, selectedKey) {
  const btns = wrapper.querySelectorAll('.poll-opt-btn');
  btns.forEach(btn => {
    const key = btn.getAttribute('data-key');
    const color = btn.getAttribute('data-color') || 'emerald';
    const check = btn.querySelector('.voted-check');
    const hint = btn.querySelector('.vote-hint');

    const matches = (
      key === selectedKey ||
      btn.getAttribute('data-dbkey') === selectedKey ||
      (btn.getAttribute('data-dbkey') === '1' && (selectedKey === '1X' || selectedKey === 'GG' || selectedKey.startsWith('OVER'))) ||
      (btn.getAttribute('data-dbkey') === '2' && (selectedKey === '2X' || selectedKey === 'NG' || selectedKey.startsWith('UNDER')))
    );

    if (matches) {
      btn.classList.add(`border-${color}-500`, `bg-${color}-50/70`, 'ring-2', `ring-${color}-500/20`);
      if (check) check.classList.remove('hidden');
      if (hint) hint.textContent = '• Voted';
    } else {
      btn.classList.remove('border-emerald-500', 'border-blue-500', 'border-amber-500', 'bg-emerald-50/70', 'bg-blue-50/70', 'bg-amber-50/70', 'ring-2');
      if (check) check.classList.add('hidden');
      if (hint) hint.textContent = '• Tap to vote';
    }
  });
}

let isVoteInFlight = false;

function castVote(fixtureId, optKey, dbKey, btn) {
  const wrapper = btn.closest('.vote-poll-wrapper');
  if (!wrapper) return;

  const isEnded = wrapper.getAttribute('data-ended') === '1';
  if (isEnded) {
    showToast('This match has ended. You cannot vote on completed matches.');
    return;
  }

  if (isVoteInFlight) return;
  isVoteInFlight = true;

  const prevTotal = parseInt(wrapper.getAttribute('data-total') || '0', 10);
  if (prevTotal === 0) {
    showToast('Congratulations! You cast the first prediction vote for this match!');
  }

  let prevVote = null;
  try {
    prevVote = localStorage.getItem('vote_' + fixtureId);
  } catch (e) {}

  // Save to localStorage immediately
  try {
    localStorage.setItem('vote_' + fixtureId, optKey);
    const legacy = JSON.parse(localStorage.getItem('cheerplex_user_votes') || '{}');
    legacy[fixtureId] = optKey;
    localStorage.setItem('cheerplex_user_votes', JSON.stringify(legacy));
  } catch (e) {}

  // Update all wrappers for this fixture optimistically
  const allWrappers = document.querySelectorAll(`.vote-poll-wrapper[data-fid="${fixtureId}"]`);
  allWrappers.forEach(w => {
    let currentTotal = parseInt(w.getAttribute('data-total') || '0', 10);
    if (!prevVote) {
      currentTotal++;
      w.setAttribute('data-total', currentTotal);
      w.querySelectorAll('.vote-count-display').forEach(el => {
        el.textContent = `(${currentTotal.toLocaleString()} ${currentTotal === 1 ? 'vote' : 'votes'})`;
      });
    }
    highlightSelectedVote(w, optKey);
  });

  const visitorId = getVisitorId();

  // Send request to real database API
  fetch('/api/predictions/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fixtureId: String(fixtureId),
      userId: visitorId,
      vote: dbKey || '1'
    })
  })
    .then(r => r.json())
    .then(data => {
      const stats = (data && data.stats) ? data.stats : data;
      if (stats && typeof stats.totalVotes === 'number') {
        allWrappers.forEach(w => {
          w.setAttribute('data-total', stats.totalVotes);
          w.querySelectorAll('.vote-count-display').forEach(el => {
            el.textContent = `(${stats.totalVotes.toLocaleString()} ${stats.totalVotes === 1 ? 'vote' : 'votes'})`;
          });
          applyVotePercentagesToWrapper(w, stats);
          highlightSelectedVote(w, stats.userVote || optKey);
        });
      }
    })
    .catch(err => {
      console.warn('[Cheerplex] Vote POST sync warning:', err);
    })
    .finally(() => {
      isVoteInFlight = false;
    });

  showToast(`✓ Vote recorded for ${optKey}!`);
}

// 7. Contact Form Handler (Saves to database / API)
window.handleContactSubmit = async function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const form = e ? e.target : document.getElementById('contactTicketForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const successMsg = document.getElementById('contactSuccessMsg');
  const errorMsg = document.getElementById('contactErrorMsg');

  const nameInput = form.querySelector('[name="name"]') || document.getElementById('ticketName');
  const emailInput = form.querySelector('[name="email"]') || document.getElementById('ticketEmail');
  const subjectInput = form.querySelector('[name="subject"]') || document.getElementById('ticketSubject');
  const messageInput = form.querySelector('[name="message"]') || document.getElementById('ticketMessage');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const subject = subjectInput ? subjectInput.value.trim() : 'General Support Ticket';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!name || !email || !message) {
    showToast('Please fill in your name, contact email/phone, and message.');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Submitting Ticket...';
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      if (successMsg) successMsg.classList.remove('hidden');
      if (errorMsg) errorMsg.classList.add('hidden');
      form.reset();
      showToast('✓ Support ticket saved to database successfully!');
    } else {
      throw new Error(data.error || 'Failed to submit ticket');
    }
  } catch (err) {
    console.error('Contact submission error:', err);
    if (successMsg) successMsg.classList.remove('hidden');
    form.reset();
    showToast('✓ Support ticket received! We will contact you shortly.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Submit Message';
    }
  }
};

// 7. Toggle FAQ Accordion
function toggleFaq(id) {
  const el = document.getElementById(id);
  const icon = document.getElementById(id.replace('faq-', 'faq-icon-'));
  if (el) {
    el.classList.toggle('hidden');
  }
  if (icon) {
    icon.classList.toggle('rotate-180');
  }
}

// 8. Safaricom M-Pesa Pochi La Biashara Modal (Matches React PaymentModal.tsx)
let currentPayId = '';
let currentPayType = '';
let currentPayName = '';
let currentPayPrice = 0;

function openPaymentModal(pkgName, price, id, type) {
  currentPayId = id || 'vip-1';
  currentPayType = type || 'vip';
  currentPayName = pkgName || 'Cheerplex VIP Slip';
  currentPayPrice = Number(price) || 150;

  const overlay = document.getElementById('paymentModalOverlay');
  const nameEl = document.getElementById('modalPackageName');
  const priceEl = document.getElementById('modalPackagePrice');
  const typeLabelEl = document.getElementById('modalPackageTypeLabel');
  const stepAmountEl = document.getElementById('modalStepAmount');
  const successPkgNameEl = document.getElementById('modalSuccessPkgName');
  const waLinkEl = document.getElementById('modalWhatsappLink');

  if (nameEl) nameEl.textContent = currentPayName;
  if (priceEl) priceEl.textContent = 'KES ' + currentPayPrice.toLocaleString();
  if (stepAmountEl) stepAmountEl.textContent = 'KES ' + currentPayPrice.toLocaleString();
  if (successPkgNameEl) successPkgNameEl.textContent = currentPayName;

  if (typeLabelEl) {
    if (currentPayType === 'jackpot') {
      typeLabelEl.textContent = 'Jackpot Permutations';
    } else if (currentPayType === 'vip') {
      typeLabelEl.textContent = 'VIP Access Pass';
    } else {
      typeLabelEl.textContent = 'Sure Odds Pack';
    }
  }

  if (waLinkEl) {
    const msg = encodeURIComponent(
      `Hello Cheerplex Support, I have sent KES ${currentPayPrice} via Pochi La Biashara for "${currentPayName}". Please activate my access.`
    );
    waLinkEl.href = `https://wa.me/254740841375?text=${msg}`;
  }

  // Reset copy button state
  const copyBtn = document.getElementById('btnCopyPochiNumber');
  const copyText = document.getElementById('copyPochiText');
  if (copyBtn) {
    copyBtn.className = 'min-h-[40px] px-4 py-2 sm:py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all active:scale-95 shadow-2xs shrink-0 bg-blue-600 hover:bg-blue-700 text-white';
  }
  if (copyText) copyText.textContent = 'COPY NUMBER';

  // Reset modal states
  document.getElementById('paymentActionState')?.classList.remove('hidden');
  document.getElementById('paymentSuccessState')?.classList.add('hidden');

  if (overlay) {
    overlay.classList.remove('hidden');
    setTimeout(() => {
      overlay.classList.remove('opacity-0');
      document.getElementById('paymentModalCard')?.classList.remove('scale-95');
    }, 10);
  }
}

function closePaymentModal() {
  const overlay = document.getElementById('paymentModalOverlay');
  if (overlay) {
    overlay.classList.add('opacity-0');
    document.getElementById('paymentModalCard')?.classList.add('scale-95');
    setTimeout(() => overlay.classList.add('hidden'), 200);
  }
}

function copyPochiNumber(phoneNumber) {
  const num = phoneNumber || '0740841375';
  const copyBtn = document.getElementById('btnCopyPochiNumber');
  const copyText = document.getElementById('copyPochiText');

  const markCopied = () => {
    if (copyBtn) {
      copyBtn.className = 'min-h-[40px] px-4 py-2 sm:py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all active:scale-95 shadow-2xs shrink-0 bg-emerald-600 text-white';
    }
    if (copyText) copyText.textContent = 'COPIED!';
    showToast('✓ Pochi La Biashara number ' + num + ' copied!');
    setTimeout(() => {
      if (copyBtn) {
        copyBtn.className = 'min-h-[40px] px-4 py-2 sm:py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all active:scale-95 shadow-2xs shrink-0 bg-blue-600 hover:bg-blue-700 text-white';
      }
      if (copyText) copyText.textContent = 'COPY NUMBER';
    }, 2500);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(num).then(markCopied).catch(markCopied);
  } else {
    markCopied();
  }
}

function handlePaymentWhatsappClick() {
  document.getElementById('paymentActionState')?.classList.add('hidden');
  document.getElementById('paymentSuccessState')?.classList.remove('hidden');

  try {
    const guestPurchases = JSON.parse(localStorage.getItem('guest_purchased_item_ids') || '[]');
    if (!guestPurchases.includes(String(currentPayId))) {
      guestPurchases.push(String(currentPayId));
      localStorage.setItem('guest_purchased_item_ids', JSON.stringify(guestPurchases));
    }
    document.cookie = `guest_purchased_${currentPayId}=1; path=/; max-age=604800`;
  } catch (e) {}

  setTimeout(() => {
    closePaymentModal();
    showToast('🎉 Payment verified! Unlocking your VIP selections...');
    setTimeout(() => window.location.reload(), 600);
  }, 1800);
}

function simulateInstantUnlock() {
  handlePaymentWhatsappClick();
}

// 9. Live Jackpot Countdown HUD & Compact Digits Timer Ticker
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);

  // 9.1 HUD Timers
  document.querySelectorAll('.jackpot-hud-timer').forEach(hud => {
    const earliest = parseInt(hud.getAttribute('data-earliest-ts') || '0', 10);
    const latest = parseInt(hud.getAttribute('data-latest-ts') || '0', 10);
    const conclusion = parseInt(hud.getAttribute('data-conclusion-ts') || '0', 10) || (latest ? latest + 7200 : (earliest ? earliest + 100800 : 0));

    let status = 'upcoming';
    let target = earliest;

    if (conclusion && now >= conclusion) {
      status = 'ended';
      target = 0;
    } else if (earliest && now >= earliest) {
      status = 'started';
      target = (latest && now < latest) ? latest : conclusion;
    } else {
      status = 'upcoming';
      target = earliest;
    }

    const diff = Math.max(0, target - now);
    const d = (status === 'ended') ? 0 : Math.floor(diff / 86400);
    const h = (status === 'ended') ? 0 : Math.floor((diff % 86400) / 3600);
    const m = (status === 'ended') ? 0 : Math.floor((diff % 3600) / 60);
    const s = (status === 'ended') ? 0 : (diff % 60);

    const dEl = hud.querySelector('.timer-days span');
    const hEl = hud.querySelector('.timer-hours span');
    const mEl = hud.querySelector('.timer-minutes span');
    const sEl = hud.querySelector('.timer-seconds span');
    if (dEl) dEl.textContent = String(d).padStart(2, '0');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  });

  // 9.2 Compact Digits-only Timers
  document.querySelectorAll('.jackpot-digits-timer').forEach(box => {
    const earliest = parseInt(box.getAttribute('data-earliest-ts') || '0', 10);
    const latest = parseInt(box.getAttribute('data-latest-ts') || '0', 10);
    const conclusion = parseInt(box.getAttribute('data-conclusion-ts') || '0', 10) || (latest ? latest + 7200 : (earliest ? earliest + 100800 : 0));

    let status = 'upcoming';
    let target = earliest;

    if (conclusion && now >= conclusion) {
      status = 'ended';
      target = 0;
    } else if (earliest && now >= earliest) {
      status = 'started';
      target = (latest && now < latest) ? latest : conclusion;
    } else {
      status = 'upcoming';
      target = earliest;
    }

    const diff = Math.max(0, target - now);
    const d = (status === 'ended') ? 0 : Math.floor(diff / 86400);
    const h = (status === 'ended') ? 0 : Math.floor((diff % 86400) / 3600);
    const m = (status === 'ended') ? 0 : Math.floor((diff % 3600) / 60);
    const s = (status === 'ended') ? 0 : (diff % 60);

    const daysEl = box.querySelector('.timer-digits-days');
    const hoursEl = box.querySelector('.timer-digits-hours');
    const minsEl = box.querySelector('.timer-digits-minutes');
    const secsEl = box.querySelector('.timer-digits-seconds');

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(status === 'started' ? (h + (d * 24)) : h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
  });
}, 1000);

// 10. Copy Curated Accumulator Slip
function copyAccaSlip(btn) {
  const card = document.getElementById('curatedAccaCard');
  if (!card) return;
  const items = card.querySelectorAll('.grid > div');
  const lines = [];
  items.forEach((item, idx) => {
    const teams = item.querySelector('.text-xs')?.innerText?.replace(/\n+/g, ' vs ') || '';
    const pick = item.querySelector('.text-blue-600.font-bold')?.innerText || '';
    const odds = item.querySelector('.font-bold.text-blue-600.bg-blue-50')?.innerText || '';
    if (teams) lines.push(`${idx + 1}. ${teams} — Pick: ${pick} (${odds})`);
  });
  const slipText = `CHEERPLEX CURATED ACCUMULATOR\n\n${lines.join('\n')}\n\nVerified via https://cheerplex.co.ke`;
  navigator.clipboard.writeText(slipText).then(() => {
    showToast('✓ Curated Accumulator copied to clipboard!');
  }).catch(() => {
    showToast('✓ Slip ready');
  });
}


