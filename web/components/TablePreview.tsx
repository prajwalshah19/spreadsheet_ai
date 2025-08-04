'use client';
import type { Row } from '../lib/types';

export default function TablePreview({
  title,
  columns,
  rows
}: {
  title: string;
  columns: string[];
  rows: Row[];
}) {
  if (!columns?.length) return null;
  
  return (
    <section style={{ 
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--background)',
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: '600',
          color: 'var(--text)'
        }}>
          {title}
        </h3>
      </div>
      <div style={{ overflow: 'auto' }}>
        <table style={{ 
          borderCollapse: 'collapse', 
          width: '100%',
          fontSize: '14px',
        }}>
          <thead>
            <tr style={{
              background: 'var(--background)',
              borderBottom: '2px solid var(--border)',
            }}>
              {columns.map((c) => (
                <th key={c} style={{ 
                  textAlign: 'left', 
                  padding: '12px 16px', 
                  fontWeight: '600',
                  color: 'var(--text)',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{
                borderBottom: '1px solid var(--border)',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--background)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              >
                {columns.map((c) => (
                  <td key={c} style={{ 
                    padding: '12px 16px',
                    color: 'var(--text)',
                    borderRight: '1px solid var(--border)',
                  }}>
                    {String(r[c] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
} 