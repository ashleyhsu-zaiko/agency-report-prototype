// Data for the 25 mock rows spanning all phases.
// Phases: "1" Lawson情報入力 (action required) → "2" ZAIKO確認まち → "revision" ZAIKO修正まち → "3" Lawson承認 → "4" ZAIKO振込まち → "5" 完了
// Once Lawson submits info: phase 1 → 2; when Zaiko responds w/ revision it becomes "revision"; when
//   Zaiko approves → 3; Lawson final approves → 4; Zaiko wires funds → 5.
const PHASES = {
  "1":        { idx: 0, label: "Lawson情報入力",  color: "active",   actionLabel: "対応開始", tone: "active"   },
  "2":        { idx: 1, label: "ZAIKO確認まち",    color: "wait",     actionLabel: "編集",      tone: "wait"     },
  "revision": { idx: 1, label: "ZAIKO修正まち",    color: "revision", actionLabel: "編集",      tone: "revision" },
  "3":        { idx: 2, label: "Lawson承認",       color: "active",   actionLabel: "対応開始", tone: "active"   },
  "4":        { idx: 3, label: "ZAIKO振込待ち",    color: "wait",     actionLabel: "編集",      tone: "wait"     },
  "5":        { idx: 4, label: "完了",              color: "done",     actionLabel: "編集",      tone: "done"     },
};

// Filters map
const TAB_MAP = {
  "all":      { label: "全部",              matches: () => true },
  "required": { label: "Lawson対応必須",   matches: (e) => e.phase === "1" || e.phase === "3" },
  "waiting":  { label: "ZAIKO対応まち",    matches: (e) => e.phase === "2" || e.phase === "4" || e.phase === "revision" },
  "done":     { label: "完了",              matches: (e) => e.phase === "5" },
};

const TITLES = [
  "Voice Box 2025　朗読「グレート・ギャツビー」〜恋に落ちることは運命を変えてしまう・・・永遠に〜",
  "鈴木雅之 ROCK'N ROLL RHAPSODY 2026 - VINTAGE DIAMOND DISCO -",
  "Aimer Hall Tour 2026 \"Open α Door\" 名古屋公演",
  "劇団四季ミュージカル『ウィキッド』東京公演 2026",
  "BUMP OF CHICKEN TOUR 2026 homesick satellite ver.2",
  "Perfume 7th Tour 2026 \"POLYGON WAVE\" 横浜アリーナ公演",
  "SAKANAQUARIUM 2026 ADAPT -オンライン-",
  "椎名林檎 椎名林檎と彼奴等がゆく 百鬼夜行 2026",
  "ヨルシカ Live 2026「斜陽」 大阪城ホール公演",
  "MAN WITH A MISSION TOUR 2026 〜Break and Cross the Walls II〜",
  "UVERworld KING'S PARADE 男祭り FINAL at 味の素スタジアム",
  "宇多田ヒカル SCIENCE FICTION TOUR 2026 東京ドーム公演",
  "back number Tour 2026「ベストアルバムツアー」",
  "あいみょん AIMYON LIVE TOUR 2026 \"マリーゴールド\"",
  "King Gnu Tour 2026「THE GREATEST UNKNOWN」",
  "米津玄師 2026 TOUR / 星月夜 Starry Night",
  "Official髭男dism Tour 2026 -Rejoice-",
  "星野源 DOME TOUR 2026「Reassembly」",
  "SEKAI NO OWARI Tour 2026 BANQUET",
  "BTS WORLD TOUR 2026 <Yet To Come> in JAPAN",
  "TWICE 5TH WORLD TOUR 'READY TO BE' in JAPAN 2026",
  "BLACKPINK WORLD TOUR 2026 東京ドーム公演",
  "IU Concert Tour 2026 HEREH WORLD TOUR",
  "SHINee WORLD VII in JAPAN 2026",
  "NCT 127 WORLD TOUR 'NEO CITY' 2026 日本公演",
];

const BANK_INFO = [
  "みずほ銀行\n池尻大橋\n-\n普通\n1147910\nカブシキカイシャ　オフィスサイン",
  "三菱UFJ銀行\n渋谷支店\n-\n普通\n2093847\n株式会社ステラエンタテインメント",
  "三井住友銀行\n新宿支店\n-\n当座\n0384756\nエムエフコンサート株式会社",
  "りそな銀行\n池袋支店\n-\n普通\n5647283\n株式会社ライブネクスト",
  "ゆうちょ銀行\n〇八九店\n-\n普通\n84756-3847\nオフィスサウンドブリッジ",
  "横浜銀行\n横浜駅前支店\n-\n普通\n3948271\n株式会社カラフルステージ",
  "千葉銀行\n千葉中央支店\n-\n普通\n7382910\n株式会社ミュージックルーム",
];

const DESKS = ["Beezos", "花田 俊介", "山本 智也", "佐藤 美咲", "鈴木 健二", "田中 雄介"];
const SALES_NAMES = ["山田 健司", "佐藤 美咲", "田中 雄介", "鈴木 健二", "高橋 裕子", "伊藤 誠"];
const DEPARTMENTS = ["第1営業部", "第2営業部", "第3営業部", "マーケティング部", "イベント事業部"];

const DATES = [
  "2026/01/10 - 2026/01/20",
  "2026/01/25 - 2026/02/04",
  "2026/02/05 - 2026/02/14",
  "2026/02/20 - 2026/03/01",
  "2026/03/05 - 2026/03/15",
  "2026/03/20 - 2026/04/05",
  "2026/04/01 - 2026/04/10",
  "2026/04/15 - 2026/05/02",
  "2026/05/01 - 2026/05/12",
  "2026/05/15 - 2026/06/01",
];

function mkEvent(i, overrides = {}) {
  const ev = {
    id: i + 1,
    eventId: String(234545 - i * 137),
    no: i + 1,
    phase: "1",
    title: TITLES[i % TITLES.length],
    dates: DATES[i % DATES.length],
    checklist: "必須",
    linkTitle: "LINK TITLE",
    fee: "5% + CF",
    cprMonth: "2026/5",
    copyright: "あり",
    desk: DESKS[i % DESKS.length],
    bank: BANK_INFO[i % BANK_INFO.length],
    paymentStart: i % 3 === 0,
    paymentComplete: i % 4 === 0,
    hasNote: i % 5 === 0,
    organizerNotes: i % 5 === 0 ? "税引前の手数料調整：配信チケット2,000円につき500円は寄付金となり販売手数料なし(500円×○○枚×5%)" : "",
    agencyNotes: i % 7 === 0 ? "エージェンシー手数料は税抜き計上。振込先変更申請中のため確認が必要。" : "",
    organizerPayout: 4671765 - i * 83000,
    agencyAmount: 441436 + i * 5100,
    updatedAt: `2026/01/${String(2 + (i % 20)).padStart(2,'0')} 14:0${i % 10}`,
    revisionMessage: "",
    ...overrides,
  };
  ev.form = ev.phase === "1" ? {
    checklist: "",
    copyright: "",
    deskName: "",
    salesName: "",
    department: "",
  } : {
    checklist: `https://docs.google.com/spreadsheets/d/checklist-ev${i + 1}`,
    copyright: i % 3 === 0 ? "なし" : "あり",
    deskName: DESKS[i % DESKS.length],
    salesName: SALES_NAMES[i % SALES_NAMES.length],
    department: DEPARTMENTS[i % DEPARTMENTS.length],
  };
  // Phase 1 — Lawson hasn't filled anything yet: clear all Lawson-owned fields
  if (ev.phase === "1") {
    ev.checklist = "";
    ev.linkTitle = "";
    ev.copyright = "";
    ev.desk = "";
    ev.bank = "";
  }
  return ev;
}

const SEED_EVENTS = [
  mkEvent(0, { phase: "1", checklist: "必須" }),
  mkEvent(1, { phase: "3", hasNote: true }),
  mkEvent(2, { phase: "revision", revisionMessage: "お世話になっております。A社の渡辺です。システムに登録されている情報について、一部修正をお願いしたく、ご連絡いたしました。\nお手数ですが、ご確認・ご対応のほど、よろしくお願いいたします。", revisionDate: "2026/01/31" }),
  mkEvent(3, { phase: "4" }),
  mkEvent(4, { phase: "5" }),
  mkEvent(5, { phase: "1" }),
  mkEvent(6, { phase: "2" }),
  mkEvent(7, { phase: "3" }),
  mkEvent(8, { phase: "5" }),
  mkEvent(9, { phase: "2" }),
  mkEvent(10, { phase: "1" }),
  mkEvent(11, { phase: "4" }),
  mkEvent(12, { phase: "5" }),
  mkEvent(13, { phase: "revision", revisionMessage: "手数料修正により、精算書修正お願いいたします。", revisionDate: "2026/01/31" }),
  mkEvent(14, { phase: "2" }),
  mkEvent(15, { phase: "1" }),
  mkEvent(16, { phase: "5" }),
  mkEvent(17, { phase: "2" }),
  mkEvent(18, { phase: "3" }),
  mkEvent(19, { phase: "4" }),
  mkEvent(20, { phase: "5" }),
  mkEvent(21, { phase: "2" }),
  mkEvent(22, { phase: "1" }),
  mkEvent(23, { phase: "revision", revisionMessage: "配信分の金額について、チェックリストとの差分をご確認ください。", revisionDate: "2026/01/28" }),
  mkEvent(24, { phase: "5" }),
];

// Column config — ordered list. Users can toggle visibility.
const COLUMNS = [
  { id: "no",        label: "No", fixed: true, width: 40 },
  { id: "progress",  label: "フェーズ",       default: true, width: 300 },
  { id: "action",    label: "アクション", default: true, width: 110 },
  { id: "eventId",   label: "イベントID",   default: true, width: 90 },
  { id: "name",      label: "イベント期間/イベント名", default: true, width: 280 },
  { id: "checklist", label: "チェックリスト", default: true, width: 120 },
  { id: "fee",       label: "手数料",          default: true, width: 110 },
  { id: "cprMonth",  label: "CPRの月",       default: true, width: 90 },
  { id: "copyright", label: "著作権処理",    default: false, width: 90 },
  { id: "desk",      label: "デスク担当",    default: false, width: 110 },
  { id: "bank",      label: "振込先",          default: true, width: 160 },
  { id: "organizer", label: "金額(主催)",    default: true, width: 130 },
  { id: "agency",    label: "金額(代理店)", default: true, width: 130 },
  { id: "handling",  label: "手数料率",       default: false, width: 120 },
  { id: "optional",  label: "", default: true, width: 40, fixed: true },
];

// ZAIKO-perspective phase labels (what ZAIKO sees)
const ZAIKO_PHASES = {
  "1":        { idx: 0, label: "Lawson対応まち" },
  "2":        { idx: 1, label: "ZAIKO確認" },
  "revision": { idx: 1, label: "ZAIKO修正" },
  "3":        { idx: 2, label: "Lawson承認まち" },
  "4":        { idx: 3, label: "ZAIKO振込" },
  "5":        { idx: 4, label: "完了" },
};

// Bump this string whenever SEED_EVENTS changes so persisted state resets.
const SEED_VERSION = "3";

window.PHASES = PHASES;
window.ZAIKO_PHASES = ZAIKO_PHASES;
window.TAB_MAP = TAB_MAP;
window.SEED_EVENTS = SEED_EVENTS;
window.SEED_VERSION = SEED_VERSION;
window.COLUMNS = COLUMNS;
