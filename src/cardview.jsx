// CardView — grid of event cards matching Figma spec
const { useState: useCardState, useEffect: useCardEffect, useRef: useCardRef } = React;

const CardMenu = ({ anchor, onClose, onAction }) => {
  const ref = useCardRef(null);
  useCardEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const rect = anchor?.getBoundingClientRect();
  const style = rect ? { position: "fixed", top: rect.bottom + 4, left: Math.max(12, rect.right - 200) } : {};
  return (
    <div ref={ref} className="dropdown-menu" style={style}>
      <button className="dropdown-item" onClick={() => { onAction("versions"); onClose(); }}>
        <Icon.history />ファイルバージョン管理
      </button>
      <button className="dropdown-item" onClick={() => { onAction("download"); onClose(); }}>
        <Icon.download />ファイルダウンロード
      </button>
      <button className="dropdown-item" onClick={() => { onAction("upload"); onClose(); }}>
        <Icon.upload />ファイルアップロード
      </button>
    </div>
  );
};

const EventCard = ({ ev, onCardClick, onRowAction, viewMode = "lawson" }) => {
  const [expanded, setExpanded] = useCardState(false);
  const [menu, setMenu] = useCardState(null);
  const [amountMenu, setAmountMenu] = useCardState(null);
  const isZaiko = viewMode === "zaiko";
  const isRequired = isZaiko
    ? (ev.phase === "2" || ev.phase === "revision" || ev.phase === "4")
    : (ev.phase === "1" || ev.phase === "3");

  const handleMenuAction = (action) => {
    onRowAction(action, ev);
  };

  return (
    <div className="event-card" onClick={() => onCardClick(ev)}>
      <div className="card-top">
        <span>{ev.eventId}</span>
        <span className="bar" />
        <span>{ev.dates}</span>
      </div>

      <h3 className="card-title">{ev.title}</h3>

      <div className="card-progress-wrap">
        <PhaseProgress phase={ev.phase} viewMode={viewMode} />
      </div>

      <div className="card-report-row" onClick={(e) => e.stopPropagation()}>
        <span className="card-report-label">精算報告書</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a
            className="lnk-cell"
            href="#"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onRowAction("download", ev); }}
          >
            <Icon.link style={{ width: 12, height: 12 }} />精算書_v1.pdf
          </a>
          <button className="menu-btn" style={{ color: "var(--n-3)" }}
            onClick={(e) => { e.stopPropagation(); setMenu({ anchor: e.currentTarget }); }}>
            <Icon.ellipsisV style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>

      <div className="card-amounts" onClick={(e) => e.stopPropagation()}>
        <div className="card-amount-col">
          <span className="card-amt-label">金額（主催）</span>
          <div className="card-amt-row">
            <span className="card-amt-value">{formatYen(ev.organizerPayout)}</span>
            <div style={{ display: "flex", gap: 2 }}>
              {ev.organizerNotes ? (
                <div className="amt-chat-wrap">
                  <button className="mcell-ic"><Icon.chat style={{ width: 13, height: 13 }} /></button>
                  <div className="amt-chat-tooltip">{ev.organizerNotes}</div>
                </div>
              ) : (
                <span className="mcell-ic disabled"><Icon.chat style={{ width: 13, height: 13 }} /></span>
              )}
              <button className="mcell-ic" onClick={(e) => { e.stopPropagation(); setAmountMenu({ anchor: e.currentTarget }); }}>
                <Icon.ellipsisV style={{ width: 13, height: 13 }} />
              </button>
            </div>
          </div>
        </div>
        <div className="card-amount-col">
          <span className="card-amt-label">金額（エージェンシー）</span>
          <div className="card-amt-row">
            <span className="card-amt-value">{formatYen(ev.agencyAmount)}</span>
            <div style={{ display: "flex", gap: 2 }}>
              {ev.agencyNotes ? (
                <div className="amt-chat-wrap">
                  <button className="mcell-ic"><Icon.chat style={{ width: 13, height: 13 }} /></button>
                  <div className="amt-chat-tooltip">{ev.agencyNotes}</div>
                </div>
              ) : (
                <span className="mcell-ic disabled"><Icon.chat style={{ width: 13, height: 13 }} /></span>
              )}
              <button className="mcell-ic" onClick={(e) => { e.stopPropagation(); setAmountMenu({ anchor: e.currentTarget }); }}>
                <Icon.ellipsisV style={{ width: 13, height: 13 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* expand row ABOVE detail list — matches Figma layout */}
      <div className="card-expand-row" onClick={(e) => e.stopPropagation()}>
        <button className="card-expand-btn" onClick={() => setExpanded(x => !x)}>
          その他の詳細
          {expanded
            ? <Icon.chevUp style={{ width: 13, height: 13 }} />
            : <Icon.chevDown style={{ width: 13, height: 13 }} />
          }
        </button>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {isZaiko && (ev.revisionMessage || ev.zaikoReply) && (
            <span className="card-rev-warn">
              <Icon.exclaim style={{ width: 14, height: 14, color: "#B45309" }} />
              <div className="card-rev-tip">
                {ev.zaikoReply && (
                  <div className="revision-tip-entry">
                    <div>{ev.zaikoReply}</div>
                    <div className="revision-tip-meta">ZAIKO {ev.zaikoReplyDate || ev.updatedAt?.split(" ")[0]}</div>
                  </div>
                )}
                {ev.revisionMessage && (
                  <div className="revision-tip-entry">
                    <div style={{ whiteSpace: "pre-wrap" }}>{ev.revisionMessage}</div>
                    <div className="revision-tip-meta">LAWSON {ev.revisionDate || "—"}</div>
                  </div>
                )}
              </div>
            </span>
          )}
          {isRequired ? (
            <button className={`cta ${isZaiko ? "cta-pink" : ""}`} style={{ height: 28, padding: "0 14px", fontSize: 12 }}
              onClick={(e) => { e.stopPropagation(); onRowAction("action", ev); }}>
              対応開始
            </button>
          ) : (
            <button className="cta-ghost" style={{ height: 26, padding: "0 12px", fontSize: 12 }}
              onClick={(e) => { e.stopPropagation(); onRowAction("action", ev); }}>
              編集
            </button>
          )}
        </div>
      </div>

      {expanded && (() => {
        const isLawsonPhase1 = !isZaiko && ev.phase === "1";
        const requiredIndicator = (
          <span
            className="cdi-value"
            style={{ color: "var(--purple)", cursor: "pointer", fontWeight: 700 }}
            onClick={(e) => { e.stopPropagation(); onRowAction("action", ev); }}
          >
            必須
          </span>
        );
        const optionalIndicator = (
          <span className="cdi-value cdi-muted">任意</span>
        );
        const copyrightValue = ev.form?.copyright || ev.copyright;
        return (
          <div className="card-detail-list">
            <div className="card-detail-item">
              <span className="cdi-label">チェックリスト</span>
              {ev.form?.checklist ? (
                <a
                  className="cdi-value cdi-link"
                  href={ev.form.checklist}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon.link style={{ width: 11, height: 11 }} />LINK TITLE
                </a>
              ) : isLawsonPhase1 ? requiredIndicator : (
                <span className="cdi-value cdi-muted">—</span>
              )}
            </div>
            <div className="card-detail-item">
              <span className="cdi-label">料金モデル</span>
              <span className="cdi-value">{ev.fee || "—"}</span>
            </div>
            <div className="card-detail-item">
              <span className="cdi-label">振込月</span>
              <span className="cdi-value">{ev.cprMonth || "—"}</span>
            </div>
            <div className="card-detail-item">
              <span className="cdi-label">著作権処理有無</span>
              {copyrightValue ? (
                <span className="cdi-value">{copyrightValue}</span>
              ) : isLawsonPhase1 ? requiredIndicator : (
                <span className="cdi-value cdi-muted">—</span>
              )}
            </div>
            <div className="card-detail-item">
              <span className="cdi-label">デスク担当名</span>
              {ev.form?.deskName ? (
                <span className="cdi-value">{ev.form.deskName}</span>
              ) : isLawsonPhase1 ? optionalIndicator : (
                <span className="cdi-value cdi-muted">—</span>
              )}
            </div>
            <div className="card-detail-item">
              <span className="cdi-label">営業担当名</span>
              {ev.form?.salesName ? (
                <span className="cdi-value">{ev.form.salesName}</span>
              ) : isLawsonPhase1 ? optionalIndicator : (
                <span className="cdi-value cdi-muted">—</span>
              )}
            </div>
            <div className="card-detail-item">
              <span className="cdi-label">計上部署</span>
              {ev.form?.department ? (
                <span className="cdi-value">{ev.form.department}</span>
              ) : isLawsonPhase1 ? optionalIndicator : (
                <span className="cdi-value cdi-muted">—</span>
              )}
            </div>
            <div className="card-detail-item">
              <span className="cdi-label">主催者会社名</span>
              {ev.desk ? (
                <span className="cdi-value">{ev.desk}</span>
              ) : isLawsonPhase1 ? requiredIndicator : (
                <span className="cdi-value cdi-muted">—</span>
              )}
            </div>
            <div className="card-detail-item">
              <span className="cdi-label">主催者口座情報</span>
              {ev.bank ? (
                <span className="cdi-value" style={{ whiteSpace: "pre-line" }}>{ev.bank}</span>
              ) : isLawsonPhase1 ? requiredIndicator : (
                <span className="cdi-value cdi-muted">—</span>
              )}
            </div>
            <div className="card-detail-item">
              <span className="cdi-label">承認日</span>
              <span className="cdi-value cdi-muted">{ev.phase === "5" ? ev.updatedAt.split(" ")[0] : "—"}</span>
            </div>
          </div>
        );
      })()}

      {menu && (
        <CardMenu
          anchor={menu.anchor}
          onClose={() => setMenu(null)}
          onAction={handleMenuAction}
        />
      )}
      {amountMenu && (
        <CardMenu
          anchor={amountMenu.anchor}
          onClose={() => setAmountMenu(null)}
          onAction={handleMenuAction}
        />
      )}
    </div>
  );
};

const CARD_PAGE_SIZE = 10;
const CardView = ({ events, activeTab, search, dateRange, onCardClick, onRowAction, viewMode = "lawson" }) => {
  const [page, setPage] = useCardState(1);
  const filtered = events
    .filter(e => TAB_MAP[activeTab].matches(e))
    .filter(e => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.eventId.includes(q);
    })
    .filter(e => {
      if (!dateRange) return true;
      const [yr, mo] = dateRange.split("-");
      const end = e.dates.split(" - ")[1];
      if (!end) return true;
      const [ey, em] = end.split("/");
      return ey === yr && em === mo;
    });

  useCardEffect(() => { setPage(1); }, [activeTab, search, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARD_PAGE_SIZE));
  const pageStart = (page - 1) * CARD_PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + CARD_PAGE_SIZE);

  if (filtered.length === 0) {
    return (
      <div className="empty-state" style={{ marginTop: 40 }}>
        <Icon.search />
        <h3>該当するイベントが見つかりません</h3>
        <p style={{ margin: 0 }}>検索条件を変更してください</p>
      </div>
    );
  }

  return (
    <>
      <div className="cards-grid">
        {paginated.map(ev => (
          <EventCard key={ev.id} ev={ev} onCardClick={onCardClick} onRowAction={onRowAction} viewMode={viewMode} />
        ))}
      </div>
      <div className="pagination">
        <span>{pageStart + 1} - {Math.min(pageStart + CARD_PAGE_SIZE, filtered.length)} of {filtered.length} results</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button className="td-ellipsis" disabled={page === 1} onClick={() => setPage(p => p - 1)}><Icon.chevLeft style={{ width: 16, height: 16 }} /></button>
          <span style={{ padding: "0 8px", fontWeight: 600 }}>{page}</span>
          <button className="td-ellipsis" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><Icon.chevRight style={{ width: 16, height: 16 }} /></button>
        </span>
      </div>
    </>
  );
};
window.CardView = CardView;
window.CardMenu = CardMenu;
