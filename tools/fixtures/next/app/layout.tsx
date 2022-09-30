import type { ReactNode } from 'react';
import '@plurid/carved-ui-react/styles.css';
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
