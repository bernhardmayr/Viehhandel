import type { ReactNode } from 'react';
import { GLOSSARY } from '../../data/glossary';

// Erklärt Fachbegriffe inline – v.a. für Hobbyhalter.
export function Term({ term, children }: { term: string; children?: ReactNode }) {
  const explanation = GLOSSARY[term];
  if (!explanation) return <>{children ?? term}</>;
  return (
    <span className="tip" tabIndex={0}>
      {children ?? term}
      <span className="tip-body" role="tooltip">
        {explanation}
      </span>
    </span>
  );
}
