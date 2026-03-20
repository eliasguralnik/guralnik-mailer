// src/components/ProgressTracker.tsx
import React from 'react';
import { Section, Row, Column } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';

export interface ProgressStep {
  label: string;
  completed: boolean;
  active?: boolean;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
}

export const ProgressTracker = ({ steps }: ProgressTrackerProps) => {
  const theme = useTheme();

  return (
    <Section style={{
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.container,
      padding: '28px 24px',
      margin: `${theme.spacing.elementGap} 0`,
      border: `1px solid ${theme.colors.border}`,
    }}>
      {/* Progress Bar */}
      <div style={{ 
        display: 'flex', 
        width: '100%',
        marginBottom: '16px',
      }}>
        <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
          <tr>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                {/* Circle */}
                <td style={{ width: '32px', textAlign: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: step.completed || step.active ? theme.colors.primary : theme.colors.border,
                    color: step.completed || step.active ? theme.colors.surface : theme.colors.text.muted,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    lineHeight: '32px',
                    textAlign: 'center',
                    fontFamily: theme.typography.fontFamily,
                    margin: '0 auto',
                    border: step.active ? `3px solid ${theme.colors.primary}` : 'none',
                    boxSizing: 'border-box',
                  }}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                </td>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <td style={{ verticalAlign: 'middle' }}>
                    <div style={{
                      height: '3px',
                      backgroundColor: step.completed ? theme.colors.primary : theme.colors.border,
                      width: '100%',
                      borderRadius: '2px',
                    }} />
                  </td>
                )}
              </React.Fragment>
            ))}
          </tr>
          {/* Labels */}
          <tr>
            {steps.map((step, index) => (
              <React.Fragment key={`label-${index}`}>
                <td style={{ textAlign: 'center', paddingTop: '8px' }}>
                  <span style={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: '11px',
                    fontWeight: step.active ? 'bold' : 'normal',
                    color: step.completed || step.active ? theme.colors.text.main : theme.colors.text.muted,
                    display: 'block',
                    lineHeight: '14px',
                  }}>
                    {step.label}
                  </span>
                </td>
                {index < steps.length - 1 && <td />}
              </React.Fragment>
            ))}
          </tr>
        </table>
      </div>
    </Section>
  );
};
