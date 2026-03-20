// src/components/StatusBadge.tsx
import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

type StatusType = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'refunded' | 'returned';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
}

const statusColors: Record<StatusType, { bg: string; text: string; dot: string }> = {
  pending:    { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  processing: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  shipped:    { bg: '#E0E7FF', text: '#3730A3', dot: '#6366F1' },
  delivered:  { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  canceled:   { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
  refunded:   { bg: '#F3E8FF', text: '#6B21A8', dot: '#A855F7' },
  returned:   { bg: '#FFF7ED', text: '#9A3412', dot: '#F97316' },
};

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const theme = useTheme();
  const colors = statusColors[status] || statusColors.pending;

  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: colors.bg,
      color: colors.text,
      fontSize: '13px',
      fontWeight: '600',
      fontFamily: theme.typography.fontFamily,
      padding: '6px 14px 6px 12px',
      borderRadius: '100px',
      lineHeight: '1',
      letterSpacing: '0.02em',
    }}>
      <span style={{
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: colors.dot,
        marginRight: '8px',
        verticalAlign: 'middle',
      }} />
      {label}
    </span>
  );
};
