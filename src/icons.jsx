// Icon set — heroicons (outline/mini/solid) inline so everything is offline.
const Icon = {
  search: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="9" cy="9" r="6.5" /><path d="M14 14l4 4" />
    </svg>
  ),
  calendar: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM3.5 7.5v7.75c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V7.5h-13z" clipRule="evenodd" />
    </svg>
  ),
  chevDown: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 011.06 0L10 10.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 8.28a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
  ),
  chevUp: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path fillRule="evenodd" d="M14.78 12.78a.75.75 0 01-1.06 0L10 9.06l-3.72 3.72a.75.75 0 11-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06z" clipRule="evenodd" />
    </svg>
  ),
  chevUpDown: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04L10 15.148l2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
    </svg>
  ),
  chevLeft: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path fillRule="evenodd" d="M12.78 5.22a.75.75 0 010 1.06L9.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z" clipRule="evenodd" />
    </svg>
  ),
  chevRight: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path fillRule="evenodd" d="M7.22 14.78a.75.75 0 010-1.06L10.94 10 7.22 6.28a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0z" clipRule="evenodd" />
    </svg>
  ),
  x: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <path d="M10 4v12M4 10h12" />
    </svg>
  ),
  pencil: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14.5 3.5a2 2 0 012.8 2.8L7 16.6l-4 1 1-4L14.5 3.5z" />
    </svg>
  ),
  ellipsisV: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <circle cx="10" cy="4" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="10" cy="16" r="1.5" />
    </svg>
  ),
  ellipsisH: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <circle cx="4" cy="10" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="16" cy="10" r="1.5" />
    </svg>
  ),
  link: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M8.5 11.5L11.5 8.5M9.5 5L12 2.5a3.54 3.54 0 115 5L14.5 10M10.5 15L8 17.5a3.54 3.54 0 11-5-5L5.5 10" />
    </svg>
  ),
  chat: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 7.5a3 3 0 013-3h6a3 3 0 013 3v4a3 3 0 01-3 3h-2l-3.5 3v-3H7a3 3 0 01-3-3v-4z" />
      <circle cx="8" cy="9.5" r=".75" fill="currentColor" />
      <circle cx="11" cy="9.5" r=".75" fill="currentColor" />
    </svg>
  ),
  info: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 9v4M10 6.5v0" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
    </svg>
  ),
  checkBadge: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path fillRule="evenodd" d="M8.6 2.3c.7-.4 1.5-.4 2.2 0l.9.5c.3.2.6.3.9.3l1 .1c.8.1 1.4.7 1.5 1.5l.1 1c0 .3.1.6.3.9l.5.9c.4.7.4 1.5 0 2.2l-.5.9c-.2.3-.3.6-.3.9l-.1 1c-.1.8-.7 1.4-1.5 1.5l-1 .1c-.3 0-.6.1-.9.3l-.9.5c-.7.4-1.5.4-2.2 0l-.9-.5c-.3-.2-.6-.3-.9-.3l-1-.1c-.8-.1-1.4-.7-1.5-1.5l-.1-1c0-.3-.1-.6-.3-.9l-.5-.9c-.4-.7-.4-1.5 0-2.2l.5-.9c.2-.3.3-.6.3-.9l.1-1c.1-.8.7-1.4 1.5-1.5l1-.1c.3 0 .6-.1.9-.3l.9-.5zM13.2 8.2a.75.75 0 00-1.1-1l-3.2 3.6-1.1-1.1a.75.75 0 10-1 1.1l1.6 1.6a.75.75 0 001.1 0l3.7-4.2z" clipRule="evenodd" />
    </svg>
  ),
  exclaim: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path fillRule="evenodd" d="M9.4 2.9a1 1 0 011.2 0c.3.2.4.5.5.7l7 11.7c.5.9-.2 2-1.2 2H3.1c-1 0-1.7-1.1-1.2-2l7-11.7c.1-.2.2-.5.5-.7zM10 7a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 7zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  globe: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-14.5c-.5 0-1 .3-1.5 1.2-.4.7-.7 1.7-.9 2.8h4.8c-.2-1.1-.5-2.1-.9-2.8-.5-.9-1-1.2-1.5-1.2zM6.2 10c0-.6 0-1.2.1-1.8h7.4c.1.6.1 1.2.1 1.8s0 1.2-.1 1.8H6.3c-.1-.6-.1-1.2-.1-1.8zm9 0c0-.6 0-1.2-.1-1.8h1.9c.4.9.6 1.8.6 1.8s-.2.9-.6 1.8h-1.9c.1-.6.1-1.2.1-1.8z" clipRule="evenodd" />
    </svg>
  ),
  moon: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M16.5 11.3a6 6 0 11-7.8-7.8 5 5 0 007.8 7.8z" />
    </svg>
  ),
  home: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 8.5L10 3l7 5.5V16a1 1 0 01-1 1h-3v-4H7v4H4a1 1 0 01-1-1V8.5z" />
    </svg>
  ),
  flag: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 17V3M4 4h9l-1.5 3L13 10H4" />
    </svg>
  ),
  gear: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 2v2.5M10 15.5V18M15.7 4.3l-1.8 1.8M6.1 13.9l-1.8 1.8M18 10h-2.5M4.5 10H2M15.7 15.7l-1.8-1.8M6.1 6.1L4.3 4.3" />
    </svg>
  ),
  wallet: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2.5" y="5" width="15" height="11" rx="2" />
      <path d="M2.5 8h15M14 12.5h1" />
    </svg>
  ),
  bank: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 9h14M10 2l8 4H2l8-4zM5 9v6M8 9v6M12 9v6M15 9v6M3 17h14" />
    </svg>
  ),
  profile: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <circle cx="10" cy="6" r="3" /><path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6H4z" />
    </svg>
  ),
  table: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="3" y="3" width="14" height="14" rx="1.5" />
      <path d="M3 8h14M3 13h14M8 3v14" />
    </svg>
  ),
  cards: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <rect x="11" y="11" width="6" height="6" rx="1" />
    </svg>
  ),
  customize: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}>
      <path d="M4 5h8M4 10h12M4 15h6" />
      <circle cx="14" cy="5" r="1.5" fill="#fff" />
      <circle cx="6" cy="15" r="1.5" fill="#fff" />
    </svg>
  ),
  download: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10 3v10M6 10l4 4 4-4M4 17h12" />
    </svg>
  ),
  upload: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10 14V4M6 7l4-4 4 4M4 17h12" />
    </svg>
  ),
  fileZip: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 3h7l4 4v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M14 3v4h4" />
      <path d="M10 8v2M10 12v2M10 16v2" />
    </svg>
  ),
  yen: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.1 5.4a.8.8 0 00-1.3 1L8.7 10H7a.8.8 0 000 1.5h2v.9H7A.8.8 0 007 14h2v1.2a.8.8 0 001.5 0V14h2a.8.8 0 000-1.5h-2v-.9h2a.8.8 0 000-1.5h-1.7l3-3.7a.8.8 0 10-1.3-1l-3 3.9-3-3.9z" clipRule="evenodd" />
    </svg>
  ),
  history: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 10a6 6 0 106-6" />
      <path d="M4 4v4h4" />
      <path d="M10 7v3l2 2" />
    </svg>
  ),
  edit: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14.5 3.5a2 2 0 012.8 2.8L7 16.6l-4 1 1-4L14.5 3.5z" />
    </svg>
  ),
  comment: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 6a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2h-2l-3 3v-3H6a2 2 0 01-2-2V6z" />
    </svg>
  ),
  sort: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}>
      <path d="M6 4v12M6 4l-2 2M6 4l2 2M14 16V4M14 16l-2-2M14 16l2-2" />
    </svg>
  ),
  arrowsHoriz: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 7h10l-3-3M17 13H7l3 3" />
    </svg>
  ),
  ticket: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 7a2 2 0 012-2h10a2 2 0 012 2v1.5a1.5 1.5 0 000 3V13a2 2 0 01-2 2H5a2 2 0 01-2-2v-1.5a1.5 1.5 0 000-3V7z" />
      <path d="M11.5 5v10" strokeDasharray="1.5 1.5" />
    </svg>
  ),
  tag: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10 2H4a2 2 0 00-2 2v6l8 8 8-8-8-8z" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
    </svg>
  ),
  users: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="7" cy="7" r="3" />
      <path d="M2 17c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      <circle cx="14" cy="8" r="2.5" />
      <path d="M13 17c0-2.2 1.5-4 3.5-4" />
    </svg>
  ),
  newspaper: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 4h10v12H4V4z" />
      <path d="M14 7h2v7a2 2 0 01-2 2" />
      <path d="M6 7h6M6 10h6M6 13h4" />
    </svg>
  ),
  article: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 3h7l3 3v11H5V3z" />
      <path d="M7 8h6M7 11h6M7 14h4" />
    </svg>
  ),
  rss: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 4a12 12 0 0112 12M4 10a6 6 0 016 6" />
      <circle cx="5" cy="15" r="1.2" fill="currentColor" />
    </svg>
  ),
  play: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2" y="4" width="16" height="12" rx="2" />
      <path d="M9 8l4 2-4 2V8z" fill="currentColor" />
    </svg>
  ),
  ellipsisCircle: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="10" cy="10" r="7" />
      <circle cx="6.5" cy="10" r="0.8" fill="currentColor" />
      <circle cx="10" cy="10" r="0.8" fill="currentColor" />
      <circle cx="13.5" cy="10" r="0.8" fill="currentColor" />
    </svg>
  ),
  puzzle: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 4h4v2.5a1.5 1.5 0 103 0V4h5v5h-2.5a1.5 1.5 0 100 3H16v5h-5v-2.5a1.5 1.5 0 10-3 0V17H4v-5h2.5a1.5 1.5 0 100-3H4V4z" />
    </svg>
  ),};
window.Icon = Icon;
