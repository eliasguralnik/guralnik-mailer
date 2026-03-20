// src/components/InfoGrid.tsx
import React from 'react';
import { Section, Row, Column } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeText } from './ThemeTypography';

export interface InfoGridItem {
  icon?: string;  // Emoji icon
  label: string;
  value: string;
}

interface InfoGridProps {
  items: InfoGridItem[];
  columns?: 2 | 3;
}

export const InfoGrid = ({ items, columns = 2 }: InfoGridProps) => {
  const theme = useTheme();

  // Group items into rows
  const rows: InfoGridItem[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }

  return (
    <Section style={{
      margin: `${theme.spacing.elementGap} 0`,
    }}>
      <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((item, colIndex) => (
              <td
                key={colIndex}
                style={{
                  width: `${100 / columns}%`,
                  padding: '16px',
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.container,
                  verticalAlign: 'top',
                  textAlign: 'center',
                }}
              >
                {item.icon && (
                  <div style={{
                    fontSize: '24px',
                    marginBottom: '8px',
                    lineHeight: '1',
                  }}>
                    {item.icon}
                  </div>
                )}
                <ThemeText variant="muted" style={{
                  margin: '0 0 4px 0',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600',
                }}>
                  {item.label}
                </ThemeText>
                <ThemeText style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}>
                  {item.value}
                </ThemeText>
              </td>
            ))}
            {/* Fill empty cells */}
            {row.length < columns && Array.from({ length: columns - row.length }).map((_, i) => (
              <td key={`empty-${i}`} style={{ width: `${100 / columns}%` }} />
            ))}
          </tr>
        ))}
      </table>
    </Section>
  );
};
