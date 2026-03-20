// src/providers/index.ts
export interface EmailProvider {
  send(options: {
    to: string;
    subject: string;
    html: string;
    from: string;
  }): Promise<any>;
}