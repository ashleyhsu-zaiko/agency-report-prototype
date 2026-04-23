const BellIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18 }}>
    <path d="M4 8a6 6 0 1112 0v3l1.5 3h-15L4 11V8zM7.5 17a2.5 2.5 0 005 0" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Lawson top nav ────────────────────────────────────────────
const TopNav = ({ onToast, viewMode = "lawson" }) => {
  if (viewMode === "zaiko") {
    return (
      <div className="top-nav zaiko">
        <div className="spacer" />
        <button className="icon-btn"><BellIcon /></button>
        <div className="zaiko-user-chip">
          <div className="zaiko-avatar">A</div>
          <span>Ashley Hsu</span>
          <Icon.chevDown style={{ width: 12, height: 12 }} />
        </div>
      </div>
    );
  }
  return (
    <div className="top-nav">
      <div className="brand">
        <div className="brand-mark">Z</div>
        <div className="brand-name">
          ZAIKO Partners
          <small>creator services</small>
        </div>
      </div>
      <div className="spacer" />
      <button className="create-btn" onClick={() => onToast("新規イベント作成 (placeholder)", "info")}>
        <Icon.plus style={{ width: 14, height: 14, marginRight: 4, verticalAlign: "middle" }} />
        新規作成
      </button>
      <button className="icon-btn" title="お知らせ"><BellIcon /></button>
      <button className="icon-btn" title="言語"><Icon.globe style={{ width: 18, height: 18 }} /></button>
      <div className="profile-chip">L</div>
    </div>
  );
};

// ── Lawson / ZAIKO side nav ───────────────────────────────────
const SideNav = ({ activeItem = "agency-report", onNavigate, viewMode = "lawson" }) => {
  if (viewMode === "zaiko") {
    return (
      <aside className="side zaiko">
        <div className="zaiko-brand-block">
          <div className="brand-mark zaiko-mark">Z</div>
          <span className="zaiko-brand-text">NERV</span>
        </div>
        <div className="nav-section">
          <div className="nav-item">
            <span className="nav-item-label"><Icon.home />Dashboard</span>
          </div>
          <div className="nav-item">
            <span className="nav-item-label"><Icon.users />Users</span>
            <Icon.chevRight className="chev" />
          </div>
          <div className="nav-item section-active">
            <span className="nav-item-label"><Icon.wallet />Accounting</span>
            <Icon.chevDown className="chev" />
          </div>
          <div className="zaiko-tab-section">
            <div
              className={`zaiko-tab ${activeItem === "agency-report" ? "active" : ""}`}
              onClick={() => onNavigate && onNavigate("agency-report")}
            >Agency report</div>
            <div
              className="zaiko-tab"
              onClick={() => onNavigate && onNavigate("tax-categories")}
            >Tax Categories</div>
          </div>
          <div className="nav-item">
            <span className="nav-item-label"><Icon.profile />Profiles</span>
            <Icon.chevRight className="chev" />
          </div>
          <div className="nav-item">
            <span className="nav-item-label"><Icon.gear />Ops</span>
            <Icon.chevRight className="chev" />
          </div>
          <div className="nav-item">
            <span className="nav-item-label"><Icon.puzzle />Tools</span>
            <Icon.chevRight className="chev" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="side">
      <div className="profile-picker">
        <div className="avatar">
          <Icon.profile style={{ width: 14, height: 14 }} />
        </div>
        <div className="name">Profile name</div>
        <Icon.chevUpDown style={{ width: 14, height: 14, color: "var(--n-4)" }} />
      </div>
      <div className="nav-section">
        <div className="nav-item"><span className="nav-item-label"><Icon.home />Home</span></div>
        <div className="nav-item"><span className="nav-item-label"><Icon.ticket />Events</span><Icon.chevDown className="chev" /></div>
        <div className="nav-item"><span className="nav-item-label"><Icon.tag />On-site sales</span><Icon.chevDown className="chev" /></div>
        <div className="nav-item"><span className="nav-item-label"><Icon.users />Audience</span></div>
        <div className="nav-item"><span className="nav-item-label"><Icon.newspaper />Newsletter</span></div>
        <div className="nav-item"><span className="nav-item-label"><Icon.article />Articles</span></div>
        <div className="nav-item"><span className="nav-item-label"><Icon.rss />Subscriptions</span></div>
        <div className="nav-item"><span className="nav-item-label"><Icon.play />Video rentals</span></div>
        <div className="nav-item section-active">
          <span className="nav-item-label"><Icon.ellipsisCircle />More</span>
          <Icon.chevUp className="chev" />
        </div>
        <div className="nav-item sub" onClick={() => onNavigate && onNavigate("profile-settings")}>Profile settings</div>
        <div className="nav-item sub" onClick={() => onNavigate && onNavigate("monthly-payout")}>Monthly payout report</div>
        <div
          className={`nav-item sub ${activeItem === "agency-report" ? "active" : ""}`}
          onClick={() => onNavigate && onNavigate("agency-report")}
        >Agency report</div>
        <div className="nav-item sub" onClick={() => onNavigate && onNavigate("monthly-payout-2")}>Monthly payout report</div>
        <div className="nav-item sub" onClick={() => onNavigate && onNavigate("setting-settings")}>Seting settings</div>
        <div className="nav-item sub" onClick={() => onNavigate && onNavigate("payment-settings")}>Payment settings</div>
        <div className="nav-item sub" onClick={() => onNavigate && onNavigate("team-management")}>Team management</div>
        <div className="nav-item sub" onClick={() => onNavigate && onNavigate("integrations")}>Integrations</div>
      </div>
    </aside>
  );
};

// ── Footer ────────────────────────────────────────────────────
const SiteFooter = ({ viewMode = "lawson" }) => (
  <footer className="site-footer">
    <div className="zk">ZAIKO</div>
    {viewMode === "zaiko" ? (
      <div className="footer-links">
        <span>©Zaiko PTE Ltd • All rights reserved</span>
        <span>Support</span>
        <span>Terms</span>
        <span>Privacy policy</span>
        <span>Legal notice</span>
        <span>Manage cookies</span>
      </div>
    ) : (
      <div className="footer-links">
        <span>© 2026 ZAIKO Inc.</span>
        <span>利用規約</span>
        <span>プライバシーポリシー</span>
        <span>特定商取引法に基づく表記</span>
      </div>
    )}
  </footer>
);

window.TopNav = TopNav;
window.SideNav = SideNav;
window.SiteFooter = SiteFooter;
