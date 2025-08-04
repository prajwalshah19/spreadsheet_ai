'use client';
import { useMemo, useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';
import ChatPanel from '../components/ChatPanel';
import SheetPanel from '../components/SheetPanel';
import { ChatMessage, ChatResponsePayload } from '../lib/types';
import { postGenerate, postReiterate } from '../lib/api';

const ThemeToggle = dynamic(() => import('../components/ThemeToggle'), {
  ssr: false,
  loading: () => null,
});

function uid() {
  return Math.random().toString(36).slice(2);
}

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId] = useState<string>(() => uuidv4());
  const [preview, setPreview] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [leftWidth, setLeftWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Client-side turn tracking (stateless approach)
  const currentTurn = messages.filter((m) => m.role === 'assistant').length + 1;
  const isFirstTurn = currentTurn === 1;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = e.clientX - containerRect.left;
        const minWidth = 300;
        const maxWidth = containerRect.width - 300;
        setLeftWidth(Math.max(minWidth, Math.min(maxWidth, newLeftWidth)));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  async function handleSend(text: string) {
    const userMsg: ChatMessage = { id: uid(), role: 'user', text };
    setMessages((m) => [...m, userMsg]);

    try {
      let res: ChatResponsePayload;
      if (isFirstTurn) {
        res = await postGenerate(threadId, text, currentTurn);
      } else {
        res = await postReiterate(threadId, text, currentTurn);
      }

      // Update right panel
      setPreview(res.preview);
      setDownloadUrl(res.file ? (process.env.NEXT_PUBLIC_API_BASE! + res.file) : '');

      // Add assistant turn with justification + JSON
      const assistantMsg: ChatMessage = {
        id: uid(),
        role: 'assistant',
        text: res.justification,
        specJson: res.spec,
        turn: res.turn
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch (e: any) {
      const assistantMsg: ChatMessage = {
        id: uid(),
        role: 'assistant',
        text: `Error: ${e.message}`,
      };
      setMessages((m) => [...m, assistantMsg]);
    }
  }

  return (
    <main style={{ 
      height: '100vh',
      padding: '24px',
      background: 'var(--background)',
      color: 'var(--text)',
      overflow: 'hidden',
    }}>
      <ThemeToggle />
      
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <header style={{ 
          marginBottom: '24px',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '700',
            color: 'var(--text)',
            marginBottom: '8px',
          }}>
            AI → Spreadsheet
          </h1>
          <p style={{ 
            margin: 0, 
            color: 'var(--text-secondary)', 
            fontSize: '16px',
            fontWeight: '400',
          }}>
            Chat with AI to generate and refine spreadsheets
          </p>
        </header>
        
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            flex: 1,
            minHeight: 0,
            position: 'relative',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow)',
            overflow: 'hidden',
          }}
        >
          {/* Left Panel - Chat */}
          <div style={{ 
            width: `${leftWidth}px`,
            minWidth: '300px',
            maxWidth: '800px',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid var(--border)',
            background: 'var(--surface)',
          }}>
            <ChatPanel messages={messages} onSend={handleSend} />
          </div>

          {/* Resizer */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              width: '4px',
              background: isDragging ? 'var(--primary)' : 'var(--border)',
              cursor: 'col-resize',
              position: 'relative',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isDragging) {
                e.currentTarget.style.background = 'var(--border-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isDragging) {
                e.currentTarget.style.background = 'var(--border)';
              }
            }}
          >
            <div style={{
              position: 'absolute',
              left: '-2px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '8px',
              height: '40px',
              background: 'var(--border)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '2px',
                height: '20px',
                background: 'var(--text-secondary)',
                borderRadius: '1px',
              }} />
            </div>
          </div>

          {/* Right Panel - Sheet */}
          <div style={{ 
            flex: 1,
            minWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface)',
          }}>
            <SheetPanel preview={preview} downloadUrl={downloadUrl} />
          </div>
        </div>
      </div>
    </main>
  );
} 