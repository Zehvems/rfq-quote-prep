import type { CSSProperties } from 'react';

type AppIconProps = {
  name:
    | 'document'
    | 'plus'
    | 'sparkles'
    | 'arrow'
    | 'inbox'
    | 'check'
    | 'alert'
    | 'chevron'
    | 'refresh'
    | 'scan'
    | 'lock';
  className?: string;
  style?: CSSProperties;
};

const paths = {
  document: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8M8 17h5',
  plus: 'M12 5v14M5 12h14',
  sparkles: 'm12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3ZM20 2v4M18 4h4',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  inbox: 'M4 4h16l2 10v6H2v-6L4 4Zm-2 10h6l2 3h4l2-3h6',
  check: 'M20 6 9 17l-5-5',
  alert:
    'M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  chevron: 'm6 9 6 6 6-6',
  refresh:
    'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5',
  scan: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10',
  lock: 'M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Zm2 0V7a5 5 0 0 1 10 0v4',
};

export default function AppIcon({ name, className, style }: AppIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d={paths[name]} />
    </svg>
  );
}
