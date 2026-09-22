$ErrorActionPreference = "Stop"

$workspaceDir = "D:\AntigravityIDE\LifeInUK\LifeInUK-main"
$jsonPath = Join-Path $workspaceDir "src\data\study_guide.json"
$outputPath = Join-Path $workspaceDir "LifeInUK_Offline_StudyGuide.html"

Write-Host "Reading study_guide.json from $jsonPath..."
$studyGuideJson = Get-Content $jsonPath -Raw -Encoding UTF8

$htmlTemplate = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Life in the UK - Offline Study Guide (單機離線雙語版)</title>
  <style>
    :root {
      --bg: #f9fafb;
      --card-bg: #ffffff;
      --text-main: #111827;
      --text-muted: #4b5563;
      --text-sub: #6b7280;
      --border: #e5e7eb;
      --primary: #1e40af;
      --primary-light: #eff6ff;
      --amber: #d97706;
      --amber-bg: #fffbeb;
      --amber-border: #f59e0b;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang HK", "Microsoft JhengHei", "Noto Sans TC", sans-serif;
      font-size: 18px;
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .app-header {
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .header-inner {
      max-width: 768px;
      margin: 0 auto;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .app-title {
      font-size: 1.25rem;
      font-weight: 900;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    .badge-offline {
      font-size: 0.7rem;
      font-weight: 800;
      background: #dbeafe;
      color: #1e40af;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .btn-lang {
      min-height: 40px;
      padding: 0 14px;
      border-radius: 10px;
      border: 1px solid #d1d5db;
      background: #f3f4f6;
      color: #1f2937;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .main-container {
      max-width: 768px;
      width: 100%;
      margin: 0 auto;
      padding: 20px 16px 40px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .index-heading {
      font-size: 1.75rem;
      font-weight: 900;
      color: var(--text-main);
    }
    .index-subheading {
      font-size: 0.875rem;
      color: var(--text-sub);
      margin-top: 4px;
      margin-bottom: 20px;
    }
    .sector6-card {
      background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%);
      border: 2px solid var(--amber-border);
      border-radius: 16px;
      padding: 18px;
      margin-bottom: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .sector6-card:active {
      transform: scale(0.98);
    }
    .sector6-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }
    .sector6-icon {
      width: 46px;
      height: 46px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #ffffff;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      font-weight: 900;
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(217, 119, 6, 0.3);
    }
    .sector6-badge-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
    }
    .pill-sector6 {
      background: #f59e0b;
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 900;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .pill-unlocked {
      background: #fef3c7;
      color: #92400e;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .sector6-title {
      font-size: 1.15rem;
      font-weight: 900;
      color: #111827;
    }
    .sector6-desc {
      font-size: 0.8rem;
      color: #78350f;
      margin-top: 2px;
    }
    .sector6-count-badge {
      background: #ffffff;
      color: #92400e;
      border: 1px solid #fde68a;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 10px;
      flex-shrink: 0;
      font-family: monospace;
    }
    .progress-bar-bg {
      width: 100%;
      height: 10px;
      background: #e5e7eb;
      border-radius: 9999px;
      overflow: hidden;
    }
    .progress-bar-amber {
      height: 100%;
      background: linear-gradient(90deg, #f59e0b, #ea580c);
      border-radius: 9999px;
      transition: width 0.3s ease;
    }
    .progress-bar-blue {
      height: 100%;
      background: #2563eb;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }
    .tip-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 14px;
      padding: 14px;
      margin-bottom: 24px;
      display: flex;
      gap: 12px;
      font-size: 0.85rem;
      color: #1e3a8a;
      line-height: 1.5;
    }
    .chapter-card {
      background: #ffffff;
      border: 2px solid var(--border);
      border-radius: 16px;
      padding: 18px;
      margin-bottom: 14px;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      transition: border-color 0.15s ease, transform 0.15s ease;
    }
    .chapter-card:active {
      transform: scale(0.99);
      border-color: #3b82f6;
    }
    .chapter-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .chapter-id-badge {
      width: 40px;
      height: 40px;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 12px;
      font-weight: 900;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .chapter-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .chapter-sub {
      font-size: 0.8rem;
      color: var(--text-sub);
    }
    .card-view {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .sticky-top-bar {
      position: sticky;
      top: 60px;
      z-index: 40;
      background: var(--bg);
      padding: 10px 0 14px;
      margin-bottom: 16px;
    }
    .btn-back {
      color: #2563eb;
      font-weight: 800;
      font-size: 0.85rem;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      background: none;
      border: none;
      margin-bottom: 6px;
    }
    .learning-card {
      background: #ffffff;
      border: 2px solid var(--border);
      border-radius: 20px;
      padding: 24px 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .learning-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f3f4f6;
      padding-bottom: 12px;
    }
    .btn-bookmark {
      min-height: 42px;
      padding: 0 14px;
      border-radius: 9999px;
      border: 2px solid #d1d5db;
      background: #ffffff;
      color: #4b5563;
      font-size: 0.75rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-bookmark.flagged {
      border-color: #f59e0b;
      background: #fffbeb;
      color: #78350f;
    }
    .learning-en {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.45;
      margin: 20px 0 16px;
    }
    .learning-zh {
      font-size: 1.15rem;
      color: #374151;
      line-height: 1.6;
      border-top: 1px solid #f3f4f6;
      padding-top: 16px;
    }
    .dual-controls {
      display: flex;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
    .btn-nav-prev {
      flex: 1;
      min-height: 54px;
      border-radius: 14px;
      border: 2px solid #d1d5db;
      background: #ffffff;
      color: #1f2937;
      font-size: 1.05rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
    }
    .btn-nav-prev:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .btn-nav-next {
      flex: 1;
      min-height: 54px;
      border-radius: 14px;
      border: none;
      background: #111827;
      color: #ffffff;
      font-size: 1.05rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .btn-nav-prev:active, .btn-nav-next:active {
      transform: scale(0.98);
    }
    .hidden {
      display: none !important;
    }
  </style>
</head>
<body>

  <!-- App Header -->
  <header class="app-header">
    <div class="header-inner">
      <div class="app-title" onclick="showIndex()">
        <span>Life in the UK</span>
        <span class="badge-offline">Offline App</span>
      </div>
      <button class="btn-lang" id="btnLangToggle" onclick="toggleLanguage()">EN / 繁</button>
    </div>
  </header>

  <main class="main-container">

    <!-- VIEW 1: Main Study Guide Index -->
    <div id="viewIndex">
      <h1 class="index-heading" id="txtMainTitle">溫習指南 (Study Guide)</h1>
      <p class="index-subheading" id="txtMainSub">官方入籍考試重點考點 • 100% 離線運行版</p>

      <!-- SECTOR 6: Dedicated Flagged Points Bank (Progressively Revealed) -->
      <div id="sector6Wrapper" class="hidden">
        <div class="sector6-card" onclick="openChapter('flagged')">
          <div class="sector6-header">
            <div style="display:flex; gap:12px; align-items:center;">
              <div class="sector6-icon">★</div>
              <div>
                <div class="sector6-badge-row">
                  <span class="pill-sector6">★ flagged • 專屬難題庫</span>
                  <span class="pill-unlocked">已解鎖</span>
                </div>
                <div class="sector6-title" id="txtSector6Title">已標記難題庫 (Flagged Points)</div>
                <div class="sector6-desc">集中複習所有標記難題，點擊立即開始</div>
              </div>
            </div>
            <div class="sector6-count-badge" id="txtSector6CountBadge">0 題難題</div>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700; color:#92400e; margin-top:14px; margin-bottom:4px;">
            <span>難題溫習進度 (Progress)</span>
            <span id="txtSector6Pct">0%</span>
          </div>
          <div class="progress-bar-bg">
            <div id="barSector6" class="progress-bar-amber" style="width: 0%;"></div>
          </div>
        </div>
      </div>

      <!-- Guiding Tip when 0 items are flagged -->
      <div id="boxZeroFlagsTip" class="tip-box">
        <div style="font-size:1.3rem;">💡</div>
        <div>
          <strong style="display:block; margin-bottom:2px;">如何解鎖專屬難題庫？</strong>
          在任一單元溫習時，點擊卡片右上角的「<strong>★ 標記難題</strong>」，系統便會為您<strong>自動解鎖專屬難題庫</strong>！
        </div>
      </div>

      <div style="font-size:0.75rem; font-weight:800; color:var(--text-sub); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px;">
        Syllabus Chapters • 官方課程單元 (1 - 5)
      </div>

      <!-- Chapter List -->
      <div id="chapterListContainer"></div>
    </div>

    <!-- VIEW 2: Study Card Session -->
    <div id="viewCard" class="card-view hidden">
      <div class="sticky-top-bar">
        <button class="btn-back" onclick="showIndex()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span id="txtBackLabel">返回單元列表 (Back)</span>
        </button>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h2 id="txtCardChapterTitle" style="font-size:1.05rem; font-weight:900; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></h2>
          <span id="txtCardCounter" style="font-size:0.85rem; font-weight:800; font-family:monospace; color:var(--text-sub); margin-left:8px; flex-shrink:0;">1 / 1</span>
        </div>
        <div class="progress-bar-bg" style="margin-top:8px;">
          <div id="barCardProgress" class="progress-bar-blue" style="width: 20%;"></div>
        </div>
      </div>

      <div class="learning-card">
        <div class="learning-card-top">
          <span id="txtCardBadge" style="font-size:0.7rem; font-weight:900; text-transform:uppercase; padding:3px 8px; border-radius:6px; background:#eff6ff; color:#1e40af;">
            KEY LEARNING POINT
          </span>
          <button id="btnBookmarkCard" class="btn-bookmark" onclick="toggleCurrentBookmark()">
            <span id="txtBookmarkStar">★</span>
            <span id="txtBookmarkLabel">標記難題 (Flag)</span>
          </button>
        </div>

        <div style="margin:auto 0;">
          <div class="learning-en" id="txtLearningEn"></div>
          <div class="learning-zh" id="txtLearningZh"></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.7rem; color:var(--text-sub); border-top:1px solid #f3f4f6; padding-top:12px;">
          <span id="txtCardPointId">Point ID</span>
          <span>Life in the UK Official Handbook</span>
        </div>
      </div>

      <!-- Dual Navigation Buttons -->
      <div class="dual-controls">
        <button id="btnNavPrev" class="btn-nav-prev" onclick="navStep(-1)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span id="txtNavPrevLabel">上一頁 (Prev)</span>
        </button>
        <button id="btnNavNext" class="btn-nav-next" onclick="navStep(1)">
          <span id="txtNavNextLabel">下一頁 (Next)</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

  </main>

  <script>
    // Embedded Complete Study Guide Dataset
    const studyGuideData = JSON_DATA_PLACEHOLDER;

    // Persistent State Keys
    const KEY_BOOKMARKS = "lifeinuk_offline_bookmarks";
    const KEY_PROGRESS = "lifeinuk_offline_progress";
    const KEY_LANG = "lifeinuk_offline_lang";

    let isEnglish = false;
    let bookmarks = {};
    let progress = {};

    let currentChapterId = 1;
    let currentIndex = 0;

    function initStorage() {
      try {
        const b = localStorage.getItem(KEY_BOOKMARKS);
        if (b) bookmarks = JSON.parse(b);
        const p = localStorage.getItem(KEY_PROGRESS);
        if (p) progress = JSON.parse(p);
        const l = localStorage.getItem(KEY_LANG);
        if (l !== null) isEnglish = l === "true";
      } catch (e) {
        console.error("Storage load error", e);
      }
    }

    function saveBookmarks() {
      try {
        localStorage.setItem(KEY_BOOKMARKS, JSON.stringify(bookmarks));
      } catch (e) {}
    }

    function saveProgress() {
      try {
        localStorage.setItem(KEY_PROGRESS, JSON.stringify(progress));
      } catch (e) {}
    }

    function toggleLanguage() {
      isEnglish = !isEnglish;
      try { localStorage.setItem(KEY_LANG, isEnglish.toString()); } catch(e){}
      updateLangUI();
      if (!document.getElementById("viewIndex").classList.contains("hidden")) {
        renderIndex();
      } else {
        renderCard();
      }
    }

    function updateLangUI() {
      document.getElementById("btnLangToggle").innerText = isEnglish ? "ENG Only" : "EN / 繁";
      document.getElementById("txtMainTitle").innerText = isEnglish ? "Study Guide" : "溫習指南 (Study Guide)";
      document.getElementById("txtMainSub").innerText = isEnglish ? "Official syllabus key learning points" : "官方入籍考試重點考點 • 100% 離線運行版";
      document.getElementById("txtBackLabel").innerText = isEnglish ? "Back to Lessons" : "返回單元列表 (Back)";
    }

    function getAllFlagged() {
      const list = [];
      studyGuideData.forEach(ch => {
        ch.points.forEach(p => {
          if (bookmarks[p.id]) list.push({ ...p, chapterTitle: ch.title, chapterId: ch.chapterId });
        });
      });
      return list;
    }

    function renderIndex() {
      const flagged = getAllFlagged();
      const flaggedCount = flagged.length;

      const sector6Wrapper = document.getElementById("sector6Wrapper");
      const zeroFlagsTip = document.getElementById("boxZeroFlagsTip");

      if (flaggedCount > 0) {
        sector6Wrapper.classList.remove("hidden");
        zeroFlagsTip.classList.add("hidden");
        document.getElementById("txtSector6CountBadge").innerText = `${flaggedCount} 題難題`;

        const reviewed = Math.min(progress["flagged"] || 0, flaggedCount);
        const pct = Math.round((reviewed / flaggedCount) * 100);
        document.getElementById("barSector6").style.width = pct + "%";
        document.getElementById("txtSector6Pct").innerText = `${reviewed} / ${flaggedCount} (${pct}%)`;
      } else {
        sector6Wrapper.classList.add("hidden");
        zeroFlagsTip.classList.remove("hidden");
      }

      const container = document.getElementById("chapterListContainer");
      container.innerHTML = "";

      studyGuideData.forEach(ch => {
        const total = ch.points.length;
        const currentReviewed = Math.min(progress[ch.chapterId.toString()] || 0, total);
        const pct = total > 0 ? Math.round((currentReviewed / total) * 100) : 0;
        const flaggedInChap = ch.points.filter(p => bookmarks[p.id]).length;

        const card = document.createElement("div");
        card.className = "chapter-card";
        card.onclick = () => openChapter(ch.chapterId);
        card.innerHTML = `
          <div class="chapter-header">
            <div style="display:flex; gap:12px; align-items:flex-start; min-width:0;">
              <div class="chapter-id-badge">${ch.chapterId}</div>
              <div style="min-width:0;">
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                  <span style="font-size:0.65rem; font-weight:800; color:var(--text-sub); text-transform:uppercase;">
                    ${isEnglish ? 'Sector ' + ch.chapterId : '單元 ' + ch.chapterId}
                  </span>
                  ${flaggedInChap > 0 ? `<span style="font-size:0.65rem; font-weight:800; background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:1px 6px; border-radius:9999px;">★ ${flaggedInChap} 難題</span>` : ''}
                </div>
                <div class="chapter-title" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  ${isEnglish ? ch.title.en : ch.title.zh}
                </div>
                ${!isEnglish ? `<div class="chapter-sub">${ch.title.en}</div>` : ''}
              </div>
            </div>
            <div style="text-align:right; flex-shrink:0; font-family:monospace; font-size:0.75rem; font-weight:700; color:var(--text-sub); margin-left:8px;">
              ${currentReviewed} / ${total}
              <span style="color:#2563eb; font-weight:800;">(${pct}%)</span>
            </div>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-blue" style="width: ${pct}%;"></div>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function openChapter(id) {
      currentChapterId = id;
      currentIndex = 0;
      document.getElementById("viewIndex").classList.add("hidden");
      document.getElementById("viewCard").classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderCard();
    }

    function showIndex() {
      document.getElementById("viewCard").classList.add("hidden");
      document.getElementById("viewIndex").classList.remove("hidden");
      renderIndex();
    }

    function getActiveList() {
      if (currentChapterId === "flagged") return getAllFlagged();
      const ch = studyGuideData.find(c => c.chapterId.toString() === currentChapterId.toString());
      return ch ? ch.points : [];
    }

    function renderCard() {
      const list = getActiveList();
      const total = list.length;

      // Update progress
      if (total > 0) {
        progress[currentChapterId.toString()] = Math.max(progress[currentChapterId.toString()] || 0, currentIndex + 1);
        saveProgress();
      }

      const isFlagged = currentChapterId === "flagged";

      if (isFlagged) {
        document.getElementById("txtCardChapterTitle").innerText = isEnglish ? "★ flagged • Difficult Points" : "★ flagged • 專屬難題庫";
        document.getElementById("txtCardBadge").innerText = "★ FLAGGED POINTS • 難題複習";
        document.getElementById("txtCardBadge").style.background = "#fffbeb";
        document.getElementById("txtCardBadge").style.color = "#92400e";
        document.getElementById("barCardProgress").className = "progress-bar-amber";
      } else {
        const ch = studyGuideData.find(c => c.chapterId.toString() === currentChapterId.toString());
        document.getElementById("txtCardChapterTitle").innerText = isEnglish ? `Sector ${ch.chapterId}: ${ch.title.en}` : `Sector ${ch.chapterId}: ${ch.title.zh}`;
        document.getElementById("txtCardBadge").innerText = `SECTOR ${ch.chapterId} • 核心考點`;
        document.getElementById("txtCardBadge").style.background = "#eff6ff";
        document.getElementById("txtCardBadge").style.color = "#1e40af";
        document.getElementById("barCardProgress").className = "progress-bar-blue";
      }

      if (total === 0) {
        document.getElementById("txtLearningEn").innerText = "No flagged difficult points in this session.";
        document.getElementById("txtLearningZh").innerText = "此清單目前沒有已標記難題。在各單元學習時點擊「標記難題」即可收藏於此！";
        document.getElementById("txtCardCounter").innerText = "0 / 0";
        document.getElementById("barCardProgress").style.width = "0%";
        document.getElementById("btnNavPrev").disabled = true;
        document.getElementById("btnNavNext").disabled = true;
        document.getElementById("btnBookmarkCard").style.display = "none";
        return;
      }

      document.getElementById("btnBookmarkCard").style.display = "flex";

      if (currentIndex >= total) currentIndex = total - 1;
      if (currentIndex < 0) currentIndex = 0;

      const p = list[currentIndex];

      document.getElementById("txtLearningEn").innerText = p.text.en;
      document.getElementById("txtLearningZh").innerText = p.text.zh;
      document.getElementById("txtLearningZh").style.display = isEnglish ? "none" : "block";
      document.getElementById("txtCardPointId").innerText = `Point ID: ${p.id}`;

      // Progress bar
      const pct = Math.round(((currentIndex + 1) / total) * 100);
      document.getElementById("barCardProgress").style.width = pct + "%";
      document.getElementById("txtCardCounter").innerText = `${currentIndex + 1} / ${total} (${pct}%)`;

      // Buttons
      document.getElementById("btnNavPrev").disabled = currentIndex === 0;
      document.getElementById("txtNavPrevLabel").innerText = isEnglish ? "Previous" : "上一頁 (Prev)";

      const isEnd = currentIndex === total - 1;
      document.getElementById("txtNavNextLabel").innerText = isEnd
        ? (isEnglish ? "Finish" : "返回單元 (Done)")
        : (isEnglish ? "Next" : "下一頁 (Next)");

      // Bookmark Button Styling
      const isBookmarked = !!bookmarks[p.id];
      const btn = document.getElementById("btnBookmarkCard");
      if (isBookmarked) {
        btn.className = "btn-bookmark flagged";
        document.getElementById("txtBookmarkStar").style.color = "#f59e0b";
        document.getElementById("txtBookmarkLabel").innerText = isEnglish ? "Flagged" : "已標記難題 (Flagged)";
      } else {
        btn.className = "btn-bookmark";
        document.getElementById("txtBookmarkStar").style.color = "#9ca3af";
        document.getElementById("txtBookmarkLabel").innerText = isEnglish ? "Flag" : "標記難題 (Flag)";
      }
    }

    function navStep(dir) {
      const list = getActiveList();
      if (dir === -1 && currentIndex > 0) {
        currentIndex--;
        renderCard();
      } else if (dir === 1) {
        if (currentIndex < list.length - 1) {
          currentIndex++;
          renderCard();
        } else {
          showIndex();
        }
      }
    }

    function toggleCurrentBookmark() {
      const list = getActiveList();
      const p = list[currentIndex];
      if (bookmarks[p.id]) {
        delete bookmarks[p.id];
      } else {
        bookmarks[p.id] = true;
      }
      saveBookmarks();
      renderCard();
    }

    // Initialize App
    initStorage();
    updateLangUI();
    renderIndex();
  </script>
</body>
</html>
'@

$finalHtml = $htmlTemplate.Replace("JSON_DATA_PLACEHOLDER", $studyGuideJson)

Write-Host "Writing standalone single-file app to $outputPath..."
[System.IO.File]::WriteAllText($outputPath, $finalHtml, [System.Text.Encoding]::UTF8)

$size = (Get-Item $outputPath).Length
Write-Host "Success! Created single-file app ($size bytes) at $outputPath"
