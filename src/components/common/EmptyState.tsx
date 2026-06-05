import type { ReactNode } from 'react';

export function EmptyState({
  icon = '📭',
  title,
  children,
}: {
  icon?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="card card-pad" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: '2.4rem' }}>{icon}</div>
      <h3 style={{ marginBottom: 6 }}>{title}</h3>
      {children && <p className="text-muted" style={{ margin: 0 }}>{children}</p>}
    </div>
  );
}
