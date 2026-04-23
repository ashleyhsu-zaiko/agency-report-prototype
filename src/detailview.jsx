// Compact file-card used in section 2 of the detail view
const ReportCard = ({ title, amount, notes, event, onAction, onToast }) => {
  const [menu, setMenu] = useState(null);
  return (
    <div className="rpt-card">
      <div className="rpt-card-head">
        <span className="rpt-card-title">{title}</span>
        {amount != null && <span className="rpt-card-amount">{formatYen(amount)}</span>}
      </div>
      <div className="rpt-file-row">
        <div className="rpt-pdf-icon">
          <Icon.fileZip style={{ width: 16, height: 16 }} />
          <span>PDF</span>
        </div>
        <div>
          <div className="rpt-file-name">Total organizer payout_auto_generate</div>
          <div className="rpt-file-date">2026/1/12 13:45</div>
        </div>
      </div>
      <div className="rpt-action-row">
        <button className="rpt-link" onClick={() => onToast("ダウンロードしました", "success")}>
          <Icon.download style={{ width: 12, height: 12 }} />ダウンロード
        </button>
      </div>
      <div className="rpt-action-row" style={{ marginTop: 4 }}>
        <button className="rpt-link" onClick={() => onToast("アップロードしました", "info")}>
          <Icon.upload style={{ width: 12, height: 12 }} />手動アップロード
        </button>
        <span style={{ flex: 1 }} />
        {notes ? (
          <div className="amt-chat-wrap">
            <button className="mcell-ic"><Icon.chat style={{ width: 14, height: 14 }} /></button>
            <div className="amt-chat-tooltip">{notes}</div>
          </div>
        ) : notes === "" ? (
          <span className="mcell-ic disabled"><Icon.chat style={{ width: 14, height: 14 }} /></span>
        ) : null}
        <button
          className="mcell-ic"
          onClick={(e) => { e.stopPropagation(); setMenu({ anchor: e.currentTarget }); }}
        >
          <Icon.ellipsisH style={{ width: 14, height: 14 }} />
        </button>
      </div>
      {menu && (
        <CardMenu
          anchor={menu.anchor}
          onClose={() => setMenu(null)}
          onAction={(action) => onAction && onAction(action, event)}
        />
      )}
    </div>
  );
};

// DetailView — event detail with 3 accordions + phase-aware workflow buttons
const DetailView = ({ event, onBack, onUpdate, onToast, onOpenVersions, onOpenRevision, onOpenAction, onRowAction, viewMode = "lawson" }) => {
  const [open, setOpen] = useState({ info: true, report: true, agency: true });
  const [form, setForm] = useState(() => ({
    checklistUrl: event.phase !== "1" ? "https://www.spreadsheet.com/design/example-checklist" : "",
    copyright: event.phase !== "1" ? "あり" : "",
    deskName: event.phase !== "1" ? (event.desk || "") : "",
    salesName: event.phase !== "1" ? "山田 健司" : "",
    department: event.phase !== "1" ? "第2営業部" : "",
    notes: "",
  }));

  const toggle = (k) => setOpen(o => ({ ...o, [k]: !o[k] }));

  const phase = PHASES[event.phase];
  const isRevision = event.phase === "revision";
  const isZaiko = viewMode === "zaiko";
  // In ZAIKO view, Lawson-owned fields render as read-only labels (Lawson fills them)
  const readOnlyLabel = (value, { multiline = false } = {}) => (
    <div style={{
      fontSize: 14,
      padding: "8px 0",
      color: value ? "var(--n-0)" : "var(--n-4)",
      whiteSpace: multiline ? "pre-line" : "normal",
      lineHeight: multiline ? 1.5 : 1.4,
    }}>
      {value || "—"}
    </div>
  );

  const handleSubmit = () => {
    if (!form.checklistUrl || !form.copyright || !form.deskName) {
      onToast("必須項目が未入力です", "error");
      return;
    }
    onUpdate({ ...event, phase: "2", form });
    onToast("ZAIKOへ情報を送信しました", "success");
    setTimeout(onBack, 400);
  };

  const handleApprove = () => {
    onUpdate({ ...event, phase: "4" });
    onToast("承認しました。ZAIKOへ振込依頼を送ります", "success");
    setTimeout(onBack, 400);
  };

  const handleResubmitRevision = () => {
    onUpdate({ ...event, phase: "2", form });
    onToast("修正内容をZAIKOへ送信しました", "success");
    setTimeout(onBack, 400);
  };

  const steps = ["Lawson情報入力", "ZAIKO確認", "Lawson承認", "ZAIKO振込", "完了"];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 13, color: "var(--n-3)" }}>
        <button className="td-ellipsis" onClick={onBack} title="戻る"><Icon.chevLeft style={{ width: 16, height: 16 }} /></button>
        <span style={{ fontWeight: 600, cursor: "pointer" }} onClick={onBack}>エージェンシーイベント清算書</span>
        <Icon.chevRight style={{ width: 12, height: 12, color: "var(--n-5)" }} />
        <span style={{ color: "var(--n-1)", fontWeight: 600 }}>ID: {event.eventId}</span>
      </div>

      <h1 className="detail-title">{event.title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, marginBottom: 24 }}>
        <span style={{ color: "var(--n-3)", fontSize: 13 }}>開催期間: {event.dates}</span>
        <span style={{ width: 1, height: 12, background: "var(--n-6)" }} />
        <span style={{ color: "var(--n-3)", fontSize: 13 }}>最終更新: {event.updatedAt}</span>
        <div style={{ flex: 1 }} />
        {isRevision && <span className="status-tag revision">修正依頼あり</span>}
        {event.phase === "2" && <span className="status-tag review">ZAIKO確認中</span>}
        {event.phase === "4" && <span className="status-tag review">振込待ち</span>}
        {event.phase === "5" && <span className="status-tag done"><Icon.check style={{ width: 11, height: 11 }} /> 完了</span>}
      </div>

      {/* Phase stepper — colors match list view PHASE_COLORS:
          Phase 1/3/revision (Lawson action) = purple, 2/4 (Zaiko wait) = gray, 5 = green */}
      {(() => {
        const isDonePhase = event.phase === "5";
        if (viewMode === "zaiko") {
          const zaikoPhase = ZAIKO_PHASES[event.phase];
          const pct = isDonePhase ? 100 : ((zaikoPhase.idx + 1) / 5) * 100;
          const isLawsonSide = event.phase === "1" || event.phase === "3";
          const fillColor = isDonePhase ? "#059669" : isLawsonSide ? "#9CA3AF" : "#4F46E5";
          return (
            <>
              <div className="tw-progress-track" style={{ marginBottom: 10 }}>
                <div className="tw-progress-fill" style={{ width: `${pct}%`, background: fillColor }} />
              </div>
              <div style={{ marginBottom: 24, fontSize: 13, color: "#525252", fontWeight: 700 }}>
                {zaikoPhase.label}
              </div>
            </>
          );
        }
        const C = {
          "1":        { on: "#B13C9E", off: "#F4E0F3" },
          "2":        { on: "#737373", off: "#D4D4D4" },
          "revision": { on: "#B13C9E", off: "#F4E0F3" },
          "3":        { on: "#B13C9E", off: "#F4E0F3" },
          "4":        { on: "#737373", off: "#D4D4D4" },
          "5":        { on: "#3C6300", off: "#D0FAE5" },
        }[event.phase] || { on: "#737373", off: "#D4D4D4" };
        return (
          <>
            <div style={{ display: "flex", gap: 0, marginBottom: 10 }}>
              {steps.map((s, i) => {
                const active = isDonePhase ? true : i <= phase.idx;
                return (
                  <div key={i} style={{
                    flex: 1, height: 8,
                    background: active ? C.on : C.off,
                    borderTopLeftRadius:    i === 0 ? 8 : 0,
                    borderBottomLeftRadius: i === 0 ? 8 : 0,
                    borderTopRightRadius:    i === steps.length - 1 ? 8 : 0,
                    borderBottomRightRadius: i === steps.length - 1 ? 8 : 0,
                  }} />
                );
              })}
            </div>
            <div style={{ marginBottom: 24, fontSize: 13, color: "#525252", fontWeight: 700 }}>
              {phase.label}
            </div>
          </>
        );
      })()}

      {isRevision && !isZaiko && (
        <div style={{
          background: "rgba(252,91,91,0.08)",
          border: "1px solid rgba(252,91,91,0.2)",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          display: "flex", gap: 12,
        }}>
          <Icon.exclaim style={{ width: 20, height: 20, color: "var(--red)", flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, color: "var(--red)", marginBottom: 4 }}>ZAIKOから修正依頼</div>
            <div style={{ fontSize: 13, color: "var(--n-1)", lineHeight: 1.5 }}>
              チェックリストのファイル名に誤りがあります。V2 ではなく V3 を添付してください。また、デスク担当者の所属部署を明記してください。
            </div>
            <div style={{ fontSize: 12, color: "var(--n-3)", marginTop: 8 }}>
              2026/01/14 11:23 · ZAIKO 佐々木 達也
            </div>
          </div>
        </div>
      )}

      {isZaiko && (event.revisionMessage || event.zaikoReply) && (
        <div style={{
          background: "#FFFBEB",
          border: "1px solid #FDE68A",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          display: "flex", gap: 12,
        }}>
          <Icon.exclaim style={{ width: 20, height: 20, color: "#B45309", flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            {event.zaikoReply && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--n-3)", letterSpacing: 0.02, marginBottom: 4 }}>
                  ZAIKO · {event.zaikoReplyDate || event.updatedAt?.split(" ")[0]}
                </div>
                <div style={{ fontSize: 13, color: "var(--n-1)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {event.zaikoReply}
                </div>
              </div>
            )}
            {event.zaikoReply && event.revisionMessage && (
              <div style={{ height: 1, background: "#FDE68A" }} />
            )}
            {event.revisionMessage && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--n-3)", letterSpacing: 0.02, marginBottom: 4 }}>
                  LAWSON · {event.revisionDate || "—"}
                </div>
                <div style={{ fontSize: 13, color: "var(--n-1)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {event.revisionMessage}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="accordion">
        {/* === SECTION 1: イベント情報 === */}
        <div className={`accordion-item ${open.info ? "open" : ""}`}>
          <div className="accordion-head" onClick={() => toggle("info")}>
            イベント情報
            <Icon.chevDown className="chev" />
          </div>
          <div className="accordion-body">
            <div className="info-row">
              <span className="label">イベントID</span>
              <span className="value mono">{event.eventId}</span>
            </div>
            <div className="info-row">
              <span className="label">イベント期間</span>
              <span className="value">{event.dates}</span>
            </div>
            <div className="info-row">
              <span className="label">料金モデル</span>
              <span className="value">{event.fee}</span>
            </div>
          </div>
        </div>

        {/* === SECTION 2: レポートと支払い詳細 === */}
        <div className={`accordion-item ${open.report ? "open" : ""}`}>
          <div className="accordion-head" onClick={() => toggle("report")}>
            レポートと支払い詳細
            <Icon.chevDown className="chev" />
          </div>
          <div className="accordion-body">
            <div className="payout-month-wrap">
              <div className="payout-month-label">
                振込月
                <Icon.info style={{ width: 14, height: 14, color: "var(--n-4)" }} />
              </div>
              <div className="payout-month-box">{event.cprMonth}</div>
            </div>
            <div className="rpt-cards">
              <ReportCard title="精算報告書" onToast={onToast} event={event} onAction={onRowAction} />
              <ReportCard title="金額（主催）" amount={event.organizerPayout} notes={event.organizerNotes || ""} onToast={onToast} event={event} onAction={onRowAction} />
              <ReportCard title="金額（エージェンシー）" amount={event.agencyAmount} notes={event.agencyNotes || ""} onToast={onToast} event={event} onAction={onRowAction} />
            </div>
          </div>
        </div>

        {/* === SECTION 3: エージェンシー・クライアント詳細 === */}
        <div className={`accordion-item ${open.agency ? "open" : ""}`}>
          <div className="accordion-head" onClick={() => toggle("agency")}>
            エージェンシー・クライアント詳細
            <Icon.chevDown className="chev" />
          </div>
          <div className="accordion-body">
            <div className="field">
              <div className="field-label">
                チェックリストURL
                <span className="tag">対応必須</span>
              </div>
              {isZaiko ? (
                event.form?.checklist ? (
                  <a
                    className="lnk-cell"
                    href={event.form.checklist}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 14, padding: "8px 0", alignSelf: "flex-start" }}
                  >
                    <Icon.link style={{ width: 14, height: 14 }} />LINK TITLE
                  </a>
                ) : (
                  <span style={{ color: "var(--n-4)", fontSize: 14, padding: "8px 0" }}>—</span>
                )
              ) : (
                <input
                  className="input-text"
                  value={form.checklistUrl}
                  placeholder="https://"
                  onChange={(e) => setForm(f => ({ ...f, checklistUrl: e.target.value }))}
                  disabled={event.phase === "5" || event.phase === "2" || event.phase === "4"}
                />
              )}
            </div>

            <div className="field">
              <div className="field-label">
                著作権処理有無
                <span className="tag">対応必須</span>
              </div>
              {isZaiko ? readOnlyLabel(form.copyright) : (
                <div className="radio-row">
                  {["あり", "なし"].map(opt => (
                    <label
                      key={opt}
                      className={`radio-pill ${form.copyright === opt ? "checked" : ""}`}
                      onClick={() => (event.phase === "1" || isRevision) && setForm(f => ({ ...f, copyright: opt }))}
                    >
                      <span>{opt}</span>
                      <span className="radio-dot" />
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="field">
              <div className="field-label">デスク担当名<span className="tag optional">任意</span></div>
              {isZaiko ? readOnlyLabel(form.deskName) : (
                <input
                  className="input-text"
                  value={form.deskName}
                  placeholder="担当者名を入力"
                  onChange={(e) => setForm(f => ({ ...f, deskName: e.target.value }))}
                  disabled={event.phase === "5" || event.phase === "2" || event.phase === "4"}
                />
              )}
            </div>

            <div className="field">
              <div className="field-label">営業担当名<span className="tag optional">任意</span></div>
              {isZaiko ? readOnlyLabel(form.salesName) : (
                <input
                  className="input-text"
                  value={form.salesName}
                  placeholder="担当者名を入力"
                  onChange={(e) => setForm(f => ({ ...f, salesName: e.target.value }))}
                  disabled={event.phase === "5"}
                />
              )}
            </div>

            <div className="field">
              <div className="field-label">計上部署<span className="tag optional">任意</span></div>
              {isZaiko ? readOnlyLabel(form.department) : (
                <input
                  className="input-text"
                  value={form.department}
                  placeholder="部署名を入力"
                  onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))}
                  disabled={event.phase === "5"}
                />
              )}
            </div>

            {isZaiko && (
              <>
                <div className="field">
                  <div className="field-label">主催者会社名</div>
                  {readOnlyLabel(event.desk)}
                </div>
                <div className="field">
                  <div className="field-label">主催者口座情報</div>
                  {readOnlyLabel(event.bank, { multiline: true })}
                </div>
              </>
            )}

            <div className="info-row">
              <span className="label">承認日</span>
              <span className="value">{event.phase === "5" ? event.updatedAt.split(" ")[0] : "—"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-actions">
        <button className="btn btn-tertiary" onClick={onBack}>キャンセル</button>
        <div style={{ display: "flex", gap: 8 }}>
          {isZaiko ? (() => {
            // ZAIKO flow — buttons mirror the card's 対応開始 / 編集 split
            const isZaikoAction = event.phase === "2" || isRevision || event.phase === "4";
            if (event.phase === "5") return null;
            return (
              <button className="btn btn-primary pink" onClick={() => onOpenAction && onOpenAction(event)}>
                {isZaikoAction ? "Lawsonに渡す" : "編集"}
              </button>
            );
          })() : (
            <>
              {event.phase === "1" && (
                <button className="btn btn-primary pink" onClick={handleSubmit}>
                  ZAIKOに渡す
                </button>
              )}
              {event.phase === "3" && (
                <button className="btn btn-primary" onClick={handleApprove}>
                  承認 & 振込を依頼
                </button>
              )}
              {isRevision && (
                <button className="btn btn-primary pink" onClick={handleResubmitRevision}>
                  修正してZAIKOに再送
                </button>
              )}
              {(event.phase === "2" || event.phase === "4") && (
                <button className="btn btn-secondary" onClick={() => onToast("保存しました", "success")}>
                  <Icon.check style={{ width: 14, height: 14 }} />下書き保存
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

window.DetailView = DetailView;
