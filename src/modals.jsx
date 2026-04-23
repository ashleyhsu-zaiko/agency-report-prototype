// Modals — version management + revision message
const { useEffect: useModalEffect, useRef: useModalRef } = React;
const VersionModal = ({ event, onClose, onToast }) => {
  const files = [
    { name: "Total organizer payout_auto_generate", date: "2026/01/12 13:45", source: "Auto-generate" },
    { name: "Total organizer payout",              date: "2026/01/11 13:45", source: "Zaiko uploaded it" },
  ];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: 560 }}>
        <div className="modal-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
          <h2 className="modal-title" style={{ fontSize: 20 }}>バージョン管理 - 精算書（主催者）</h2>
          <button className="modal-close" onClick={onClose}><Icon.x style={{ width: 16, height: 16 }} /></button>
        </div>
        <div className="modal-body">
          <button
            className="version-upload-btn"
            onClick={() => onToast("ファイルをアップロードしました", "success")}
          >
            <Icon.upload style={{ width: 14, height: 14 }} />
            <span>手動アップロード</span>
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 12 }}>
            {files.map((f) => (
              <div key={f.name} className="version-file-row">
                <div className="version-pdf-badge">PDF</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="version-file-name">{f.name}</div>
                  <div className="version-file-meta">
                    <span>{f.date}</span>
                    <span className="dot" />
                    <span>{f.source}</span>
                  </div>
                </div>
                <button className="menu-btn" onClick={() => onToast(`${f.name} のメニュー`, "info")}>
                  <Icon.ellipsisV style={{ width: 16, height: 16 }} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer" style={{ justifyContent: "flex-start" }}>
          <button className="btn btn-primary" style={{ background: "#1E8DFF", color: "#fff" }} onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
};

const RevisionModal = ({ event, onClose, onSend }) => {
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState("question"); // "question" | "revision"

  const handle = () => {
    if (!message.trim()) return;
    onSend(event, message, kind);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">メッセージを送る</h2>
            <div style={{ fontSize: 13, color: "var(--n-3)", marginTop: 4 }}>宛先: ZAIKO</div>
          </div>
          <button className="modal-close" onClick={onClose}><Icon.x style={{ width: 16, height: 16 }} /></button>
        </div>
        <div className="modal-body">
          <div className="field">
            <div className="field-label">種別</div>
            <div className="radio-row">
              <label className={`radio-pill ${kind === "question" ? "checked" : ""}`} onClick={() => setKind("question")}>
                <span>問い合わせ</span>
                <span className="radio-dot" />
              </label>
              <label className={`radio-pill ${kind === "revision" ? "checked" : ""}`} onClick={() => setKind("revision")}>
                <span>修正依頼</span>
                <span className="radio-dot" />
              </label>
            </div>
          </div>
          <div className="field">
            <div className="field-label">内容<span className="tag">必須</span></div>
            <textarea
              className="revision-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="例: チェックリストの金額内訳について、再度ご確認をお願いします。"
              autoFocus
            />
          </div>
          <div style={{ fontSize: 12, color: "var(--n-3)", lineHeight: 1.5 }}>
            送信するとZAIKO担当者へ通知が届き、フェーズは「ZAIKO確認まち」に戻ります。
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn btn-primary pink" onClick={handle} disabled={!message.trim()} style={{ opacity: message.trim() ? 1 : 0.5 }}>
            送信
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionModal = ({ event, onClose, onSubmit, onSendRevision, onSaveDraft, viewMode = "lawson" }) => {
  const isZAIKO   = viewMode === "zaiko";
  const isPhase1  = event.phase === "1";
  const isApproval = event.phase === "3";
  // ZAIKO edits notes for every phase except 4 (振込待ち — confirmation flow)
  const isZaikoNoteFlow = isZAIKO && event.phase !== "4";
  const isZaikoAdvance = isZAIKO && (event.phase === "2" || event.phase === "revision");
  const isRevision = event.phase === "revision";
  const [form, setForm] = useState({
    checklist: event.form?.checklist || "",
    copyright: event.form?.copyright || "あり",
    deskName: event.form?.deskName || "",
    salesName: event.form?.salesName || "",
    department: event.form?.department || "",
    clientName: event.desk || "",
    bankInfo: event.bank || "",
    agencyNotes: event.agencyNotes || "",
    organizerNotes: event.organizerNotes || "",
    zaikoReply: event.zaikoReply || "",
    revisionMessage: event.revisionMessage || "",
  });
  const [dirty, setDirty] = useState(false);
  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setDirty(true); };
  // Lawson approval modal (phase 3) can switch into edit or revisionRequest sub-views
  const [uiMode, setUiMode] = useState("approval"); // "approval" | "edit" | "revisionRequest"
  const [menuOpen, setMenuOpen] = useState(false);
  const [revisionMsg, setRevisionMsg] = useState("");
  const menuRef = useModalRef(null);
  useModalEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);
  // "保存" button (ZAIKO, not an advance/revision/振込 action) — require edits before enabling
  const isZaikoSaveOnly = isZAIKO && event.phase !== "4" && !isRevision && !isZaikoAdvance;
  const canSubmit = uiMode === "revisionRequest" ? revisionMsg.trim()
                  : uiMode === "edit" ? dirty
                  : isZAIKO ? (isZaikoSaveOnly ? dirty : true)
                  : isPhase1 ? form.checklist.trim()
                  : true;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 680 }}>
        <div className="modal-header">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="modal-title" style={{ fontSize: 16, lineHeight: 1.4 }}>{event.title}</h2>
            <div style={{ fontSize: 12, color: "var(--n-4)", marginTop: 4 }}>{event.dates}</div>
          </div>
          <button className="modal-close" onClick={onClose}><Icon.x style={{ width: 16, height: 16 }} /></button>
        </div>
        <div className="modal-body">
          {isZaikoNoteFlow ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {isRevision && event.revisionMessage && (
                <div className="revision-banner">
                  <Icon.exclaim style={{ width: 16, height: 16, color: "#B45309", flexShrink: 0, marginTop: 2 }} />
                  <div style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.6, color: "var(--n-1)" }}>
                    {event.revisionMessage}
                  </div>
                </div>
              )}
              <div className="field">
                <div className="field-label">特記事項（エージェンシー精算書に記載）<span className="tag optional">任意</span></div>
                <textarea
                  className="revision-textarea"
                  value={form.agencyNotes}
                  onChange={(e) => set("agencyNotes", e.target.value)}
                  placeholder=""
                  style={{ minHeight: 60 }}
                />
              </div>
              <div className="field" style={{ marginBottom: isRevision ? 16 : 0 }}>
                <div className="field-label">特記事項（主催者精算書に記載）<span className="tag optional">任意</span></div>
                <textarea
                  className="revision-textarea"
                  value={form.organizerNotes}
                  onChange={(e) => set("organizerNotes", e.target.value)}
                  placeholder=""
                  style={{ minHeight: 60 }}
                />
              </div>
              {(isRevision || (isZAIKO && event.zaikoReply)) && (
                <div className="field" style={{ marginBottom: 0 }}>
                  <div className="field-label">
                    Lawsonへメモ
                    <span className="tag optional">{isRevision ? "任意" : "送信済み"}</span>
                  </div>
                  <textarea
                    className="revision-textarea"
                    value={form.zaikoReply}
                    onChange={(e) => set("zaikoReply", e.target.value)}
                    placeholder=""
                    style={{ minHeight: 100 }}
                  />
                </div>
              )}
            </div>
          ) : isZAIKO ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ margin: 0, fontSize: 14, color: "var(--n-1)", lineHeight: 1.6 }}>
                {event.phase === "4"
                  ? "このイベントへの振込を完了済みとしてマークします。よろしいですか？"
                  : "精算内容を確認し、承認してください。"
                }
              </p>
              <div style={{ background: "var(--n-8)", borderRadius: 8, padding: 16, fontSize: 13, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--n-3)", fontWeight: 700 }}>金額（代理店）</span>
                  <span style={{ fontFamily: "Inter", fontWeight: 700 }}>¥{formatYen(event.agencyAmount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--n-3)", fontWeight: 700 }}>金額（主催）</span>
                  <span style={{ fontFamily: "Inter", fontWeight: 700 }}>¥{formatYen(event.organizerPayout)}</span>
                </div>
                <div style={{ borderTop: "1px solid var(--n-7)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--n-3)", fontWeight: 700 }}>チェックリスト</span>
                  <a href={event.form?.checklist || "#"} style={{ color: "var(--pink)", fontWeight: 600, fontSize: 12 }} target="_blank">{event.form?.checklist ? "確認する" : "—"}</a>
                </div>
              </div>
            </div>
          ) : !isApproval ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="field">
                <div className="field-label">チェックリストURL <span className="tag">対応必須</span></div>
                <input className="input-text" value={form.checklist} onChange={e => set("checklist", e.target.value)} placeholder="https://..." autoFocus />
              </div>
              <div className="field">
                <div className="field-label">著作権処理 <span className="tag">対応必須</span></div>
                <div className="radio-row">
                  <label className={`radio-pill ${form.copyright === "あり" ? "checked" : ""}`} onClick={() => set("copyright", "あり")}>
                    <span>あり</span><span className="radio-dot" />
                  </label>
                  <label className={`radio-pill ${form.copyright === "なし" ? "checked" : ""}`} onClick={() => set("copyright", "なし")}>
                    <span>なし</span><span className="radio-dot" />
                  </label>
                </div>
              </div>
              <div className="field">
                <div className="field-label">デスク担当名 <span className="tag optional">任意</span></div>
                <input className="input-text" value={form.deskName} onChange={e => set("deskName", e.target.value)} placeholder="担当者名" />
              </div>
              <div className="field">
                <div className="field-label">営業担当名 <span className="tag optional">任意</span></div>
                <input className="input-text" value={form.salesName} onChange={e => set("salesName", e.target.value)} placeholder="担当者名" />
              </div>
              <div className="field">
                <div className="field-label">計上部署 <span className="tag optional">任意</span></div>
                <input className="input-text" value={form.department} onChange={e => set("department", e.target.value)} placeholder="部署名" />
              </div>
              <div className="field">
                <div className="field-label">主催者会社名 <span className="tag">対応必須</span></div>
                <input className="input-text" value={form.clientName} onChange={e => set("clientName", e.target.value)} placeholder="株式会社..." />
              </div>
              <div className="field" style={{ marginBottom: event.revisionMessage ? 16 : 0 }}>
                <div className="field-label">主催者口座情報 <span className="tag">対応必須</span></div>
                <textarea className="revision-textarea" value={form.bankInfo} onChange={e => set("bankInfo", e.target.value)} placeholder="銀行名・支店名・口座種別・口座番号・口座名義" style={{ minHeight: 80 }} />
              </div>
              {event.revisionMessage && (
                <div className="field" style={{ marginBottom: 0 }}>
                  <div className="field-label">
                    ZAIKOへ修正依頼内容
                    <span className="tag optional">送信済み</span>
                  </div>
                  <textarea
                    className="revision-textarea"
                    value={form.revisionMessage}
                    onChange={(e) => set("revisionMessage", e.target.value)}
                    style={{ minHeight: 100 }}
                  />
                </div>
              )}
            </div>
          ) : uiMode === "revisionRequest" ? (
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="field-label">修正依頼内容<span className="tag optional">任意</span></div>
              <textarea
                className="revision-textarea"
                value={revisionMsg}
                onChange={(e) => setRevisionMsg(e.target.value)}
                autoFocus
                style={{ minHeight: 140 }}
              />
            </div>
          ) : uiMode === "edit" ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="field">
                <div className="field-label">チェックリストURL <span className="tag">対応必須</span></div>
                <input className="input-text" value={form.checklist} onChange={e => set("checklist", e.target.value)} placeholder="https://..." autoFocus />
              </div>
              <div className="field">
                <div className="field-label">著作権処理 <span className="tag">対応必須</span></div>
                <div className="radio-row">
                  <label className={`radio-pill ${form.copyright === "あり" ? "checked" : ""}`} onClick={() => set("copyright", "あり")}>
                    <span>あり</span><span className="radio-dot" />
                  </label>
                  <label className={`radio-pill ${form.copyright === "なし" ? "checked" : ""}`} onClick={() => set("copyright", "なし")}>
                    <span>なし</span><span className="radio-dot" />
                  </label>
                </div>
              </div>
              <div className="field">
                <div className="field-label">デスク担当名 <span className="tag optional">任意</span></div>
                <input className="input-text" value={form.deskName} onChange={e => set("deskName", e.target.value)} placeholder="担当者名" />
              </div>
              <div className="field">
                <div className="field-label">営業担当名 <span className="tag optional">任意</span></div>
                <input className="input-text" value={form.salesName} onChange={e => set("salesName", e.target.value)} placeholder="担当者名" />
              </div>
              <div className="field">
                <div className="field-label">計上部署 <span className="tag optional">任意</span></div>
                <input className="input-text" value={form.department} onChange={e => set("department", e.target.value)} placeholder="部署名" />
              </div>
              <div className="field">
                <div className="field-label">主催者会社名 <span className="tag">対応必須</span></div>
                <input className="input-text" value={form.clientName} onChange={e => set("clientName", e.target.value)} placeholder="株式会社..." />
              </div>
              <div className="field" style={{ marginBottom: event.revisionMessage ? 16 : 0 }}>
                <div className="field-label">主催者口座情報 <span className="tag">対応必須</span></div>
                <textarea className="revision-textarea" value={form.bankInfo} onChange={e => set("bankInfo", e.target.value)} placeholder="銀行名・支店名・口座種別・口座番号・口座名義" style={{ minHeight: 80 }} />
              </div>
              {event.revisionMessage && (
                <div className="field" style={{ marginBottom: 0 }}>
                  <div className="field-label">
                    ZAIKOへ修正依頼内容
                    <span className="tag optional">送信済み</span>
                  </div>
                  <textarea
                    className="revision-textarea"
                    value={form.revisionMessage}
                    onChange={(e) => set("revisionMessage", e.target.value)}
                    style={{ minHeight: 100 }}
                  />
                </div>
              )}
            </div>
          ) : (
            (() => {
              const LabelField = ({ label, children }) => (
                <div>
                  <div style={{ fontSize: 12, color: "var(--n-3)", fontWeight: 500, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--n-0)", minHeight: 20 }}>{children}</div>
                </div>
              );
              const approvalDate = event.phase === "5" ? (event.updatedAt?.split(" ")[0] || "—") : "—";
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <LabelField label="チェックリストURL">
                    {event.form?.checklist ? (
                      <a
                        href={event.form.checklist}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--purple)", textDecoration: "underline", fontWeight: 600 }}
                      >
                        LINK TITLE
                      </a>
                    ) : <span style={{ color: "var(--n-4)", fontWeight: 400 }}>—</span>}
                  </LabelField>
                  <LabelField label="著作権処理有無">{event.form?.copyright || <span style={{ color: "var(--n-4)", fontWeight: 400 }}>—</span>}</LabelField>
                  <LabelField label="デスク担当名">{event.form?.deskName || <span style={{ color: "var(--n-4)", fontWeight: 400 }}>—</span>}</LabelField>
                  <LabelField label="営業担当名">{event.form?.salesName || <span style={{ color: "var(--n-4)", fontWeight: 400 }}>—</span>}</LabelField>
                  <LabelField label="計上部署">{event.form?.department || <span style={{ color: "var(--n-4)", fontWeight: 400 }}>—</span>}</LabelField>
                  <LabelField label="主催者会社名">{event.desk || <span style={{ color: "var(--n-4)", fontWeight: 400 }}>—</span>}</LabelField>
                  <LabelField label="主催者口座情報">
                    {event.bank ? (
                      <div style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}>{event.bank}</div>
                    ) : <span style={{ color: "var(--n-4)", fontWeight: 400 }}>—</span>}
                  </LabelField>
                  <LabelField label="特記事項（エージェンシー精算書に記載）">
                    {event.agencyNotes ? (
                      <div style={{ whiteSpace: "pre-wrap", fontWeight: 400, lineHeight: 1.6 }}>{event.agencyNotes}</div>
                    ) : <span style={{ color: "var(--n-4)", fontWeight: 400 }}>—</span>}
                  </LabelField>
                  <LabelField label="特記事項（主催者精算書に記載）">
                    {event.organizerNotes ? (
                      <div style={{ whiteSpace: "pre-wrap", fontWeight: 400, lineHeight: 1.6 }}>{event.organizerNotes}</div>
                    ) : <span style={{ color: "var(--n-4)", fontWeight: 400 }}>—</span>}
                  </LabelField>
                  <LabelField label="承認日"><span style={{ fontWeight: 400, color: "var(--n-4)" }}>{approvalDate}</span></LabelField>
                </div>
              );
            })()
          )}
        </div>
        <div
          className="modal-footer"
          style={isApproval && !isZAIKO
            ? { justifyContent: "space-between", gap: 8 }
            : { justifyContent: "flex-end", gap: 8 }
          }
        >
          {isApproval && !isZAIKO ? (
            <>
              <button
                className="btn btn-primary"
                style={{ background: "#1E8DFF" }}
                onClick={() => { if (uiMode !== "approval") setUiMode("approval"); else onClose(); }}
              >
                キャンセル
              </button>
              <div style={{ display: "flex", gap: 8, alignItems: "center", position: "relative" }} ref={menuRef}>
                {uiMode === "approval" && (
                  <>
                    <button
                      className="btn btn-primary pink"
                      onClick={() => { onSubmit(event, form); onClose(); }}
                      disabled={!canSubmit}
                      style={{ opacity: canSubmit ? 1 : 0.5 }}
                    >
                      承認
                    </button>
                    <button
                      className="td-ellipsis"
                      style={{ width: 32, height: 32 }}
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
                      title="その他"
                    >
                      <Icon.ellipsisV style={{ width: 16, height: 16 }} />
                    </button>
                    {menuOpen && (
                      <div
                        className="dropdown-menu"
                        style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 6, minWidth: 180 }}
                      >
                        <button className="dropdown-item" onClick={() => { setUiMode("edit"); setMenuOpen(false); setDirty(false); }}>
                          編集
                        </button>
                        <button className="dropdown-item danger" onClick={() => { setUiMode("revisionRequest"); setMenuOpen(false); }}>
                          ZAIKOへ修正依頼
                        </button>
                      </div>
                    )}
                  </>
                )}
                {uiMode === "edit" && (
                  <button
                    className="btn btn-primary pink"
                    onClick={() => { onSaveDraft && onSaveDraft(event, form); onClose(); }}
                    disabled={!canSubmit}
                    style={{ opacity: canSubmit ? 1 : 0.5 }}
                  >
                    保存
                  </button>
                )}
                {uiMode === "revisionRequest" && (
                  <button
                    className="btn btn-primary pink"
                    onClick={() => { onSendRevision && onSendRevision(event, revisionMsg); onClose(); }}
                    disabled={!canSubmit}
                    style={{ opacity: canSubmit ? 1 : 0.5 }}
                  >
                    修正依頼
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="btn btn-tertiary" onClick={onClose}>キャンセル</button>
              <button
                className={`btn btn-primary ${isZAIKO ? "pink" : isPhase1 ? "" : "pink"}`}
                onClick={() => { onSubmit(event, form); onClose(); }}
                disabled={!canSubmit}
                style={{ opacity: canSubmit ? 1 : 0.5 }}
              >
                {isZAIKO
                  ? (event.phase === "4" ? "振込完了"
                    : isRevision ? "確認依頼"
                    : isZaikoAdvance ? "Lawsonに渡す"
                    : "保存")
                  : isPhase1 ? "ZAIKOに渡す" : "保存する"
                }
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

window.VersionModal = VersionModal;
window.RevisionModal = RevisionModal;
window.ActionModal = ActionModal;
