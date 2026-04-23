// ListView — rebuilt to match Figma spec at 2756px wide.
// Columns: No | 進捗状況(300) | アクション(120) | イベントID(120) | イベント名(340) |
//          チェックリスト(149) | 料金モデル(149) | 振込月(149) | 著作権処理(149) | 主催者会社名(149) |
//          主催者口座情報(149) | 精算報告書(149) | 金額(ｴｰｼﾞｪﾝｼｰ)(149) | 金額(主催)(149) | 承認日(149) |
//          デスク担当名/営業/計上部署(280)
const { useState, useEffect, useMemo, useRef } = React;

// ─── Column customize dropdown ──────────────────────────────────────
// Pill button that opens a menu listing each optional column with a checkbox.
// Currently a display-only control — selection state is local so users can toggle visibility.
const COL_OPTIONS = [
  { id: "checklist",    label: "チェックリスト",       width: 149 },
  { id: "pricing",      label: "料金モデル",           width: 149 },
  { id: "payoutMonth",  label: "振込月",               width: 149 },
  { id: "copyright",    label: "著作権処理有無",       width: 149 },
  { id: "client",       label: "主催者会社名",         width: 149 },
  { id: "bank",         label: "主催者口座情報",       width: 189 },
  { id: "report",       label: "精算報告書",           width: 149 },
  { id: "amountAgency", label: "金額（代理店）",       width: 149 },
  { id: "amountClient", label: "金額（主催）",         width: 149 },
  { id: "approval",     label: "承認日",               width: 149 },
  { id: "desk",         label: "デスク担当/営業/部署", width: 280 },
];
// First 4 columns (after No) are toggle-able but sticky when visible
const FIXED_COL_OPTIONS = [
  { id: "status",  label: "進捗状況",               width: 300 },
  { id: "action",  label: "アクション",              width: 120 },
  { id: "eventId", label: "イベントID",               width: 120 },
  { id: "name",    label: "イベント期間/イベント名",  width: 340 },
];

const ColumnCustomizer = ({ visible, toggle, onShowAll, onHideAll }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  return (
    <div className="col-customizer" ref={ref}>
      <button className={`cc-trigger ${open ? "open" : ""}`} onClick={() => setOpen(o => !o)}>
        <Icon.customize style={{ width: 16, height: 16 }} />
        <span>列をカスタマイズする</span>
        <Icon.chevDown style={{ width: 14, height: 14 }} />
      </button>
      {open && (
        <div className="cc-menu">
          <div className="cc-menu-head">表示する列を選択</div>
          {[...FIXED_COL_OPTIONS, ...COL_OPTIONS].map(c => (
            <label key={c.id} className="cc-opt">
              <input type="checkbox" checked={visible.has(c.id)} onChange={() => toggle(c.id)} />
              <span>{c.label}</span>
            </label>
          ))}
          <div className="cc-menu-foot">
            <button className="cc-link" onClick={onShowAll}>すべて表示</button>
            <button className="cc-link" onClick={onHideAll}>すべて非表示</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Phase → color palette from Figma (confirmed from screenshot uploads/2026-04-21)
// Phase 1, 3, revision (Lawson action side / pink magenta) = purple
// Phase 2, 4 (waiting on Zaiko gray) = gray
// Phase 5 (complete) = green
const PHASE_COLORS = {
  "1":        { on: "#B13C9E", off: "#F4E0F3", label: "#525252" },
  "2":        { on: "#737373", off: "#D4D4D4", label: "#525252" },
  "revision": { on: "#737373", off: "#D4D4D4", label: "#525252" },
  "3":        { on: "#B13C9E", off: "#F4E0F3", label: "#525252" },
  "4":        { on: "#737373", off: "#D4D4D4", label: "#525252" },
  "5":        { on: "#3C6300", off: "#D0FAE5", label: "#3C6300" },
};

// ZAIKO view — colors sourced from Figma node 15283:51538 (card view prototype)
// Dark rose #8B0836 = ZAIKO's current action step; gray-pink #BBA3AA = upcoming ZAIKO-side steps;
// Gray #525252 = Lawson-completed steps; light gray #D4D4D4 = not-yet steps; green #3C6300 = done.
const ZAIKO_PHASE_COLORS = {
  "1":        { on: "#D4D4D4", off: "#D4D4D4", label: "#525252" },
  "2":        { on: "#8B0836", off: "#BBA3AA", label: "#525252" },
  "revision": { on: "#8B0836", off: "#BBA3AA", label: "#525252" },
  "3":        { on: "#525252", off: "#D4D4D4", label: "#525252" },
  "4":        { on: "#8B0836", off: "#BBA3AA", label: "#525252" },
  "5":        { on: "#3C6300", off: "#D0FAE5", label: "#3C6300" },
};

const PhaseProgress = ({ phase, viewMode = "lawson" }) => {
  const conf = (viewMode === "zaiko" ? ZAIKO_PHASES : PHASES)[phase];
  const c    = (viewMode === "zaiko" ? ZAIKO_PHASE_COLORS : PHASE_COLORS)[phase];
  const isDone = phase === "5";

  if (viewMode === "zaiko") {
    const pct = isDone ? 100 : ((conf.idx + 1) / 5) * 100;
    const isLawsonSide = phase === "1" || phase === "3";
    const fillColor = isDone ? "#059669" : isLawsonSide ? "#9CA3AF" : "#4F46E5";
    return (
      <div className="progress-cell">
        <div className="tw-progress-track">
          <div className="tw-progress-fill" style={{ width: `${pct}%`, background: fillColor }} />
        </div>
        <div className="progress-label" style={{ color: c.label }}>{conf.label}</div>
      </div>
    );
  }

  return (
    <div className="progress-cell">
      <div className="progress-bars">
        {[0, 1, 2, 3, 4].map(i => {
          const active = isDone ? true : i <= conf.idx;
          return (
            <div key={i} className="progress-bar" style={{
              background: active ? c.on : c.off,
              borderTopLeftRadius: i === 0 ? 8 : 0,
              borderBottomLeftRadius: i === 0 ? 8 : 0,
              borderTopRightRadius: i === 4 ? 8 : 0,
              borderBottomRightRadius: i === 4 ? 8 : 0,
            }} />
          );
        })}
      </div>
      <div className="progress-label" style={{ color: c.label }}>{conf.label}</div>
    </div>
  );
};

// 3-item menu for 清算報告書 cell ellipsis (Figma 14206:129590)
const ReportCellMenu = ({ event, onClose, anchor, onAction }) => {
  const ref = useRef(null);
  useEffect(() => {
    const click = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener("mousedown", click), 0);
    return () => document.removeEventListener("mousedown", click);
  }, []);
  const rect = anchor?.getBoundingClientRect();
  const style = rect ? { position: "fixed", top: rect.bottom + 4, left: Math.max(12, rect.right - 220) } : {};
  return (
    <div ref={ref} className="dropdown-menu" style={style}>
      <button className="dropdown-item" onClick={() => { onAction("versions", event); onClose(); }}><Icon.history />ファイルバージョン管理</button>
      <button className="dropdown-item" onClick={() => { onAction("download", event); onClose(); }}><Icon.download />ファイルダウンロード</button>
      <button className="dropdown-item" onClick={() => { onAction("upload", event); onClose(); }}><Icon.upload />ファイルアップロード</button>
    </div>
  );
};

const RowMenu = ({ event, onClose, anchor, onAction }) => {
  const ref = useRef(null);
  useEffect(() => {
    const click = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener("mousedown", click), 0);
    return () => document.removeEventListener("mousedown", click);
  }, []);
  const rect = anchor?.getBoundingClientRect();
  const style = rect ? { position: "fixed", top: rect.bottom + 4, left: Math.max(12, rect.right - 200) } : {};
  return (
    <div ref={ref} className="dropdown-menu" style={style}>
      <button className="dropdown-item" onClick={() => { onAction("open", event); onClose(); }}><Icon.edit />詳細を見る / 編集</button>
      <button className="dropdown-item" onClick={() => { onAction("versions", event); onClose(); }}><Icon.history />バージョン管理</button>
      <button className="dropdown-item" onClick={() => { onAction("revision", event); onClose(); }}><Icon.comment />修正メッセージを送る</button>
      <button className="dropdown-item" onClick={() => { onAction("download", event); onClose(); }}><Icon.download />CSVダウンロード</button>
      <div style={{ height: 1, background: "var(--n-7)", margin: "4px 0" }} />
      <button className="dropdown-item danger" onClick={() => { onAction("archive", event); onClose(); }}><Icon.x />アーカイブ</button>
    </div>
  );
};

const MONTHS_JP = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

const MonthPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(() => value ? parseInt(value.split("-")[0]) : new Date().getFullYear());
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const display = value ? `${value.split("-")[0]}年${parseInt(value.split("-")[1])}月` : "";

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <div
        className="sf-input"
        style={{ cursor: "pointer", borderColor: open ? "var(--n-2)" : "", boxShadow: open ? "0 0 0 3px rgba(10,10,10,0.06)" : "" }}
        onClick={() => setOpen(o => !o)}
      >
        <Icon.calendar />
        <span style={{ flex: 1, fontSize: 14, color: value ? "var(--n-0)" : "var(--n-4)" }}>
          {display || "イベント終了月を選択"}
        </span>
        {value && (
          <button className="clear" onClick={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }}>
            <Icon.x style={{ width: 12, height: 12 }} />
          </button>
        )}
      </div>
      {open && (
        <div className="mp-dropdown">
          <div className="mp-header">
            <button className="mp-nav" onClick={(e) => { e.stopPropagation(); setYear(y => y - 1); }}>
              <Icon.chevLeft style={{ width: 14, height: 14 }} />
            </button>
            <span className="mp-year">{year}年</span>
            <button className="mp-nav" onClick={(e) => { e.stopPropagation(); setYear(y => y + 1); }}>
              <Icon.chevRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
          <div className="mp-grid">
            {MONTHS_JP.map((m, i) => {
              const v = `${year}-${String(i + 1).padStart(2, "0")}`;
              return (
                <button
                  key={i}
                  className={`mp-month-btn ${value === v ? "active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); onChange(v); setOpen(false); }}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const TAB_VARIANT = { all: "tab-all", required: "tab-required", waiting: "tab-waiting", done: "tab-done" };

const FilterTabs = ({ activeTab, setTab }) => (
  <div className="tabs">
    {Object.entries(TAB_MAP).map(([k, v]) => (
      <button key={k} className={`tab ${TAB_VARIANT[k] || "tab-all"} ${activeTab === k ? "active" : ""}`} onClick={() => setTab(k)}>
        {v.label}
      </button>
    ))}
  </div>
);

const formatYen = (n) => n.toLocaleString("en-US");

// Cell with yen + chat bubble + ellipsis, per Figma TypeOfCellNumbersAnd
const MoneyCell = ({ value, noteText, onNoteHover, onMenu }) => (
  <div className="money-cell">
    <span className="money-value">{formatYen(value)}</span>
    <span className="money-icons">
      {noteText ? (
        <button
          className="mcell-ic"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => onNoteHover?.(e.currentTarget.getBoundingClientRect(), noteText)}
          onMouseLeave={() => onNoteHover?.(null)}
          title="メモ"
        >
          <Icon.chat style={{ width: 14, height: 14 }} />
        </button>
      ) : (
        <span className="mcell-ic disabled"><Icon.chat style={{ width: 14, height: 14 }} /></span>
      )}
      <button className="mcell-ic" onClick={(e) => { e.stopPropagation(); onMenu?.(e); }} title="メニュー">
        <Icon.ellipsisV style={{ width: 14, height: 14 }} />
      </button>
    </span>
  </div>
);

const OptionalActionCell = ({ label = "任意", color = "var(--n-3)", onClick }) => (
  <div className="oa-cell" style={{ color, cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
    <span>{label}</span>
    <Icon.pencil style={{ width: 13, height: 13 }} />
  </div>
);

const PAGE_SIZE = 10;

const ListView = ({ events, activeTab, setTab, search, setSearch, dateRange, setDateRange, view, setView, onRowClick, onRowAction, onToast, viewMode = "lawson" }) => {
  const [menu, setMenu] = useState(null);
  const [reportMenu, setReportMenu] = useState(null);
  const [revTip, setRevTip] = useState(null);
  const [noteTip, setNoteTip] = useState(null);
  const [page, setPage] = useState(1);
  const handleNoteHover = (rect, text) => setNoteTip(rect && text ? { rect, text } : null);
  const [visible, setVisible] = useState(() => new Set([
    ...FIXED_COL_OPTIONS.map(c => c.id),
    ...COL_OPTIONS.map(c => c.id),
  ]));
  const toggle = (id) => setVisible(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  const visibleCols = useMemo(() => [...FIXED_COL_OPTIONS, ...COL_OPTIONS].filter(c => visible.has(c.id)), [visible]);
  const tableMinWidth = 60 + visibleCols.reduce((a, c) => a + c.width, 0);

  // Pixel left-offset for each horizontally-sticky column (No is always 0)
  const stickyLeft = useMemo(() => {
    const order = [{ id: "status", width: 300 }, { id: "action", width: 120 }, { id: "eventId", width: 120 }];
    let left = 60;
    const result = {};
    for (const col of order) {
      if (visible.has(col.id)) { result[col.id] = left; left += col.width; }
    }
    return result;
  }, [visible]);

  const filtered = useMemo(() => {
    let arr = events.filter(e => TAB_MAP[activeTab].matches(e));
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(e => e.title.toLowerCase().includes(q) || e.eventId.includes(q));
    }
    if (dateRange) {
      const [yr, mo] = dateRange.split("-");
      arr = arr.filter(e => {
        const end = e.dates.split(" - ")[1];
        if (!end) return true;
        const [ey, em] = end.split("/");
        return ey === yr && em === mo;
      });
    }
    return arr;
  }, [events, activeTab, search, dateRange]);

  useEffect(() => { setPage(1); }, [activeTab, search, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">エージェンシーイベント清算書</h1>
      </div>

      <div className="search-filter">
        <div className="sf-row">
          <div className="sf-field">
            <label>イベント終了月</label>
            <MonthPicker value={dateRange} onChange={setDateRange} />
          </div>
          <div className="sf-field">
            <label>キーワード</label>
            <div className="sf-input">
              <Icon.search />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="イベント名、IDで検索" />
              {search && <button className="clear" onClick={() => setSearch("")}><Icon.x style={{ width: 12, height: 12 }} /></button>}
            </div>
          </div>
        </div>
      </div>

      <div className="tabs-row" style={{ marginTop: 20 }}>
        <FilterTabs activeTab={activeTab} setTab={setTab} />
        <div className="view-switch">
          <button className={`view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")} title="リスト"><Icon.table /></button>
          <button className={`view-btn ${view === "card" ? "active" : ""}`} onClick={() => setView("card")} title="カード"><Icon.cards /></button>
        </div>
      </div>

      <ColumnCustomizer
        visible={visible}
        toggle={toggle}
        onShowAll={() => setVisible(new Set([...FIXED_COL_OPTIONS.map(c => c.id), ...COL_OPTIONS.map(c => c.id)]))}
        onHideAll={() => setVisible(new Set())}
      />

      <div className="fig-table-wrap">
        <table className="fig-table" style={{ minWidth: tableMinWidth }}>
          <colgroup>
            <col style={{ width: 60 }} />
            {visible.has("status")       && <col style={{ width: 300 }} />}
            {visible.has("action")       && <col style={{ width: 120 }} />}
            {visible.has("eventId")      && <col style={{ width: 120 }} />}
            {visible.has("name")         && <col style={{ width: 340 }} />}
            {visible.has("checklist")    && <col style={{ width: 149 }} />}
            {visible.has("pricing")      && <col style={{ width: 149 }} />}
            {visible.has("payoutMonth")  && <col style={{ width: 149 }} />}
            {visible.has("copyright")    && <col style={{ width: 149 }} />}
            {visible.has("client")       && <col style={{ width: 149 }} />}
            {visible.has("bank")         && <col style={{ width: 189 }} />}
            {visible.has("report")       && <col style={{ width: 149 }} />}
            {visible.has("amountAgency") && <col style={{ width: 149 }} />}
            {visible.has("amountClient") && <col style={{ width: 149 }} />}
            {visible.has("approval")     && <col style={{ width: 149 }} />}
            {visible.has("desk")         && <col style={{ width: 280 }} />}
          </colgroup>
          <thead>
            <tr>
              <th className="sticky-col col-no" style={{ left: 0 }}>No</th>
              {visible.has("status")       && <th className="sticky-col" style={{ left: stickyLeft.status }}>進捗状況</th>}
              {visible.has("action")       && <th className="sticky-col" style={{ left: stickyLeft.action }}>アクション</th>}
              {visible.has("eventId")      && <th className="sticky-col col-eid" style={{ left: stickyLeft.eventId }}>イベントID</th>}
              {visible.has("name")         && <th className="col-name">イベント期間/イベント名</th>}
              {visible.has("checklist")    && <th>チェックリスト</th>}
              {visible.has("pricing")      && <th>料金モデル</th>}
              {visible.has("payoutMonth")  && <th>振込月</th>}
              {visible.has("copyright")    && <th>著作権処理有無</th>}
              {visible.has("client")       && <th>主催者会社名</th>}
              {visible.has("bank")         && <th>主催者口座情報</th>}
              {visible.has("report")       && <th>精算報告書</th>}
              {visible.has("amountAgency") && <th className="col-num">金額（代理店）</th>}
              {visible.has("amountClient") && <th className="col-num">金額（主催）</th>}
              {visible.has("approval")     && <th>承認日</th>}
              {visible.has("desk")         && <th>デスク担当/営業/部署</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={1 + visibleCols.length} style={{ textAlign: "center", padding: "40px 0" }}>
                  <div className="empty-state" style={{ display: "inline-flex" }}>
                    <Icon.search /><h3>該当するイベントが見つかりません</h3>
                    <p style={{ margin: 0 }}>検索条件を変更してください</p>
                  </div>
                </td>
              </tr>
            )}
            {paginated.map(ev => {
              const isRequired = viewMode === "zaiko"
                ? (ev.phase === "2" || ev.phase === "4" || ev.phase === "revision")
                : (ev.phase === "1" || ev.phase === "3");
              const isDone = ev.phase === "5";
              const ctaClass = viewMode === "zaiko" ? "cta cta-pink" : "cta";
              const requiredColor = viewMode === "zaiko" ? "var(--pink)" : "var(--purple)";
              return (
                <tr key={ev.id}>
                  <td className="sticky-col col-no" style={{ left: 0 }}>{String(ev.no).padStart(2, "0")}</td>
                  {visible.has("status") && (
                    <td className="sticky-col" style={{ left: stickyLeft.status, overflow: "visible" }}>
                      <PhaseProgress phase={ev.phase} viewMode={viewMode} />
                    </td>
                  )}
                  {visible.has("action") && (
                    <td className="sticky-col" style={{ left: stickyLeft.action }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        {isRequired
                          ? <button className={ctaClass} onClick={(e) => { e.stopPropagation(); onRowAction("action", ev); }}>対応開始</button>
                          : <button className="cta-ghost" onClick={(e) => { e.stopPropagation(); onRowAction("action", ev); }}>編集</button>
                        }
                        {((viewMode === "zaiko" && (ev.revisionMessage || ev.zaikoReply)) ||
                          (viewMode === "lawson" && ev.phase === "revision" && ev.revisionMessage)) && (
                          <span
                            style={{ display: "inline-flex", cursor: "default" }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={(e) => setRevTip({ rect: e.currentTarget.getBoundingClientRect(), ev })}
                            onMouseLeave={() => setRevTip(null)}
                          >
                            <Icon.exclaim style={{ width: 14, height: 14, color: "#B45309" }} />
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  {visible.has("eventId") && (
                    <td className="sticky-col col-eid" style={{ left: stickyLeft.eventId }}>{ev.eventId}</td>
                  )}
                  {visible.has("name") && (
                    <td className="col-name">
                      <div className="n-title">{ev.title}</div>
                      <div className="n-dates">{ev.dates}</div>
                    </td>
                  )}
                  {visible.has("checklist") && (
                    <td>
                      {viewMode === "zaiko"
                        ? (ev.form?.checklist ? <a className="lnk-cell" href={ev.form.checklist} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><Icon.link style={{ width: 13, height: 13 }} />LINK TITLE</a> : null)
                        : (ev.phase === "1"
                          ? <OptionalActionCell label="必須" color={requiredColor} onClick={(e) => { e.stopPropagation(); onRowAction("action", ev); }} />
                          : <a className="lnk-cell" href={ev.form?.checklist || "#"} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><Icon.link style={{ width: 13, height: 13 }} />LINK TITLE</a>)
                      }
                    </td>
                  )}
                  {visible.has("pricing")     && <td>{ev.fee}</td>}
                  {visible.has("payoutMonth") && <td>{ev.cprMonth}</td>}
                  {visible.has("copyright") && (
                    <td>
                      {viewMode === "zaiko"
                        ? (ev.form?.copyright || ev.copyright || null)
                        : (isRequired
                          ? <OptionalActionCell label="必須" color={requiredColor} onClick={(e) => { e.stopPropagation(); onRowAction("action", ev); }} />
                          : ev.copyright)
                      }
                    </td>
                  )}
                  {visible.has("client") && (
                    <td>
                      {viewMode === "zaiko"
                        ? (ev.desk || null)
                        : (isRequired
                          ? <OptionalActionCell label="必須" color={requiredColor} onClick={(e) => { e.stopPropagation(); onRowAction("action", ev); }} />
                          : ev.desk)
                      }
                    </td>
                  )}
                  {visible.has("bank") && (
                    <td style={{ whiteSpace: "normal", overflow: "visible" }}>
                      {viewMode === "zaiko"
                        ? (ev.bank ? <div className="bank-info">{ev.bank}</div> : null)
                        : (isRequired
                          ? <OptionalActionCell label="必須" color={requiredColor} onClick={(e) => { e.stopPropagation(); onRowAction("action", ev); }} />
                          : <div className="bank-info">{ev.bank}</div>)
                      }
                    </td>
                  )}
                  {visible.has("report") && (
                    <td style={{ overflow: "visible" }}>
                      <div className="report-cell">
                        <span className="lnk-cell"><Icon.link style={{ width: 13, height: 13 }} />精算書_v1.pdf</span>
                        <button className="mcell-ic" onClick={(e) => { e.stopPropagation(); setReportMenu({ event: ev, anchor: e.currentTarget }); }} title="メニュー">
                          <Icon.ellipsisV style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </td>
                  )}
                  {visible.has("amountAgency") && (
                    <td className="col-num" style={{ overflow: "visible" }}>
                      <MoneyCell
                        value={ev.agencyAmount}
                        noteText={ev.agencyNotes}
                        onNoteHover={handleNoteHover}
                        onMenu={(e) => setReportMenu({ event: ev, anchor: e.currentTarget })}
                      />
                    </td>
                  )}
                  {visible.has("amountClient") && (
                    <td className="col-num" style={{ overflow: "visible" }}>
                      <MoneyCell
                        value={ev.organizerPayout}
                        noteText={ev.organizerNotes}
                        onNoteHover={handleNoteHover}
                        onMenu={(e) => setReportMenu({ event: ev, anchor: e.currentTarget })}
                      />
                    </td>
                  )}
                  {visible.has("approval") && (
                    <td className="col-muted">{isDone ? ev.updatedAt.split(" ")[0] : "—"}</td>
                  )}
                  {visible.has("desk") && (
                    <td style={{ whiteSpace: "normal", overflow: "visible" }}>
                      {viewMode === "zaiko"
                        ? (ev.form?.deskName
                            ? <div className="desk-info">
                                <div>{ev.form.deskName}</div>
                                <div className="muted">営業: {ev.form.salesName || "—"}</div>
                                <div className="muted">{ev.form.department || "—"}</div>
                              </div>
                            : null)
                        : (isRequired
                            ? <OptionalActionCell label="任意" />
                            : <div className="desk-info">
                                <div>{ev.desk}</div>
                                <div className="muted">営業: 山田 健司</div>
                                <div className="muted">第2営業部</div>
                              </div>)
                      }
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>{pageStart + 1} - {Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length} results</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button className="td-ellipsis" disabled={page === 1} onClick={() => setPage(p => p - 1)}><Icon.chevLeft style={{ width: 16, height: 16 }} /></button>
          <span style={{ padding: "0 8px", fontWeight: 600 }}>{page}</span>
          <button className="td-ellipsis" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><Icon.chevRight style={{ width: 16, height: 16 }} /></button>
        </span>
      </div>

      {menu && <RowMenu event={menu.event} anchor={menu.anchor} onClose={() => setMenu(null)} onAction={onRowAction} />}
      {reportMenu && <ReportCellMenu event={reportMenu.event} anchor={reportMenu.anchor} onClose={() => setReportMenu(null)} onAction={onRowAction} />}
      {noteTip && (
        <div
          className="note-fixed-tip"
          style={{
            position: "fixed",
            top: noteTip.rect.bottom + 6,
            left: Math.max(12, Math.min(window.innerWidth - 300, noteTip.rect.left - 120)),
          }}
        >
          {noteTip.text}
        </div>
      )}
      {revTip && (
        <div
          className="revision-fixed-tip"
          style={{
            position: "fixed",
            top: revTip.rect.bottom + 6,
            left: Math.max(12, Math.min(window.innerWidth - 320, revTip.rect.left - 140)),
          }}
        >
          {revTip.ev.zaikoReply && (
            <div className="revision-tip-entry">
              <div>{revTip.ev.zaikoReply}</div>
              <div className="revision-tip-meta">ZAIKO {revTip.ev.zaikoReplyDate || revTip.ev.updatedAt?.split(" ")[0]}</div>
            </div>
          )}
          {revTip.ev.revisionMessage && (
            <div className="revision-tip-entry">
              <div style={{ whiteSpace: "pre-wrap" }}>{revTip.ev.revisionMessage}</div>
              <div className="revision-tip-meta">LAWSON {revTip.ev.revisionDate || "—"}</div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

window.ListView = ListView;
window.FilterTabs = FilterTabs;
window.MonthPicker = MonthPicker;
window.PhaseProgress = PhaseProgress;
window.formatYen = formatYen;
