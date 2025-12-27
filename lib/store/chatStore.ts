import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  encrypted: boolean;
  isOwn: boolean;
  timestamp: number;
}

export interface ChatState {
  clientId: string;
  roomId: string | null;
  publicKey: CryptoKey | null;
  privateKey: CryptoKey | null;
  peerPublicKey: CryptoKey | null;
  sessionKey: CryptoKey | null;
  messages: Message[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'secure' | 'error';
  roomExpiry: number | null;
  error: string | null;
  isSecureConnectionEstablished: boolean;

  setClientId: (id: string) => void;
  setRoomId: (id: string) => void;
  setKeys: (publicKey: CryptoKey, privateKey: CryptoKey) => void;
  setPeerPublicKey: (key: CryptoKey) => void;
  setSessionKey: (key: CryptoKey) => void;
  addMessage: (message: Message) => void;
  setConnectionStatus: (status: ChatState['connectionStatus']) => void;
  setRoomExpiry: (timestamp: number) => void;
  setError: (error: string | null) => void;
  setSecureConnectionEstablished: (established: boolean) => void;
  reset: () => void;
}

const initialState = {
  clientId: '',
  roomId: null,
  publicKey: null,
  privateKey: null,
  peerPublicKey: null,
  sessionKey: null,
  messages: [],
  connectionStatus: 'disconnected' as const,
  roomExpiry: null,
  error: null,
  isSecureConnectionEstablished: false,
};

export const useChatStore = create<ChatState>((set) => ({
  ...initialState,

  setClientId: (id: string) => set({ clientId: id }),
  setRoomId: (id: string) => set({ roomId: id }),
  setKeys: (publicKey: CryptoKey, privateKey: CryptoKey) =>
    set({ publicKey, privateKey }),
  setPeerPublicKey: (key: CryptoKey) => set({ peerPublicKey: key }),
  setSessionKey: (key: CryptoKey) => set({ sessionKey: key }),

  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setConnectionStatus: (status: ChatState['connectionStatus']) =>
    set({ connectionStatus: status }),

  setRoomExpiry: (timestamp: number) => set({ roomExpiry: timestamp }),
  setError: (error: string | null) => set({ error }),
  setSecureConnectionEstablished: (established: boolean) =>
    set({ isSecureConnectionEstablished: established }),

  reset: () => set(initialState),
}));
