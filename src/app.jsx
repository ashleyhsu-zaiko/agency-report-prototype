// App — root
const { useState: useS, useEffect: useE } = React;

function App() {
  const [events, setEvents] = useS(() => {
    try {
      if (localStorage.getItem("eventsVersion") === SEED_VERSION) {
        const saved = localStorage.getItem("events");
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    return SEED_EVENTS;
  });
  const [activeTab, setActiveTab] = useS("all");
  const [search, setSearch] = useS("");
  const [dateRange, setDateRange] = useS("");
  const [view, setView] = useS(() => localStorage.getItem("view") || "list");
  const [viewMode, setViewMode] = useS(() => localStorage.getItem("viewMode") || "lawson");
  const [selectedId, setSelectedId] = useS(() => {
    const v = localStorage.getItem("selectedId");
    return v ? Number(v) : null;
  });
  const [versionEvent, setVersionEvent] = useS(null);
  const [revisionEvent, setRevisionEvent] = useS(null);
  const [actionEvent, setActionEvent] = useS(null);
  const [toasts, setToasts] = useS([]);
  const [navItem, setNavItem] = useS("agency-report");

  useE(() => { localStorage.setItem("view", view); }, [view]);
  useE(() => { localStorage.setItem("viewMode", viewMode); }, [viewMode]);
  useE(() => {
    try {
      localStorage.setItem("events", JSON.stringify(events));
      localStorage.setItem("eventsVersion", SEED_VERSION);
    } catch {}
  }, [events]);
  useE(() => {
    document.body.classList.toggle("zaiko-mode", viewMode === "zaiko");
  }, [viewMode]);
  useE(() => {
    if (selectedId == null) localStorage.removeItem("selectedId");
    else localStorage.setItem("selectedId", String(selectedId));
  }, [selectedId]);

  const selected = events.find(e => e.id === selectedId);

  const pushToast = (message, kind = "info") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const updateEvent = (updated) => {
    setEvents(list => list.map(e => e.id === updated.id ? updated : e));
  };

  const handleRowAction = (action, ev) => {
    switch (action) {
      case "open":      setSelectedId(ev.id); break;
      case "action":    setActionEvent(ev); break;
      case "versions":  setVersionEvent(ev); break;
      case "revision":  setRevisionEvent(ev); break;
      case "download":  pushToast(`ファイルをダウンロードしました: ${ev.eventId}`, "success"); break;
      case "upload":    pushToast(`ファイルをアップロードしました: ${ev.eventId}`, "success"); break;
      case "archive":   pushToast(`アーカイブしました: ${ev.title.slice(0, 20)}...`, "info"); break;
    }
  };

  const handleActionSubmit = (ev, form) => {
    let nextPhase, toastMsg;
    if (viewMode === "zaiko") {
      nextPhase = ev.phase === "2" ? "3" : ev.phase === "revision" ? "3" : ev.phase === "4" ? "5" : ev.phase;
      toastMsg  = ev.phase === "4" ? "振込を完了しました"
                : ev.phase === "revision" ? "確認依頼を送信しました"
                : ev.phase === "2" ? "Lawsonに渡しました"
                : "保存しました";
    } else {
      nextPhase = ev.phase === "1" ? "2" : ev.phase === "3" ? "4" : ev.phase;
      toastMsg  = ev.phase === "1" ? "ZAIKOに渡しました" : ev.phase === "3" ? "承認しました" : "保存しました";
    }
    const today = new Date();
    const todayStr = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,"0")}/${String(today.getDate()).padStart(2,"0")}`;
    const updated = {
      ...ev,
      phase: nextPhase,
      form: { ...ev.form, ...form },
      desk: form.clientName || ev.desk,
      bank: form.bankInfo || ev.bank,
      agencyNotes: form.agencyNotes !== undefined ? form.agencyNotes : ev.agencyNotes,
      organizerNotes: form.organizerNotes !== undefined ? form.organizerNotes : ev.organizerNotes,
    };
    if (viewMode === "zaiko" && form.zaikoReply !== undefined && form.zaikoReply !== (ev.zaikoReply || "")) {
      updated.zaikoReply = form.zaikoReply;
      updated.zaikoReplyDate = form.zaikoReply.trim() ? todayStr : ev.zaikoReplyDate;
    }
    if (viewMode === "lawson" && form.revisionMessage !== undefined && form.revisionMessage !== (ev.revisionMessage || "")) {
      updated.revisionMessage = form.revisionMessage;
      updated.revisionDate = form.revisionMessage.trim() ? todayStr : ev.revisionDate;
    }
    updateEvent(updated);
    pushToast(toastMsg, "success");
  };

  const handleSendMessage = (ev, msg, kind) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,"0")}/${String(today.getDate()).padStart(2,"0")}`;
    if (kind === "revision") {
      updateEvent({ ...ev, phase: "revision", revisionMessage: msg, revisionDate: todayStr });
      pushToast("修正依頼を送信しました", "success");
    } else {
      pushToast("問い合わせを送信しました", "info");
    }
  };

  // Lawson approval modal — "編集" flow: save form edits without changing phase
  const handleSaveDraft = (ev, form) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,"0")}/${String(today.getDate()).padStart(2,"0")}`;
    const updated = {
      ...ev,
      form: { ...ev.form, ...form },
      desk: form.clientName || ev.desk,
      bank: form.bankInfo || ev.bank,
    };
    if (form.revisionMessage !== undefined && form.revisionMessage !== (ev.revisionMessage || "")) {
      updated.revisionMessage = form.revisionMessage;
      updated.revisionDate = form.revisionMessage.trim() ? todayStr : ev.revisionDate;
    }
    updateEvent(updated);
    pushToast("保存しました", "success");
  };

  const mainEl = (
        <main className={`main ${viewMode === "zaiko" ? "zaiko-main" : ""}`}>
          {!selected ? (
            view === "list" ? (
              <ListView
                events={events}
                activeTab={activeTab} setTab={setActiveTab}
                search={search} setSearch={setSearch}
                dateRange={dateRange} setDateRange={setDateRange}
                view={view} setView={setView}
                onRowClick={(e) => setSelectedId(e.id)}
                onRowAction={handleRowAction}
                onToast={pushToast}
                viewMode={viewMode}
              />
            ) : (
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
                  <FilterTabs activeTab={activeTab} setTab={setActiveTab} />
                  <div className="view-switch">
                    <button className={`view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}><Icon.table /></button>
                    <button className={`view-btn ${view === "card" ? "active" : ""}`} onClick={() => setView("card")}><Icon.cards /></button>
                  </div>
                </div>
                <CardView
                  events={events}
                  activeTab={activeTab}
                  search={search}
                  dateRange={dateRange}
                  onCardClick={(e) => setSelectedId(e.id)}
                  onRowAction={handleRowAction}
                  viewMode={viewMode}
                />
              </>
            )
          ) : (
            <DetailView
              event={selected}
              onBack={() => setSelectedId(null)}
              onUpdate={updateEvent}
              onToast={pushToast}
              onOpenVersions={setVersionEvent}
              onOpenRevision={setRevisionEvent}
              onOpenAction={setActionEvent}
              onRowAction={handleRowAction}
              viewMode={viewMode}
            />
          )}
        </main>
  );

  return (
    <>
      {viewMode !== "zaiko" && <TopNav onToast={pushToast} viewMode={viewMode} />}
      <div className={`app ${viewMode === "zaiko" ? "zaiko-view" : ""}`}>
        <SideNav activeItem={navItem} viewMode={viewMode} onNavigate={(id) => {
          setNavItem(id);
          if (id !== "agency-report") pushToast(`${id} は準備中です`, "info");
        }} />
        {viewMode === "zaiko" ? (
          <div className="zaiko-right-col">
            <TopNav onToast={pushToast} viewMode={viewMode} />
            {mainEl}
            <SiteFooter viewMode={viewMode} />
          </div>
        ) : mainEl}
      </div>

      {viewMode !== "zaiko" && <SiteFooter viewMode={viewMode} />}

      {versionEvent && <VersionModal event={versionEvent} onClose={() => setVersionEvent(null)} onToast={pushToast} />}
      {revisionEvent && <RevisionModal event={revisionEvent} onClose={() => setRevisionEvent(null)} onSend={handleSendMessage} />}
      {actionEvent && <ActionModal
        event={actionEvent}
        viewMode={viewMode}
        onClose={() => setActionEvent(null)}
        onSubmit={handleActionSubmit}
        onSaveDraft={handleSaveDraft}
        onSendRevision={(ev, msg) => handleSendMessage(ev, msg, "revision")}
      />}

      <div className="view-mode-switcher">
        <span className="vms-label">View</span>
        <div className="vms-toggle">
          <button className={`vms-btn lawson ${viewMode === "lawson" ? "active" : ""}`} onClick={() => setViewMode("lawson")}>Lawson</button>
          <button className={`vms-btn zaiko ${viewMode === "zaiko" ? "active" : ""}`} onClick={() => setViewMode("zaiko")}>ZAIKO</button>
        </div>
      </div>

      <div className="toast-region">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.kind}`}>
            {t.kind === "success" && <Icon.checkBadge style={{ width: 16, height: 16, color: "var(--green)" }} />}
            {t.kind === "error" && <Icon.exclaim style={{ width: 16, height: 16, color: "var(--red)" }} />}
            {t.kind === "info" && <Icon.info style={{ width: 16, height: 16, color: "var(--blue)" }} />}
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
