import type { CSSProperties } from 'react';

type AppIconProps = {
  name: 'document' | 'plus' | 'sparkles' | 'arrow' | 'inbox';
  className?: string;
  style?: CSSProperties;
};

const paths = {
  document: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8M8 17h5',
  plus: 'M12 5v14M5 12h14',
  sparkles: 'm12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3ZM20 2v4M18 4h4',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  inbox: 'M4 4h16l2 10v6H2v-6L4 4Zm-2 10h6l2 3h4l2-3h6',
};

export default function AppIcon({ name, className, style }: AppIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d={paths[name]} />
    </svg>
  );
}
