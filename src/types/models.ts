// Zentrale Datenmodelle der Viehhandel-Plattform.
// Hinweis: Reine Frontend-Demo – Persistenz über localStorage.

export type UserRole = 'landwirt' | 'haendler' | 'schlachthof' | 'hobby';

export const ROLE_LABELS: Record<UserRole, string> = {
  landwirt: 'Landwirt:in',
  haendler: 'Viehhändler:in',
  schlachthof: 'Schlachtbetrieb',
  hobby: 'Privat / Hobbyhalter:in',
};

export interface User {
  id: string;
  email: string;
  password: string; // Demo only – Klartext, NICHT für Produktion
  displayName: string;
  role: UserRole;
  verified: boolean; // verifizierter Betrieb / Händler
  ratingAvg: number; // 0..5
  ratingCount: number;
  betriebsnummer?: string; // HIT-Betriebsnummer
  ort?: string;
  plz?: string;
  createdAt: string;
}

export type SaleType = 'auktion' | 'direktkauf' | 'vermittlung' | 'gesuch';

export const SALE_TYPE_LABELS: Record<SaleType, string> = {
  auktion: 'Auktion',
  direktkauf: 'Direktkauf',
  vermittlung: 'Vermittlung',
  gesuch: 'Gesuch',
};

export type AnimalCategory = 'kuh' | 'kalb' | 'faerse' | 'bulle' | 'ochse';

export const CATEGORY_LABELS: Record<AnimalCategory, string> = {
  kuh: 'Kuh',
  kalb: 'Kalb',
  faerse: 'Färse',
  bulle: 'Bulle',
  ochse: 'Ochse',
};

export type HealthStatusBVD = 'unverdächtig' | 'verdächtig' | 'ungetestet';
export type HealthStatusBHV1 = 'frei' | 'reagent' | 'ungetestet';

export interface Impfung {
  bezeichnung: string;
  datum: string;
}

// Simulierte HIT-/Tierpass-Daten (USP: durchgängige Herkunfts-Transparenz)
export interface HitPass {
  ohrmarke: string; // z.B. "DE 09 123 45678"
  geburtsdatum: string;
  herkunftsbetrieb: string;
  rasse: string;
  bvdStatus: HealthStatusBVD;
  bhv1Status: HealthStatusBHV1;
  impfungen: Impfung[];
  vorbesitzerKette: string[]; // Herkunftskette
  abmeldungSimuliert: boolean; // papierlose Ab-/Ummeldung erfolgt
}

export type Handelsklasse = 'E' | 'U' | 'R' | 'O' | 'P'; // EUROP
export type Fettklasse = 1 | 2 | 3 | 4 | 5;

// Nur für Schlachtvieh relevant (Nutzergruppe Schlachtbetrieb)
export interface SlaughterData {
  lebendgewichtKg: number;
  handelsklasse: Handelsklasse;
  fettklasse: Fettklasse;
  schlachtkoerperGewichtKg?: number;
}

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: string;
  isBot: boolean;
}

export interface Auction {
  startPreis: number;
  currentPreis: number;
  mindestSchritt: number;
  endsAt: string; // ISO – Basis für Countdown
  bids: Bid[];
  status: 'live' | 'beendet';
  gewinnerUserId?: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  category: AnimalCategory;
  saleType: SaleType;
  anzahl: number;
  preis?: number; // Direktkauf / Vermittlung
  beschreibung: string;
  standortPlz: string;
  standortOrt: string;
  imageEmoji: string; // leichtgewichtiger Bild-Platzhalter (kein Asset nötig)
  hit: HitPass;
  slaughter?: SlaughterData;
  auction?: Auction;
  createdAt: string;
  status: 'aktiv' | 'verkauft' | 'reserviert';
}

export type TransportStatus = 'angeboten' | 'gebucht';

export interface TransportOffer {
  id: string;
  fahrerId: string;
  fahrerName: string;
  zertifiziert: boolean; // tierschutz-zertifizierter Fahrer
  vonPlz: string;
  nachPlz: string;
  distanzKm: number;
  fahrzeitMin: number;
  preisEur: number;
  maxTiere: number;
  tierschutzKonform: boolean;
  status: TransportStatus;
}

export type EscrowStep =
  | 'angelegt'
  | 'kaeufer_zahlt_treuhand'
  | 'verkaeufer_versendet'
  | 'kaeufer_bestaetigt'
  | 'freigegeben'
  | 'storniert';

export const ESCROW_STEPS: EscrowStep[] = [
  'angelegt',
  'kaeufer_zahlt_treuhand',
  'verkaeufer_versendet',
  'kaeufer_bestaetigt',
  'freigegeben',
];

export const ESCROW_STEP_LABELS: Record<EscrowStep, string> = {
  angelegt: 'Bestellung angelegt',
  kaeufer_zahlt_treuhand: 'Käufer zahlt auf Treuhandkonto',
  verkaeufer_versendet: 'Verkäufer übergibt Tier(e)',
  kaeufer_bestaetigt: 'Käufer bestätigt Erhalt',
  freigegeben: 'Geld freigegeben – Handel abgeschlossen',
  storniert: 'Storniert',
};

export interface EscrowEvent {
  step: EscrowStep;
  at: string;
}

export interface EscrowTransaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  betrag: number;
  transportOfferId?: string;
  step: EscrowStep;
  verlauf: EscrowEvent[];
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  fromUserId: string;
  toUserId: string;
  listingId?: string;
  text: string;
  sentAt: string;
  read: boolean;
}

export interface AppState {
  version: number;
  users: User[];
  currentUserId: string | null;
  listings: Listing[];
  transportOffers: TransportOffer[];
  escrows: EscrowTransaction[];
  messages: Message[];
}
