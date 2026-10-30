<?php
/**
 * Cheerplex - Interactive Fan Voting Poll Component
 * Matches React VotePoll.tsx exactly
 */

$fid = $fixture['id'] ?? $fixtureId ?? 1;
$prediction = $fixture['prediction'] ?? 'Home Win (1)';
$homeTeam = $fixture['homeTeam'] ?? 'Home Team';
$awayTeam = $fixture['awayTeam'] ?? 'Away Team';
$status = $fixture['status'] ?? 'NS';
$result = $fixture['result'] ?? null;
$isCompleted = ($status === 'FT' || $status === 'AET' || $status === 'PEN' || $result === 'won' || $result === 'lost');
$variant = $voteVariant ?? $variant ?? 'desktop-row';

$catContext = strtolower(trim($currentCategory ?? $category ?? ''));
$predUpper = strtoupper(trim($prediction));

// 1. OVER / UNDER 1.5 GOALS
if (
    $catContext === 'category-over15' || 
    $catContext === 'cheerplex-sure-tips-and-odds' || 
    strpos($predUpper, '1.5') !== false || 
    strpos($predUpper, 'OV 1.5') !== false || 
    strpos($predUpper, 'UN 1.5') !== false ||
    $predUpper === 'O1.5' ||
    $predUpper === 'U1.5'
) {
    $question = "Over/Under 1.5 Goals?";
    $options = [
        [
            'key' => 'OVER_1.5',
            'label' => 'Over 1.5',
            'shortLabel' => 'Over 1.5',
            'sublabel' => '2+ Total Goals',
            'dbKey' => '1',
            'color' => 'emerald',
            'basePct' => 0
        ],
        [
            'key' => 'UNDER_1.5',
            'label' => 'Under 1.5',
            'shortLabel' => 'Under 1.5',
            'sublabel' => '0-1 Total Goals',
            'dbKey' => '2',
            'color' => 'amber',
            'basePct' => 0
        ]
    ];
}
// 2. OVER / UNDER 2.5 GOALS
elseif (
    $catContext === 'category-over25' || 
    $catContext === 'cheerplex-free-predictions-and-tips' || 
    strpos($predUpper, '2.5') !== false || 
    strpos($predUpper, 'OV 2.5') !== false || 
    strpos($predUpper, 'UN 2.5') !== false ||
    $predUpper === 'O2.5' ||
    $predUpper === 'U2.5'
) {
    $question = "Over/Under 2.5 Goals?";
    $options = [
        [
            'key' => 'OVER_2.5',
            'label' => 'Over 2.5',
            'shortLabel' => 'Over 2.5',
            'sublabel' => '3+ Total Goals',
            'dbKey' => '1',
            'color' => 'emerald',
            'basePct' => 0
        ],
        [
            'key' => 'UNDER_2.5',
            'label' => 'Under 2.5',
            'shortLabel' => 'Under 2.5',
            'sublabel' => '0-2 Total Goals',
            'dbKey' => '2',
            'color' => 'amber',
            'basePct' => 0
        ]
    ];
}
// 3. BOTH TEAMS TO SCORE (BTTS / GG)
elseif (
    $catContext === 'category-btts' || 
    $catContext === 'cheerplex-gg-prediction-tips' || 
    strpos($predUpper, 'GG') !== false || 
    strpos($predUpper, 'NG') !== false || 
    strpos($predUpper, 'BTTS') !== false
) {
    $question = "Both Teams To Score (GG/NG)?";
    $options = [
        [
            'key' => 'GG',
            'label' => 'Yes (GG)',
            'shortLabel' => 'Yes (GG)',
            'sublabel' => 'Both teams to score',
            'dbKey' => '1',
            'color' => 'emerald',
            'basePct' => 0
        ],
        [
            'key' => 'NG',
            'label' => 'No (NG)',
            'shortLabel' => 'No (NG)',
            'sublabel' => 'At least one clean sheet',
            'dbKey' => '2',
            'color' => 'amber',
            'basePct' => 0
        ]
    ];
}
// 4. DOUBLE CHANCE (1X, 12, X2)
elseif (
    $catContext === 'category-doublechance' || 
    $catContext === 'cheerplex-free-predictions-and-tips' || 
    strpos($predUpper, '1X') !== false || 
    strpos($predUpper, 'X2') !== false || 
    strpos($predUpper, '12') !== false || 
    strpos($predUpper, 'DC') !== false
) {
    $question = "Double Chance Outcome?";
    $options = [
        [
            'key' => '1X',
            'label' => '1X (Home/Draw)',
            'shortLabel' => '1X (Home/Draw)',
            'sublabel' => $homeTeam . ' or Draw',
            'dbKey' => '1',
            'color' => 'emerald',
            'basePct' => 0
        ],
        [
            'key' => '12',
            'label' => '12 (Any Win)',
            'shortLabel' => '12 (Any Win)',
            'sublabel' => 'No Draw (Any Win)',
            'dbKey' => 'X',
            'color' => 'amber',
            'basePct' => 0
        ],
        [
            'key' => 'X2',
            'label' => 'X2 (Draw/Away)',
            'shortLabel' => 'X2 (Draw/Away)',
            'sublabel' => 'Draw or ' . $awayTeam,
            'dbKey' => '2',
            'color' => 'blue',
            'basePct' => 0
        ]
    ];
}
// 5. 1X2 FULL TIME RESULT (DEFAULT)
else {
    $question = "Who will win: {$homeTeam} vs {$awayTeam}?";
    $options = [
        [
            'key' => '1',
            'label' => '1 (Home)',
            'shortLabel' => '1 (Home)',
            'sublabel' => $homeTeam . ' Win',
            'dbKey' => '1',
            'color' => 'emerald',
            'basePct' => 0
        ],
        [
            'key' => 'X',
            'label' => 'X (Draw)',
            'shortLabel' => 'X (Draw)',
            'sublabel' => 'Tie Game',
            'dbKey' => 'X',
            'color' => 'amber',
            'basePct' => 0
        ],
        [
            'key' => '2',
            'label' => '2 (Away)',
            'shortLabel' => '2 (Away)',
            'sublabel' => $awayTeam . ' Win',
            'dbKey' => '2',
            'color' => 'blue',
            'basePct' => 0
        ]
    ];
}

$gridCols = count($options) === 2 ? 'grid-cols-2' : 'grid-cols-3';

// Fetch real vote stats directly from the database or API
$dbVoteStats = getFixtureVoteStats($fid);
$totalVotes = (int)($dbVoteStats['totalVotes'] ?? 0);
$userVoteChoice = $dbVoteStats['userVote'] ?? null;

if ($totalVotes > 0) {
    if (count($options) === 2) {
        $p1 = (int)($dbVoteStats['homePercent'] ?? 0);
        $p2 = (int)($dbVoteStats['awayPercent'] ?? 0);
        $sum = $p1 + $p2;
        if ($sum > 0) {
            $options[0]['basePct'] = (int)round(($p1 / $sum) * 100);
            $options[1]['basePct'] = max(0, 100 - $options[0]['basePct']);
        } else {
            $options[0]['basePct'] = 50;
            $options[1]['basePct'] = 50;
        }
    } elseif (count($options) === 3) {
        $options[0]['basePct'] = (int)($dbVoteStats['homePercent'] ?? 0);
        $options[1]['basePct'] = (int)($dbVoteStats['drawPercent'] ?? 0);
        $options[2]['basePct'] = (int)($dbVoteStats['awayPercent'] ?? 0);
    }
}
unset($opt);
?>
<div class="vote-poll-wrapper select-none text-left" data-fid="<?= $fid ?>" data-status="<?= e($status) ?>" data-ended="<?= $isCompleted ? '1' : '0' ?>" data-total="<?= $totalVotes ?>">

<?php if ($variant === 'desktop-row'): ?>
  <!-- ========================================================================= -->
  <!-- DESKTOP ROW VARIANT (Matches React VotePoll.tsx variant="desktop-row")    -->
  <!-- ========================================================================= -->
  <div class="w-full space-y-2.5 text-left select-none">
    
    <!-- Header: Question on start, Voting Status on the end -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 min-w-0">
        <?= renderIcon('users', 'w-4 h-4 text-blue-600 shrink-0') ?>
        <span class="font-bold text-slate-800 text-sm tracking-tight truncate">
          <?= e($question) ?>
        </span>
      </div>

      <div class="shrink-0 flex items-center gap-2">
        <?php if ($isCompleted): ?>
          <span class="text-[11px] font-mono font-bold text-slate-700 bg-slate-200/90 px-3 py-1 rounded-full border border-slate-300 flex items-center gap-1.5 shadow-2xs">
            <?= renderIcon('lock', 'w-3 h-3 text-slate-500') ?>
            <span>Match Ended • Voting Closed (You cannot vote)</span>
          </span>
        <?php elseif ($totalVotes === 0): ?>
          <span class="text-[11px] font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5 shadow-2xs">
            <?= renderIcon('star', 'w-3 h-3 text-amber-600 fill-amber-500') ?>
            <span>No votes yet • Be the first to vote!</span>
          </span>
        <?php else: ?>
          <span class="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>VOTING OPEN • Tap to Vote</span>
          </span>
        <?php endif; ?>
        <span class="text-[11px] font-mono text-slate-500 hidden sm:inline vote-count-display">
          (<?= number_format($totalVotes) ?> <?= $totalVotes === 1 ? 'vote' : 'votes' ?>)
        </span>
      </div>
    </div>

    <!-- 2 or 3 Voting Cards Grid with Dedicated Option Shades (min-h-[76px]) -->
    <div class="grid <?= $gridCols ?> gap-2.5 sm:gap-3">
      <?php foreach ($options as $opt): 
        $color = $opt['color'];
        $progressClass = $color === 'emerald' ? 'bg-emerald-500/10 border-r border-emerald-500/30' : ($color === 'blue' ? 'bg-blue-500/10 border-r border-blue-500/30' : 'bg-amber-500/10 border-r border-amber-500/30');
        $percentTextClass = $color === 'emerald' ? 'text-emerald-600' : ($color === 'blue' ? 'text-blue-600' : 'text-amber-600');
        $cardBorderClass = "border border-[var(--border)] bg-white hover:border-{$color}-300 hover:bg-{$color}-50/20";
      ?>
        <button
          type="button"
          <?= $isCompleted ? 'disabled' : '' ?>
          onclick="castVote(<?= $fid ?>, '<?= $opt['key'] ?>', '<?= $opt['dbKey'] ?>', this)"
          aria-label="<?= $isCompleted ? "Match ended. Voting closed for {$opt['label']}" : "Vote for {$opt['label']} ({$opt['basePct']}% community consensus)" ?>"
          class="poll-opt-btn py-3 px-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[76px] active:scale-[0.98] group relative overflow-hidden shadow-2xs <?= $isCompleted ? 'cursor-not-allowed opacity-90' : 'cursor-pointer hover:shadow-xs' ?> <?= $cardBorderClass ?>"
          data-key="<?= $opt['key'] ?>"
          data-dbkey="<?= $opt['dbKey'] ?>"
          data-pct="<?= $opt['basePct'] ?>"
          data-color="<?= $color ?>"
          title="<?= $isCompleted ? "Match has ended — Voting is closed. You cannot vote on this match." : ($totalVotes === 0 ? "Be the first fan to vote for {$opt['label']}!" : "Vote {$opt['label']} ({$opt['basePct']}%) - Total: {$totalVotes} votes") ?>"
        >
          <!-- Background progress fill -->
          <div 
            class="poll-progress-fill absolute left-0 top-0 bottom-0 pointer-events-none transition-all duration-500 <?= $progressClass ?>"
            style="width: <?= $opt['basePct'] ?>%"
          ></div>

          <!-- Team / Choice Label on left, % on right -->
          <div class="relative z-10 w-full flex items-center justify-between gap-1.5">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="text-xs sm:text-sm truncate tracking-tight font-bold text-slate-900 opt-label">
                <?= e($opt['label']) ?>
              </span>
              <span class="voted-check hidden inline-flex items-center shrink-0">
                <?= renderIcon('check-circle-2', "w-3.5 h-3.5 {$percentTextClass}") ?>
              </span>
            </div>
            <span class="text-sm sm:text-base font-mono tabular-nums leading-none font-bold <?= $percentTextClass ?> opt-pct">
              <?= $totalVotes === 0 ? '0%' : ($opt['basePct'] . '%') ?>
            </span>
          </div>

          <!-- Sub-label helper if present -->
          <?php if (!empty($opt['sublabel'])): ?>
            <span class="relative z-10 text-[10px] sm:text-[10.5px] truncate max-w-full leading-none my-0.5 text-slate-600 font-medium">
              <?= e($opt['sublabel']) ?>
            </span>
          <?php endif; ?>

          <!-- Bottom hint -->
          <div class="relative z-10 w-full text-right mt-1">
            <span class="text-[9.5px] font-mono text-blue-600 font-bold group-hover:underline vote-hint">
              <?= $isCompleted ? '• Match ended (Voting closed)' : ($totalVotes === 0 ? '• Be first to vote!' : '• Tap to vote') ?>
            </span>
          </div>
        </button>
      <?php endforeach; ?>
    </div>

    <!-- Status Helper Footer -->
    <?php if ($isCompleted): ?>
      <div class="flex items-center justify-between text-[11px] font-mono text-slate-600 px-1 pt-0.5">
        <span class="flex items-center gap-1 text-slate-700 font-medium">
          <?= renderIcon('lock', 'w-3.5 h-3.5 text-slate-500 shrink-0') ?> Match has ended (FT) — voting is permanently closed. You cannot vote on completed matches.
        </span>
        <span class="text-[10px] text-slate-600 font-mono">
          Final: <?= number_format($totalVotes) ?> <?= $totalVotes === 1 ? 'vote' : 'votes' ?>
        </span>
      </div>
    <?php elseif ($totalVotes === 0): ?>
      <div class="flex items-center justify-between text-[11px] font-mono text-amber-800 bg-amber-50/70 p-2 rounded-xl border border-amber-200">
        <span class="flex items-center gap-1.5 font-bold">
          <?= renderIcon('star', 'w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0') ?>
          No one has voted yet on this fixture. Be the first to predict the outcome below!
        </span>
        <span class="text-[10px] text-amber-700 font-bold font-mono">0 votes</span>
      </div>
    <?php else: ?>
      <div class="flex items-center justify-between text-[11px] font-mono text-emerald-700 px-1 pt-0.5">
        <span class="flex items-center gap-1.5 font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          You can vote as the match has not ended • Voting is live until kickoff
        </span>
        <span class="text-[10px] text-slate-400">
          Total: <?= number_format($totalVotes) ?> votes
        </span>
      </div>
    <?php endif; ?>

  </div>

<?php else: ?>
  <!-- ========================================================================= -->
  <!-- MOBILE 3-TIER VARIANT (Matches React VotePoll.tsx variant="mobile")       -->
  <!-- ========================================================================= -->
  <div class="w-full space-y-1.5 text-left select-none">
    
    <!-- Row 1: Question -->
    <div class="text-xs font-bold text-slate-900 tracking-tight">
      <?= e($question) ?>
    </div>

    <!-- Row 2: Voting Status & Community votes -->
    <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 flex-wrap gap-1">
      <div class="flex items-center gap-1.5">
        <?= renderIcon('users', 'w-3.5 h-3.5 text-blue-600 shrink-0') ?>
        <span class="font-semibold text-slate-700">Fan Poll</span>
      </div>

      <div class="flex items-center gap-1.5">
        <?php if ($isCompleted): ?>
          <span class="text-[10px] font-mono font-bold text-slate-700 bg-slate-200/90 px-2 py-0.5 rounded-full border border-slate-300 flex items-center gap-1 shadow-2xs">
            <?= renderIcon('lock', 'w-2.5 h-2.5 text-slate-500') ?>
            <span>Ended • Voting Closed (Cannot vote)</span>
          </span>
        <?php elseif ($totalVotes === 0): ?>
          <span class="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shadow-2xs">
            <?= renderIcon('star', 'w-2.5 h-2.5 text-amber-600 fill-amber-500') ?>
            <span>No votes yet • Be first to vote!</span>
          </span>
        <?php else: ?>
          <span class="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 shadow-2xs">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Voting Open</span>
          </span>
        <?php endif; ?>
        <span class="tabular-nums font-bold text-slate-600 text-[10px] vote-count-display">
          (<?= number_format($totalVotes) ?> <?= $totalVotes === 1 ? 'vote' : 'votes' ?>)
        </span>
      </div>
    </div>

    <!-- Row 3: Voting Options Grid with Dedicated Option Shades (min-h-[46px]) -->
    <div class="grid <?= $gridCols ?> gap-1.5 pt-0.5">
      <?php foreach ($options as $opt): 
        $color = $opt['color'];
        $progressClass = $color === 'emerald' ? 'bg-emerald-500/10 border-r border-emerald-500/30' : ($color === 'blue' ? 'bg-blue-500/10 border-r border-blue-500/30' : 'bg-amber-500/10 border-r border-amber-500/30');
        $percentTextClass = $color === 'emerald' ? 'text-emerald-600' : ($color === 'blue' ? 'text-blue-600' : 'text-amber-600');
        $cardBorderClass = "border border-[var(--border)] bg-white hover:border-{$color}-300";
      ?>
        <button
          type="button"
          <?= $isCompleted ? 'disabled' : '' ?>
          onclick="castVote(<?= $fid ?>, '<?= $opt['key'] ?>', '<?= $opt['dbKey'] ?>', this)"
          aria-label="<?= $isCompleted ? "Match ended. Voting closed for {$opt['label']}" : "Vote for {$opt['label']} ({$opt['basePct']}% community consensus)" ?>"
          class="poll-opt-btn relative overflow-hidden py-2 px-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[46px] font-mono text-xs active:scale-[0.97] touch-manipulation group <?= $isCompleted ? 'cursor-not-allowed opacity-90' : 'cursor-pointer hover:shadow-xs' ?> <?= $cardBorderClass ?>"
          data-key="<?= $opt['key'] ?>"
          data-dbkey="<?= $opt['dbKey'] ?>"
          data-pct="<?= $opt['basePct'] ?>"
          data-color="<?= $color ?>"
          title="<?= $isCompleted ? "Match has ended — Voting is closed. You cannot vote on this match." : ($totalVotes === 0 ? "Be the first fan to vote for {$opt['label']}!" : "Vote {$opt['label']} ({$opt['basePct']}%) - Total: {$totalVotes} votes") ?>"
        >
          <!-- Background progress fill -->
          <div 
            class="poll-progress-fill absolute left-0 top-0 bottom-0 pointer-events-none transition-all duration-500 <?= $progressClass ?>"
            style="width: <?= $opt['basePct'] ?>%"
          ></div>

          <!-- Option Choice text and Percentage -->
          <div class="relative z-10 flex items-center justify-between gap-1 w-full">
            <span class="font-bold truncate text-xs text-slate-900 opt-label">
              <?= e($opt['shortLabel']) ?>
            </span>

            <div class="flex items-center gap-1 shrink-0">
              <span class="text-[11px] tabular-nums font-bold <?= $percentTextClass ?> opt-pct">
                <?= $totalVotes === 0 ? '0%' : ($opt['basePct'] . '%') ?>
              </span>
              <span class="voted-check hidden inline-flex items-center shrink-0">
                <?= renderIcon('check-circle-2', "w-3 h-3 {$percentTextClass}") ?>
              </span>
            </div>
          </div>
        </button>
      <?php endforeach; ?>
    </div>

    <!-- Row 4: Status helper for mobile -->
    <?php if ($isCompleted): ?>
      <div class="text-[10px] font-mono text-slate-600 flex items-center gap-1 pt-0.5 font-medium">
        <?= renderIcon('lock', 'w-3 h-3 text-slate-500 shrink-0') ?> Match has ended (FT) — voting is closed. You cannot vote on completed matches.
      </div>
    <?php elseif ($totalVotes === 0): ?>
      <div class="text-[10px] font-mono text-amber-900 bg-amber-50 p-1.5 rounded-lg border border-amber-300 flex items-center gap-1 pt-0.5 font-bold">
        <?= renderIcon('star', 'w-3 h-3 text-amber-600 fill-amber-500 shrink-0') ?> No votes yet — Tap an option above to cast the first vote!
      </div>
    <?php else: ?>
      <div class="text-[10px] font-mono text-emerald-700 flex items-center gap-1 pt-0.5 font-semibold">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span> You can vote now! Tap your selection before kickoff.
      </div>
    <?php endif; ?>

  </div>

<?php endif; ?>

</div>
