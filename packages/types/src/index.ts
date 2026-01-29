export type ClientId = 'gmail-web' | 'apple-mail' | 'outlook-win' | 'yahoo-mail';

export type EngineType = 'chromium' | 'webkit' | 'word';

export interface RenderInput {
  html: string;
  clientId: ClientId;
}

export interface Warning {
  type: 'removed-node' | 'removed-attribute' | 'unsupported-css' | 'compatibility';
  severity: 'info' | 'warning' | 'error';
  message: string;
  selector?: string;
  property?: string;
}

export interface RenderResult {
  clientId: ClientId;
  engine: EngineType;
  screenshotUrl: string;
  finalHtml: string;
  warnings: Warning[];
}

export interface EmailClientRenderer {
  id: ClientId;
  name: string;
  engine: EngineType;
  render(input: RenderInput): Promise<RenderResult>;
}

export interface RemovedNode {
  tagName: string;
  selector: string;
  reason?: string;
}

export interface RemovedAttribute {
  element: string;
  attribute: string;
  value?: string;
  reason?: string;
}

export interface ModifiedStyle {
  selector: string;
  property: string;
  originalValue: string;
  newValue: string | null;
  reason?: string;
}

export interface DOMDiff {
  removedNodes: RemovedNode[];
  removedAttributes: RemovedAttribute[];
  modifiedStyles: ModifiedStyle[];
}

export interface NormalizedEmail {
  html: string;
  originalHtml: string;
}

export interface AnalysisResult {
  clientId: ClientId;
  diff: DOMDiff;
  warnings: Warning[];
}

export interface RenderRequest {
  html: string;
  clients: ClientId[];
}

export interface RenderResponse {
  results: RenderResult[];
  convertedHtml?: string;
}

export interface AnalyseRequest {
  originalHtml: string;
  results: RenderResult[];
}

export interface AnalyseResponse {
  analyses: AnalysisResult[];
}

export interface CSSCompatibilityRule {
  pattern: RegExp | string;
  message: string;
  severity: Warning['severity'];
}

export interface ClientCompatibility {
  clientId: ClientId;
  unsupportedProperties: string[];
  rules: CSSCompatibilityRule[];
}

export const EMAIL_CLIENTS: Record<
  ClientId,
  { name: string; engine: EngineType; simulated: boolean }
> = {
  'gmail-web': {
    name: 'Gmail Web',
    engine: 'chromium',
    simulated: false,
  },
  'apple-mail': {
    name: 'Apple Mail',
    engine: 'webkit',
    simulated: false,
  },
  'outlook-win': {
    name: 'Outlook Windows',
    engine: 'word',
    simulated: true,
  },
  'yahoo-mail': {
    name: 'Yahoo Mail',
    engine: 'chromium',
    simulated: false,
  },
};

export type RendererStatus = 'checking' | 'connected' | 'disconnected';
export type EditorMode = 'html' | 'react-email';
