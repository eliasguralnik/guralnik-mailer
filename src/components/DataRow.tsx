// src/components/DataRow.tsx
import * as React from 'react';
import { Row, Column } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeText } from './ThemeTypography';

interface DataRowProps {
  label: string;
  value: string;
}

export const DataRow = ({ label, value }: DataRowProps) => {
  const theme = useTheme();

  return (
    <Row style={{ 
      width: '100%', 
      marginBottom: '12px',
      paddingBottom: '12px',
      borderBottom: (theme.name === 'classic' || theme.name === 'modern') 
        ? `1px solid ${theme.colors.border}` 
        : 'none'
    }}>
      <Column style={{ width: '50%', verticalAlign: 'top' }}>
        <ThemeText variant="muted" style={{ 
          margin: 0, 
          fontSize: '14px',
          fontWeight: theme.name === 'bold' ? 'bold' : 'normal'
        }}>
          {label}
        </ThemeText>
      </Column>
      <Column style={{ width: '50%', verticalAlign: 'top', textAlign: 'right' }}>
        <ThemeText style={{ 
          margin: 0, 
          fontSize: '14px', 
          fontWeight: 'bold' 
        }}>
          {value}
        </ThemeText>
      </Column>
    </Row>
  );
};