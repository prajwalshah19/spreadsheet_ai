'use client';
import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../lib/types';

export default function ChatPanel({
  messages,
  onSend
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '0',
          background: 'var(--background)',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--text-secondary)', 
            padding: '32px 16px',
            fontSize: '14px'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
            Start a conversation to generate your spreadsheet
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} style={{ 
              padding: '20px 0',
              borderBottom: '1px solid var(--border)',
              background: m.role === 'assistant' ? 'var(--surface)' : 'var(--background)',
            }}>
              <div style={{
                maxWidth: '768px',
                margin: '0 auto',
                padding: '0 20px',
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-secondary)', 
                  marginBottom: '8px',
                  fontWeight: '500',
                }}>
                  {m.role === 'user' ? 'You' : `Assistant${m.turn ? ` · Turn ${m.turn}` : ''}`}
                </div>
                <div style={{ 
                  whiteSpace: 'pre-wrap', 
                  color: 'var(--text)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}>
                  {m.text}
                </div>
                {m.role === 'assistant' && m.specJson && (
                  <details style={{ marginTop: '12px' }}>
                    <summary style={{ 
                      cursor: 'pointer', 
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: '500',
                      padding: '8px 0',
                      userSelect: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <span>📋</span>
                      <span>Show JSON spec</span>
                    </summary>
                    <pre
                      style={{
                        padding: '12px',
                        background: 'var(--code)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        overflow: 'auto',
                        fontSize: '12px',
                        lineHeight: '1.4',
                        marginTop: '8px',
                        color: 'var(--text)',
                      }}
                    >
                      {JSON.stringify(m.specJson, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const text = String(fd.get('text') || '').trim();
          if (text) onSend(text);
          (e.currentTarget.elements.namedItem('text') as HTMLInputElement).value = '';
        }}
        style={{ 
          padding: '20px',
          borderTop: '1px solid var(--border)',
          background: 'var(--background)',
          flexShrink: 0,
        }}
      >
        <div style={{
          maxWidth: '768px',
          margin: '0 auto',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
        }}>
          <div style={{ flex: 1 }}>
            <input
              name="text"
              placeholder="Ask for a spreadsheet…"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                outline: 'none',
                fontSize: '14px',
                lineHeight: '1.4',
                transition: 'all 0.2s ease',
                resize: 'none',
                minHeight: '44px',
                maxHeight: '120px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button 
            type="submit" 
            style={{ 
              padding: '10px 16px',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--primary)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
            }}
          >
            <span>Send</span>
            <span style={{ fontSize: '12px' }}>→</span>
          </button>
        </div>
      </form>
    </div>
  );
} 