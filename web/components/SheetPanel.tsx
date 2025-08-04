'use client';
import TablePreview from './TablePreview';

export default function SheetPanel({
  preview,
  downloadUrl
}: {
  preview: { title: string; columns: string[]; rows: Record<string, string | number>[] } | null;
  downloadUrl?: string;
}) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      padding: '16px',
    }}>
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        minHeight: 0,
      }}>
        {preview ? (
          <TablePreview title={preview.title} columns={preview.columns} rows={preview.rows} />
        ) : (
          <div style={{ 
            color: 'var(--text-secondary)', 
            textAlign: 'center',
            padding: '32px 16px',
            fontSize: '14px'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
            No spreadsheet yet. Send a message on the left.
          </div>
        )}
      </div>
      {downloadUrl && (
        <div style={{ 
          padding: '12px 16px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          textAlign: 'center',
          marginTop: '16px',
          flexShrink: 0,
        }}>
          <a 
            href={downloadUrl} 
            target="_blank" 
            rel="noreferrer"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '14px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--primary)',
              background: 'transparent',
              transition: 'all 0.2s ease',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--primary)';
            }}
          >
            📥 Download .xlsx
          </a>
        </div>
      )}
    </div>
  );
} 