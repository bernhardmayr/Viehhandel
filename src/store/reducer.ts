import type {
  AppState,
  Bid,
  EscrowStep,
  EscrowTransaction,
  Listing,
  Message,
  TransportOffer,
  User,
} from '../types/models';
import { ESCROW_STEPS } from '../types/models';

export type Action =
  | { type: 'LOGIN'; userId: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER'; user: User }
  | { type: 'ADD_LISTING'; listing: Listing }
  | { type: 'ADD_LISTINGS_BULK'; listings: Listing[] }
  | { type: 'SET_LISTING_STATUS'; listingId: string; status: Listing['status'] }
  | { type: 'PLACE_BID'; listingId: string; bid: Bid }
  | { type: 'PLACE_BOT_BID'; listingId: string; botName: string }
  | { type: 'END_AUCTION'; listingId: string }
  | { type: 'HIT_DEREGISTER'; listingId: string }
  | { type: 'CREATE_ESCROW'; escrow: EscrowTransaction }
  | { type: 'ADVANCE_ESCROW'; escrowId: string }
  | { type: 'CANCEL_ESCROW'; escrowId: string }
  | { type: 'BOOK_TRANSPORT'; transportId: string; escrowId: string }
  | { type: 'ADD_TRANSPORT_OFFER'; offer: TransportOffer }
  | { type: 'SEND_MESSAGE'; message: Message }
  | { type: 'RESET'; state: AppState };

function nextEscrowStep(current: EscrowStep): EscrowStep {
  const idx = ESCROW_STEPS.indexOf(current);
  if (idx === -1 || idx >= ESCROW_STEPS.length - 1) return current;
  return ESCROW_STEPS[idx + 1];
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUserId: action.userId };

    case 'LOGOUT':
      return { ...state, currentUserId: null };

    case 'REGISTER':
      return {
        ...state,
        users: [...state.users, action.user],
        currentUserId: action.user.id,
      };

    case 'ADD_LISTING':
      return { ...state, listings: [action.listing, ...state.listings] };

    case 'ADD_LISTINGS_BULK':
      return { ...state, listings: [...action.listings, ...state.listings] };

    case 'SET_LISTING_STATUS':
      return {
        ...state,
        listings: state.listings.map((l) =>
          l.id === action.listingId ? { ...l, status: action.status } : l,
        ),
      };

    case 'PLACE_BID':
      return {
        ...state,
        listings: state.listings.map((l) => {
          if (l.id !== action.listingId || !l.auction) return l;
          return {
            ...l,
            auction: {
              ...l.auction,
              currentPreis: action.bid.amount,
              bids: [...l.auction.bids, action.bid],
            },
          };
        }),
      };

    case 'PLACE_BOT_BID':
      return {
        ...state,
        listings: state.listings.map((l) => {
          if (l.id !== action.listingId || !l.auction || l.auction.status !== 'live') return l;
          const amount = l.auction.currentPreis + l.auction.mindestSchritt;
          const bid: Bid = {
            id: `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
            userId: 'bot',
            userName: action.botName,
            amount,
            timestamp: new Date().toISOString(),
            isBot: true,
          };
          return {
            ...l,
            auction: { ...l.auction, currentPreis: amount, bids: [...l.auction.bids, bid] },
          };
        }),
      };

    case 'END_AUCTION':
      return {
        ...state,
        listings: state.listings.map((l) => {
          if (l.id !== action.listingId || !l.auction) return l;
          const highest = l.auction.bids[l.auction.bids.length - 1];
          return {
            ...l,
            auction: {
              ...l.auction,
              status: 'beendet',
              gewinnerUserId: highest?.userId,
            },
          };
        }),
      };

    case 'HIT_DEREGISTER':
      return {
        ...state,
        listings: state.listings.map((l) =>
          l.id === action.listingId
            ? { ...l, hit: { ...l.hit, abmeldungSimuliert: true } }
            : l,
        ),
      };

    case 'CREATE_ESCROW':
      return { ...state, escrows: [action.escrow, ...state.escrows] };

    case 'ADVANCE_ESCROW':
      return {
        ...state,
        escrows: state.escrows.map((e) => {
          if (e.id !== action.escrowId) return e;
          const step = nextEscrowStep(e.step);
          if (step === e.step) return e;
          return {
            ...e,
            step,
            verlauf: [...e.verlauf, { step, at: new Date().toISOString() }],
          };
        }),
      };

    case 'CANCEL_ESCROW':
      return {
        ...state,
        escrows: state.escrows.map((e) =>
          e.id === action.escrowId
            ? {
                ...e,
                step: 'storniert',
                verlauf: [...e.verlauf, { step: 'storniert', at: new Date().toISOString() }],
              }
            : e,
        ),
      };

    case 'BOOK_TRANSPORT':
      return {
        ...state,
        transportOffers: state.transportOffers.map((t) =>
          t.id === action.transportId ? { ...t, status: 'gebucht' } : t,
        ),
        escrows: state.escrows.map((e) =>
          e.id === action.escrowId ? { ...e, transportOfferId: action.transportId } : e,
        ),
      };

    case 'ADD_TRANSPORT_OFFER':
      return { ...state, transportOffers: [action.offer, ...state.transportOffers] };

    case 'SEND_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };

    case 'RESET':
      return action.state;

    default:
      return state;
  }
}
