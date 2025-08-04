'use client';

import React from 'react';
import { ThemeProvider } from '../lib/theme';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>AI → Spreadsheet MVP</title>
        <meta name="description" content="UI for generating spreadsheets from natural language" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 