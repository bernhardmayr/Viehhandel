import type { EscrowTransaction } from '../../types/models';
import { ESCROW_STEPS, ESCROW_STEP_LABELS } from '../../types/models';
import { formatRelative } from '../../lib/util';

// USP-Kernkomponente: visualisiert den Treuhand-Ablauf mit Käuferschutz.
export function EscrowStepper({ escrow }: { escrow: EscrowTransaction }) {
  if (escrow.step === 'storniert') {
    return <div className="warn-box">Diese Transaktion wurde storniert.</div>;
  }
  const currentIdx = ESCROW_STEPS.indexOf(escrow.step);

  return (
    <div>
      {ESCROW_STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const current = idx === currentIdx;
        const event = escrow.verlauf.find((e) => e.step === step);
        return (
          <div key={step} className={`escrow-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
            <span className="escrow-dot">{done ? '✓' : idx + 1}</span>
            <div>
              <div style={{ fontWeight: 600 }}>{ESCROW_STEP_LABELS[step]}</div>
              {event && <div className="text-sm text-muted">{formatRelative(event.at)}</div>}
              {current && step !== 'freigegeben' && (
                <div className="text-sm text-muted">⏳ aktueller Schritt</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
