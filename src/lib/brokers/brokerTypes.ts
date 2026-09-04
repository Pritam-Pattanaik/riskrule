import React from 'react';

export type AuthModel = 
  | 'OAUTH2' 
  | 'API_KEY_SECRET' 
  | 'CLIENT_ID_SECRET_TOTP' 
  | 'DAILY_SESSION_TOKEN' 
  | 'JWT' 
  | 'MANUAL_IMPORT_ONLY';

export type SyncStatus = 'ACTIVE' | 'COMING_SOON' | 'BETA';

export type BrokerCapability = 
  | 'AUTO_SYNC' 
  | 'PORTFOLIO' 
  | 'HOLDINGS' 
  | 'POSITIONS' 
  | 'ORDERS' 
  | 'MARGIN' 
  | 'PNL' 
  | 'LIVE_QUOTES' 
  | 'WEBSOCKET_STREAM' 
  | 'HISTORICAL_DATA' 
  | 'MULTI_ACCOUNT' 
  | 'OPTIONS' 
  | 'FNO' 
  | 'MUTUAL_FUNDS'
  | 'CRYPTO';

export interface BrokerFormField {
  id: string; // e.g. 'apiKey', 'apiSecret', 'totpSecret', 'clientId', 'accessToken'
  label: string;
  placeholder: string;
  type: 'text' | 'password' | 'number' | 'url';
  required: boolean;
  isSecret: boolean; // Governs memory sanitization and password field rendering
  regexValidation?: string;
  validationErrorMessage?: string;
  helperText?: string;
  /** Step-by-step instructions for finding this credential */
  whereToFind?: string;
  /** Example format shown as ghost text (e.g. "AB1234", "eyJhbGci...") */
  exampleFormat?: string;
  /** Security note for this field (e.g. "Stored encrypted, never shared") */
  securityNote?: string;
  /** Direct link to official docs page for this credential */
  docLink?: string;
}

export interface ConnectionGuideStep {
  title: string;
  description: string;
  actionUrl?: string; // Optional URL for "Open Portal" buttons
}

export interface BrokerProviderDefinition {
  providerId: string; // e.g., 'dhan', 'zerodha', 'angelone', 'groww', 'upstox', '5paisa', 'bullforce'
  name: string;
  tagline: string;
  logoText: string;
  /** Path to official SVG logo asset (imported via Vite) */
  logoSrc?: string;
  themeColor: string; // Tailwind or Hex color accent for card identity
  region: 'INDIA' | 'USA' | 'GLOBAL';
  authModel: AuthModel;
  /** Whether server-side trade sync is implemented for this broker */
  syncStatus?: SyncStatus;
  /** Estimated availability for COMING_SOON brokers (e.g., "Q4 2026") */
  comingSoonEta?: string;
  /** Short description shown in the Coming Soon modal */
  comingSoonDescription?: string;
  /** Market segments this broker supports (e.g., ['NSE', 'BSE', 'F&O']) */
  marketSegments?: string[];
  /** Human-readable explanation of the authentication flow */
  authDescription?: string;
  /** Estimated time to complete setup (e.g., "~2 minutes") */
  setupTimeEstimate?: string;
  /** Step-by-step guide shown to the user BEFORE they see the form */
  connectionGuide?: ConnectionGuideStep[];
  tokenLifecycle: {
    expiresDaily: boolean;
    expiryTimeLocal?: string; // e.g., '06:00' or '23:59' IST
    maxLifetimeHours?: number;
    refreshStrategy: 'NONE_MANDATORY_REAUTH' | 'REFRESH_TOKEN_AUTOMATIC' | 'OAUTH_SILENT_GRANT';
  };
  fields: BrokerFormField[];
  capabilities: BrokerCapability[];
  documentation: {
    setupGuideUrl: string;
    apiDocsUrl: string;
    officialPortalUrl: string;
    troubleshootingUrl?: string;
  };
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  recordsImported: number;
  durationMs: number;
  reason?: string;
}

export type BrokerHealthStatus = 'ONLINE' | 'WARNING' | 'EXPIRED' | 'DISCONNECTED';

export interface BrokerAccountConnection {
  id: string; // Unique account instance UUID (Multi-account support)
  providerId: string; // Ref to BrokerProviderDefinition
  accountAlias?: string; // e.g., 'Personal', 'Business F&O', 'Family Vault'
  clientId?: string;
  isActive: boolean;
  healthStatus: BrokerHealthStatus;
  tokenExpiresAt?: string;
  lastSyncedAt?: string;
  lastSyncDurationMs?: number;
  todaySyncCount: number;
  totalRecordsImported: number;
  lastSyncError?: string | null;
  syncHistory: SyncLogEntry[];
  createdAt: string;
}
