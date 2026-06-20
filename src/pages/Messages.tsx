import { useMemo, useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { EmptyState } from '../components/common/EmptyState';
import { formatRelative, uid } from '../lib/util';

export function Messages() {
  const { state, dispatch } = useAppStore();
  const { currentUser } = useAuth();
  const me = currentUser!;
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [text, setText] = useState('');

  const myMessages = state.messages.filter((m) => m.fromUserId === me.id || m.toUserId === me.id);

  const threads = useMemo(() => {
    const map = new Map<string, { partnerId: string; last: typeof myMessages[number] }>();
    for (const m of myMessages) {
      const partnerId = m.fromUserId === me.id ? m.toUserId : m.fromUserId;
      const existing = map.get(m.threadId);
      if (!existing || new Date(m.sentAt) > new Date(existing.last.sentAt)) {
        map.set(m.threadId, { partnerId, last: m });
      }
    }
    return [...map.entries()].sort(
      (a, b) => new Date(b[1].last.sentAt).getTime() - new Date(a[1].last.sentAt).getTime(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.messages, me.id]);

  const current = activeThread ?? threads[0]?.[0] ?? null;
  const partnerId = current
    ? myMessages.find((m) => m.threadId === current)?.fromUserId === me.id
      ? myMessages.find((m) => m.threadId === current)?.toUserId
      : myMessages.find((m) => m.threadId === current)?.fromUserId
    : null;
  const partner = state.users.find((u) => u.id === partnerId);
  const conversation = myMessages
    .filter((m) => m.threadId === current)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !current || !partnerId) return;
    dispatch({
      type: 'SEND_MESSAGE',
      message: {
        id: uid('m'),
        threadId: current,
        fromUserId: me.id,
        toUserId: partnerId,
        text: text.trim(),
        sentAt: new Date().toISOString(),
        read: false,
      },
    });
    setText('');
  }

  return (
    <div className="page">
      <div className="container">
        <h1>Nachrichten</h1>
        {threads.length === 0 ? (
          <EmptyState icon="✉" title="Noch keine Nachrichten">
            Kontaktieren Sie Anbieter über die Angebotsseiten.
          </EmptyState>
        ) : (
          <div className="detail-grid">
            <div className="card" style={{ overflow: 'hidden' }}>
              {threads.map(([threadId, info]) => {
                const p = state.users.find((u) => u.id === info.partnerId);
                return (
                  <button
                    key={threadId}
                    onClick={() => setActiveThread(threadId)}
                    className="card-pad"
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      border: 'none',
                      borderBottom: '1px solid var(--line)',
                      background: threadId === current ? 'var(--green-100)' : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <strong>{p?.displayName ?? 'Unbekannt'}</strong>
                    <p className="text-sm text-muted" style={{ margin: '4px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {info.last.text}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', minHeight: 360 }}>
              <h3 style={{ marginTop: 0 }}>{partner?.displayName ?? 'Konversation'}</h3>
              <div className="divider" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {conversation.map((m) => {
                  const mine = m.fromUserId === me.id;
                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: mine ? 'flex-end' : 'flex-start',
                        background: mine ? 'var(--green-700)' : '#eceee9',
                        color: mine ? '#fff' : 'var(--ink)',
                        padding: '8px 12px',
                        borderRadius: 12,
                        maxWidth: '75%',
                      }}
                    >
                      <div>{m.text}</div>
                      <div className="text-sm" style={{ opacity: 0.7, marginTop: 2 }}>
                        {formatRelative(m.sentAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={send} className="row" style={{ gap: 8, marginTop: 14 }}>
                <input
                  style={{ flex: 1, padding: '11px 12px', border: '1px solid var(--line)', borderRadius: 8, font: 'inherit' }}
                  placeholder="Nachricht schreiben …"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  Senden
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
