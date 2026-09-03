import { BrokerProviderDefinition } from './brokerTypes';

export const BROKER_REGISTRY: BrokerProviderDefinition[] = [
  {
    providerId: 'zerodha',
    name: 'Zerodha Kite',
    tagline: 'India\'s largest retail brokerage with the Kite Connect API platform.',
    logoText: 'ZK',
    themeColor: '#FF5722',
    region: 'INDIA',
    authModel: 'API_KEY_SECRET',
    syncStatus: 'ACTIVE',
    marketSegments: ['NSE', 'BSE', 'F&O', 'MCX'],
    authDescription: 'Zerodha uses an OAuth-like redirect flow. You provide your API Key and Secret, then log in on Zerodha\'s website to generate a request token, which is exchanged for a daily access token.',
    setupTimeEstimate: '~3 minutes',
    connectionGuide: [
      {
        title: 'Access Kite Connect',
        description: 'Go to developers.zerodha.com and log in with your Kite credentials.',
        actionUrl: 'https://developers.zerodha.com/'
      },
      {
        title: 'Subscribe',
        description: 'Ensure you have an active Kite Connect API subscription (₹2,000/month).'
      },
      {
        title: 'Create App',
        description: 'Click "Create New App" on your developer dashboard.'
      },
      {
        title: 'Copy Keys',
        description: 'Once created, your app dashboard will display your API Key and API Secret. Copy both. RiskRules requires read-only access. Do not share your API Secret with anyone else.'
      }
    ],
    tokenLifecycle: {
      expiresDaily: true,
      expiryTimeLocal: '06:00 IST',
      maxLifetimeHours: 24,
      refreshStrategy: 'NONE_MANDATORY_REAUTH',
    },
    fields: [
      {
        id: 'clientId',
        label: 'Zerodha User ID',
        placeholder: 'e.g. AB1234',
        type: 'text',
        required: true,
        isSecret: false,
        regexValidation: '^[A-Za-z]{2,3}[0-9]{4,6}$',
        validationErrorMessage: 'User ID should be 2-3 letters followed by 4-6 digits (e.g., AB1234).',
        whereToFind: 'Your Zerodha User ID is the username you use to log into Kite (kite.zerodha.com). It\'s typically 2-3 letters followed by 4-6 numbers, like AB1234.',
        exampleFormat: 'AB1234',
      },
      {
        id: 'apiKey',
        label: 'Kite Connect API Key',
        placeholder: 'Enter your API key...',
        type: 'text',
        required: true,
        isSecret: false,
        whereToFind: '1. Go to developers.zerodha.com\n2. Subscribe to Kite Connect (₹2,000/month)\n3. Create a new app\n4. Copy the API Key from your app dashboard',
        exampleFormat: 'xxxxxxxxxxxxxxxx',
        docLink: 'https://developers.zerodha.com/',
      },
      {
        id: 'apiSecret',
        label: 'API Secret',
        placeholder: '••••••••••••••••••••••••••••••••',
        type: 'password',
        required: true,
        isSecret: true,
        whereToFind: 'Found in the same Kite Connect app page as your API Key at developers.zerodha.com.',
        securityNote: 'Stored encrypted on the server. Never transmitted back to your browser after saving.',
        docLink: 'https://kite.trade/docs/connect/v3/',
      },
    ],
    capabilities: [
      'AUTO_SYNC', 'PORTFOLIO', 'HOLDINGS', 'POSITIONS', 'ORDERS', 
      'MARGIN', 'PNL', 'LIVE_QUOTES', 'WEBSOCKET_STREAM', 'HISTORICAL_DATA', 
      'MULTI_ACCOUNT', 'OPTIONS', 'FNO'
    ],
    documentation: {
      setupGuideUrl: 'https://kite.trade/docs/connect/v3/',
      apiDocsUrl: 'https://kite.trade/docs/connect/v3/',
      officialPortalUrl: 'https://developers.zerodha.com/',
      troubleshootingUrl: 'https://kite.trade/forum/',
    },
  },
  {
    providerId: 'dhan',
    name: 'DhanHQ SuperAPI',
    tagline: 'Lightning-fast direct market access with zero API charges.',
    logoText: 'DH',
    themeColor: '#00D09C',
    region: 'INDIA',
    authModel: 'DAILY_SESSION_TOKEN',
    syncStatus: 'ACTIVE',
    marketSegments: ['NSE', 'BSE', 'F&O', 'MCX'],
    authDescription: 'Dhan uses a daily access token that you generate from your Dhan dashboard. It expires at midnight IST and needs to be refreshed each trading day.',
    setupTimeEstimate: '~1 minute',
    connectionGuide: [
      {
        title: 'Open DhanHQ',
        description: 'Log into web.dhan.co on a separate tab.',
        actionUrl: 'https://web.dhan.co/'
      },
      {
        title: 'Find Client ID',
        description: 'Your Client ID (8-12 digits) is located in the top-right corner under your profile name.'
      },
      {
        title: 'Access Trading APIs',
        description: 'Click your profile icon -> select "DhanHQ Trading APIs".'
      },
      {
        title: 'Generate Token',
        description: 'Click the "Generate Access Token" button.'
      },
      {
        title: 'Copy & Paste',
        description: 'Copy the long JWT token string and return to RiskRules. This token expires daily at midnight. You will need to click "Renew" in RiskRules each trading day.'
      }
    ],
    tokenLifecycle: {
      expiresDaily: true,
      expiryTimeLocal: '23:59 IST',
      maxLifetimeHours: 24,
      refreshStrategy: 'NONE_MANDATORY_REAUTH',
    },
    fields: [
      {
        id: 'clientId',
        label: 'Dhan Client ID',
        placeholder: 'e.g. 1100234567',
        type: 'text',
        required: true,
        isSecret: false,
        regexValidation: '^[0-9]{8,12}$',
        validationErrorMessage: 'Client ID should be 8–12 digits.',
        whereToFind: 'Log into web.dhan.co → Your Client ID is displayed in the top-right of the dashboard under your profile name.',
        exampleFormat: '1100234567',
        docLink: 'https://dhanhq.co/docs/v2/',
      },
      {
        id: 'accessToken',
        label: 'Daily Access Token',
        placeholder: 'Paste your daily access token here...',
        type: 'password',
        required: true,
        isSecret: true,
        whereToFind: '1. Log into web.dhan.co\n2. Click your profile icon in the top-right\n3. Select "DhanHQ Trading APIs"\n4. Click "Generate Access Token"\n5. Copy the generated token and paste it here',
        exampleFormat: 'eyJhbGciOiJIUzI1NiIs...',
        securityNote: 'This token grants read access to your trade history. It expires daily at midnight IST. RiskRules never places orders with your token.',
        docLink: 'https://dhanhq.co/docs/v2/',
      },
    ],
    capabilities: [
      'AUTO_SYNC', 'PORTFOLIO', 'HOLDINGS', 'POSITIONS', 'ORDERS', 
      'MARGIN', 'PNL', 'LIVE_QUOTES', 'WEBSOCKET_STREAM', 'HISTORICAL_DATA', 
      'MULTI_ACCOUNT', 'OPTIONS', 'FNO'
    ],
    documentation: {
      setupGuideUrl: 'https://dhanhq.co/docs/v2/',
      apiDocsUrl: 'https://dhanhq.co/docs/v2/',
      officialPortalUrl: 'https://web.dhan.co/',
      troubleshootingUrl: 'https://community.dhan.co/',
    },
  },
  {
    providerId: 'angelone',
    name: 'Angel One SmartAPI',
    tagline: 'Multi-asset API with automatic daily TOTP-based session renewal.',
    logoText: 'AO',
    themeColor: '#3B82F6',
    region: 'INDIA',
    authModel: 'CLIENT_ID_SECRET_TOTP',
    syncStatus: 'ACTIVE',
    marketSegments: ['NSE', 'BSE', 'F&O'],
    authDescription: 'Angel One uses TOTP-based authentication. You provide your MPIN and TOTP setup key once — RiskRules automatically refreshes your session daily without any manual action.',
    setupTimeEstimate: '~3 minutes',
    connectionGuide: [
      {
        title: 'Get App Key',
        description: 'Go to smartapi.angelbroking.com, log in, go to "My Apps" -> "Create App", and copy your new API Key.',
        actionUrl: 'https://smartapi.angelbroking.com/'
      },
      {
        title: 'Enable TOTP',
        description: 'Go to smartapi.angelbroking.com/enable-totp and verify your identity.'
      },
      {
        title: 'Capture the Secret',
        description: 'When the QR code appears, DO NOT just scan it. Look below the QR code for the "Setup Key" (e.g., JBSWY3D...). This is your TOTP Secret.'
      },
      {
        title: 'Prepare MPIN',
        description: 'Remember the 4-digit numeric MPIN you use to log into the Angel One mobile app. By providing the TOTP Secret and MPIN, RiskRules will automatically generate the 6-digit codes in the background to keep your session alive daily. You will never need to manually log in again.'
      }
    ],
    tokenLifecycle: {
      expiresDaily: true,
      expiryTimeLocal: '06:00 IST',
      maxLifetimeHours: 24,
      refreshStrategy: 'NONE_MANDATORY_REAUTH',
    },
    fields: [
      {
        id: 'clientId',
        label: 'Angel One Client Code',
        placeholder: 'e.g. A123456',
        type: 'text',
        required: true,
        isSecret: false,
        whereToFind: 'Open your Angel One app → Profile → Your Client Code is displayed at the top (e.g., A123456).',
        exampleFormat: 'A123456',
      },
      {
        id: 'apiKey',
        label: 'SmartAPI App Key',
        placeholder: 'Enter your app API key...',
        type: 'text',
        required: true,
        isSecret: false,
        whereToFind: '1. Go to smartapi.angelbroking.com\n2. Log in with your Angel One credentials\n3. Navigate to "My Apps"\n4. Create a new app or select your existing app\n5. Copy the "API Key" value',
        exampleFormat: 'xAbCd1234...',
        docLink: 'https://smartapi.angelbroking.com/docs',
      },
      {
        id: 'mpin',
        label: 'Trading MPIN',
        placeholder: '••••',
        type: 'password',
        required: true,
        isSecret: true,
        regexValidation: '^[0-9]{4,8}$',
        validationErrorMessage: 'MPIN must be 4–8 digits.',
        whereToFind: 'This is the numeric PIN you use to log into the Angel One trading terminal or app. If you\'ve forgotten it, reset it from the Angel One app.',
        securityNote: 'Stored encrypted on server. Used for automatic daily session refresh.',
      },
      {
        id: 'totpSecret',
        label: 'TOTP Secret (Base32 Key)',
        placeholder: 'e.g. JBSWY3DPEHPK3PXP...',
        type: 'password',
        required: true,
        isSecret: true,
        whereToFind: '1. Go to smartapi.angelbroking.com/enable-totp\n2. Complete the verification process\n3. A QR code will appear — below it is the "Setup Key"\n4. Copy that Setup Key (a string of uppercase letters and numbers like JBSWY3DPEHPK3PXP)\n5. This is your TOTP Secret — NOT the 6-digit code from your authenticator app',
        exampleFormat: 'JBSWY3DPEHPK3PXP',
        securityNote: 'This is the Base32 setup key, NOT the 6-digit code. It allows RiskRules to auto-generate daily login codes so you never need to manually refresh your session.',
        docLink: 'https://smartapi.angelbroking.com/enable-totp',
      },
    ],
    capabilities: [
      'AUTO_SYNC', 'PORTFOLIO', 'HOLDINGS', 'POSITIONS', 'ORDERS', 
      'MARGIN', 'PNL', 'HISTORICAL_DATA', 'MULTI_ACCOUNT', 'OPTIONS', 'FNO'
    ],
    documentation: {
      setupGuideUrl: 'https://smartapi.angelbroking.com/docs',
      apiDocsUrl: 'https://smartapi.angelbroking.com/docs/Orders',
      officialPortalUrl: 'https://smartapi.angelbroking.com/',
      troubleshootingUrl: 'https://smartapi.angelbroking.com/topic',
    },
  },
  {
    providerId: 'upstox',
    name: 'Upstox Developer V2',
    tagline: 'OAuth 2.0 streaming pipeline for equities and derivatives.',
    logoText: 'UP',
    themeColor: '#7C3AED',
    region: 'INDIA',
    authModel: 'OAUTH2',
    syncStatus: 'COMING_SOON',
    comingSoonEta: 'Q1 2027',
    comingSoonDescription: 'Our team is finalizing the OAuth 2.0 integration with Upstox\'s Developer V2 API. Full portfolio sync, live streaming, and multi-account support will be available.',
    marketSegments: ['NSE', 'BSE', 'F&O', 'MCX'],
    authDescription: 'Upstox uses standard OAuth 2.0. You provide your API Key and Secret, then authorize via the Upstox login page to generate an access token.',
    setupTimeEstimate: '~3 minutes',
    connectionGuide: [
      {
        title: 'Developer Portal',
        description: 'Go to developer.upstox.com and log in.',
        actionUrl: 'https://developer.upstox.com/'
      },
      {
        title: 'Create App',
        description: 'Create a new application in your dashboard.'
      },
      {
        title: 'Copy Keys',
        description: 'Copy your API Key (Client ID) and API Secret (Client Secret).'
      },
      {
        title: 'Authorization',
        description: 'After entering these in RiskRules, you will be redirected to the Upstox login page to securely grant access.'
      }
    ],
    tokenLifecycle: {
      expiresDaily: false,
      maxLifetimeHours: 720,
      refreshStrategy: 'OAUTH_SILENT_GRANT',
    },
    fields: [
      {
        id: 'apiKey',
        label: 'Upstox API Key',
        placeholder: 'Enter Upstox Client API Key...',
        type: 'text',
        required: true,
        isSecret: false,
        whereToFind: '1. Go to developer.upstox.com\n2. Create a new app\n3. Copy the Client ID (this is your API Key)',
        exampleFormat: 'xxxxxxxx-xxxx-xxxx',
        docLink: 'https://upstox.com/developer/api-documentation',
      },
      {
        id: 'apiSecret',
        label: 'OAuth Client Secret',
        placeholder: '••••••••••••••••••••••••••••••••',
        type: 'password',
        required: true,
        isSecret: true,
        whereToFind: 'Found in your app settings at developer.upstox.com alongside your Client ID.',
        securityNote: 'Used for OAuth token exchange. Stored encrypted on server.',
        docLink: 'https://upstox.com/developer/api-documentation',
      },
    ],
    capabilities: [
      'AUTO_SYNC', 'PORTFOLIO', 'HOLDINGS', 'POSITIONS', 'ORDERS', 
      'MARGIN', 'PNL', 'LIVE_QUOTES', 'WEBSOCKET_STREAM', 'HISTORICAL_DATA', 
      'MULTI_ACCOUNT', 'OPTIONS', 'FNO', 'MUTUAL_FUNDS'
    ],
    documentation: {
      setupGuideUrl: 'https://upstox.com/developer/api-documentation',
      apiDocsUrl: 'https://upstox.com/developer/api-documentation',
      officialPortalUrl: 'https://developer.upstox.com/',
    },
  },
  {
    providerId: 'groww',
    name: 'Groww Alpha API',
    tagline: 'Modern investing platform integration with portfolio sync.',
    logoText: 'GR',
    themeColor: '#00D09C',
    region: 'INDIA',
    authModel: 'API_KEY_SECRET',
    syncStatus: 'COMING_SOON',
    comingSoonEta: 'Q1 2027',
    comingSoonDescription: 'We\'re integrating with Groww\'s Alpha Trading API. Portfolio sync, mutual fund tracking, and historical data import will be supported.',
    marketSegments: ['NSE', 'BSE', 'F&O'],
    authDescription: 'Groww provides API access through their Trading API portal. Requires a paid subscription (₹499/month + taxes).',
    setupTimeEstimate: '~2 minutes',
    connectionGuide: [
      {
        title: 'API Portal',
        description: 'Go to the Groww Trading API portal (groww.in/trade-api).',
        actionUrl: 'https://groww.in/trade-api'
      },
      {
        title: 'Subscribe',
        description: 'Ensure you have an active Alpha API subscription.'
      },
      {
        title: 'Generate Key',
        description: 'Click generate to receive your Alpha API Key.'
      }
    ],
    tokenLifecycle: {
      expiresDaily: true,
      maxLifetimeHours: 24,
      refreshStrategy: 'NONE_MANDATORY_REAUTH',
    },
    fields: [
      {
        id: 'clientId',
        label: 'Groww Customer ID / Email',
        placeholder: 'trader@email.com',
        type: 'text',
        required: true,
        isSecret: false,
        whereToFind: 'Your registered Groww account email or customer ID from the Groww app → Profile.',
        exampleFormat: 'trader@email.com',
      },
      {
        id: 'apiKey',
        label: 'Alpha API Key',
        placeholder: 'Paste Groww Alpha API key...',
        type: 'password',
        required: true,
        isSecret: true,
        whereToFind: '1. Subscribe to Groww Trading API (₹499/month + taxes)\n2. Go to the Groww Trading API portal\n3. Generate your API Key',
        securityNote: 'Requires paid Groww API subscription.',
        docLink: 'https://groww.in/trade-api/docs/',
      },
    ],
    capabilities: [
      'AUTO_SYNC', 'PORTFOLIO', 'HOLDINGS', 'POSITIONS', 'ORDERS', 
      'PNL', 'HISTORICAL_DATA', 'MUTUAL_FUNDS'
    ],
    documentation: {
      setupGuideUrl: 'https://groww.in/trade-api/docs/',
      apiDocsUrl: 'https://groww.in/trade-api/docs/',
      officialPortalUrl: 'https://groww.in/',
    },
  },
  {
    providerId: '5paisa',
    name: '5paisa Developer API',
    tagline: 'Discount brokerage with algorithmic trading integration.',
    logoText: '5P',
    themeColor: '#EF4444',
    region: 'INDIA',
    authModel: 'API_KEY_SECRET',
    syncStatus: 'COMING_SOON',
    comingSoonEta: 'Q2 2027',
    comingSoonDescription: 'Integration with 5paisa\'s Xstream API is in progress. TOTP-based authentication and encrypted data feeds will be fully supported.',
    marketSegments: ['NSE', 'BSE', 'F&O', 'MCX'],
    authDescription: '5paisa uses a TOTP + Encryption Key flow. You provide your Client Code, App Key, and Encryption Key to authenticate.',
    setupTimeEstimate: '~3 minutes',
    connectionGuide: [
      {
        title: 'Xstream API',
        description: 'Log into your 5paisa account and navigate to the Xstream API section.',
        actionUrl: 'https://www.5paisa.com/developerapi'
      },
      {
        title: 'Generate Keys',
        description: 'Click Generate Keys.'
      },
      {
        title: 'Copy Both Keys',
        description: 'You will receive a User Key (App Key) and an Encryption Secret Key. Both are required to decrypt the data feed.'
      }
    ],
    tokenLifecycle: {
      expiresDaily: true,
      maxLifetimeHours: 24,
      refreshStrategy: 'NONE_MANDATORY_REAUTH',
    },
    fields: [
      {
        id: 'clientId',
        label: 'Client Login Code',
        placeholder: 'e.g. 52345678',
        type: 'text',
        required: true,
        isSecret: false,
        whereToFind: 'Your 5paisa login code from your account dashboard.',
        exampleFormat: '52345678',
      },
      {
        id: 'apiKey',
        label: 'App Key (User Key)',
        placeholder: 'Enter 5paisa App Key...',
        type: 'text',
        required: true,
        isSecret: false,
        whereToFind: '5paisa → Xstream API section → Generate Keys → Copy the App Key.',
        exampleFormat: 'xxxxxxxx',
        docLink: 'https://www.5paisa.com/developerapi',
      },
      {
        id: 'apiSecret',
        label: 'Encryption Secret Key',
        placeholder: '••••••••••••••••••••••••••••••••',
        type: 'password',
        required: true,
        isSecret: true,
        whereToFind: 'Found alongside your App Key in the 5paisa Xstream API section.',
        securityNote: 'Used for request encryption. Stored securely on server.',
        docLink: 'https://www.5paisa.com/developerapi',
      },
    ],
    capabilities: [
      'AUTO_SYNC', 'PORTFOLIO', 'HOLDINGS', 'POSITIONS', 'ORDERS', 
      'MARGIN', 'PNL', 'HISTORICAL_DATA', 'OPTIONS', 'FNO'
    ],
    documentation: {
      setupGuideUrl: 'https://www.5paisa.com/developerapi',
      apiDocsUrl: 'https://www.5paisa.com/developerapi',
      officialPortalUrl: 'https://www.5paisa.com/',
    },
  },
  {
    providerId: 'bullforce',
    name: 'BullForce Quant Portal',
    tagline: 'Global cryptocurrency and international liquidity connector.',
    logoText: 'BF',
    themeColor: '#F59E0B',
    region: 'GLOBAL',
    authModel: 'JWT',
    syncStatus: 'COMING_SOON',
    comingSoonEta: 'Q2 2027',
    comingSoonDescription: 'BullForce Quant Portal integration is being built for global crypto and international liquidity connectivity with JWT-based persistent sessions.',
    marketSegments: ['Crypto', 'Global'],
    authDescription: 'BullForce uses a long-lived JWT bearer token for authentication with automatic background refresh.',
    setupTimeEstimate: '~2 minutes',
    connectionGuide: [
      {
        title: 'Portal Dashboard',
        description: 'Log into the BullForce Quant Portal.',
        actionUrl: 'https://RiskRules.in/bullforce'
      },
      {
        title: 'Service Accounts',
        description: 'Navigate to Settings -> Service Accounts.'
      },
      {
        title: 'Generate Token',
        description: 'Generate a long-lived JWT Bearer token and paste it into RiskRules.'
      }
    ],
    tokenLifecycle: {
      expiresDaily: false,
      maxLifetimeHours: 720,
      refreshStrategy: 'REFRESH_TOKEN_AUTOMATIC',
    },
    fields: [
      {
        id: 'clientId',
        label: 'Account Tag / Alias',
        placeholder: 'e.g. Master-Fund-1',
        type: 'text',
        required: true,
        isSecret: false,
        whereToFind: 'Choose any name to identify this account (e.g., "Main Trading Fund").',
        exampleFormat: 'Master-Fund-1',
      },
      {
        id: 'accessToken',
        label: 'JWT Bearer Token',
        placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        type: 'password',
        required: true,
        isSecret: true,
        whereToFind: 'Obtain from the BullForce platform dashboard.',
        exampleFormat: 'eyJhbGciOi...',
        securityNote: 'Long-lived bearer token. Stored encrypted on server.',
      },
    ],
    capabilities: [
      'AUTO_SYNC', 'PORTFOLIO', 'HOLDINGS', 'POSITIONS', 'ORDERS', 
      'MARGIN', 'PNL', 'LIVE_QUOTES', 'WEBSOCKET_STREAM', 'HISTORICAL_DATA', 
      'MULTI_ACCOUNT'
    ],
    documentation: {
      setupGuideUrl: 'https://RiskRules.in/docs/bullforce',
      apiDocsUrl: 'https://RiskRules.in/docs/bullforce/api',
      officialPortalUrl: 'https://RiskRules.in/',
    },
  },
  {
    providerId: 'delta_exchange',
    name: 'Delta Exchange',
    tagline: 'Crypto options, futures, and spot derivatives exchange.',
    logoText: 'DE',
    themeColor: '#10B981',
    region: 'GLOBAL',
    authModel: 'API_KEY_SECRET',
    syncStatus: 'ACTIVE',
    marketSegments: ['Crypto', 'F&O'],
    authDescription: 'Delta Exchange uses HMAC-SHA256 request signing. You provide your API Key and Secret — authentication is computed per-request server-side. No daily token renewal needed.',
    setupTimeEstimate: '~2 minutes',
    connectionGuide: [
      {
        title: 'Open Settings',
        description: 'Log into delta.exchange, click your profile icon, and go to Settings -> API Keys.',
        actionUrl: 'https://delta.exchange'
      },
      {
        title: 'Create Key',
        description: 'Click "Create New API Key".'
      },
      {
        title: 'Save Secret immediately',
        description: 'Delta will show you the API Secret exactly once. Copy it immediately. If you lose it, you must create a new key. Your credentials are used to sign requests cryptographically. The secret is never transmitted in plain text over the network during sync.'
      }
    ],
    tokenLifecycle: {
      expiresDaily: false,
      maxLifetimeHours: 8760,
      refreshStrategy: 'NONE_MANDATORY_REAUTH',
    },
    fields: [
      {
        id: 'apiKey',
        label: 'Delta API Key',
        placeholder: 'Enter your API key...',
        type: 'text',
        required: true,
        isSecret: false,
        whereToFind: '1. Go to delta.exchange\n2. Click your profile → Settings → API Keys\n3. Click "Create New API Key"\n4. Copy the API Key',
        exampleFormat: 'xxxxxxxxxxxxxxxx',
        docLink: 'https://docs.delta.exchange/#authentication',
      },
      {
        id: 'apiSecret',
        label: 'Delta API Secret',
        placeholder: '••••••••••••••••••••••••••••••••',
        type: 'password',
        required: true,
        isSecret: true,
        whereToFind: 'Shown once when creating the API Key on Delta Exchange. If lost, you\'ll need to create a new API key pair.',
        securityNote: 'Used for HMAC request signing server-side. Never transmitted directly — used to compute per-request signatures.',
        docLink: 'https://docs.delta.exchange/',
      },
    ],
    capabilities: [
      'AUTO_SYNC', 'PORTFOLIO', 'HOLDINGS', 'POSITIONS', 'ORDERS', 
      'MARGIN', 'PNL', 'LIVE_QUOTES', 'WEBSOCKET_STREAM', 'HISTORICAL_DATA', 
      'MULTI_ACCOUNT', 'OPTIONS', 'FNO', 'CRYPTO'
    ],
    documentation: {
      setupGuideUrl: 'https://docs.delta.exchange/#authentication',
      apiDocsUrl: 'https://docs.delta.exchange/',
      officialPortalUrl: 'https://www.delta.exchange/',
    },
  },
];

export function getBrokerProvider(providerId: string): BrokerProviderDefinition | undefined {
  return BROKER_REGISTRY.find(b => b.providerId === providerId);
}
