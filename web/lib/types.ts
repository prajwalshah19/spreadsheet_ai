export type ColType = 'string' | 'number' | 'date' | 'currency' | 'percent' | 'computed';

export interface Column {
  name: string;
  type: ColType;
  formula_template?: string; // for computed columns, uses {row}
}

export interface SummaryItem {
  label: string;
  op: 'SUM' | 'AVG';
  column: string;
}

export interface ChartSpec {
  kind: 'bar' | 'line';
  title: string;
  x_axis: string;
  series: string[];
}

export interface SheetSpec {
  title: string;
  columns: Column[];
  rows: Record<string, string | number>[];
  summary?: SummaryItem[];
  chart?: ChartSpec | null;
}

export interface PreviewPayload {
  id: string;
  title: string;
  columns: string[];
  rows: Record<string, string | number>[];
}

export type Row = Record<string, string | number>;

export type Role = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;            // user text or assistant justification (markdown-ish plain text)
  specJson?: SheetSpec;    // only for assistant turns
  turn?: number;           // 1 = first (from /generate), >=2 for /reiterate
}

export interface ChatRequestPayload {
  thread_id: string;
  prompt: string;
  turn: number;            // client tracks turn number
}

export interface ChatResponsePayload {
  justification: string;   // assistant explanation
  spec: SheetSpec;         // full JSON spec that will become xlsx
  preview: PreviewPayload; // light preview for UI table
  file?: string | null;    // optional download URL
  turn: number;            // server validates and returns turn
} 