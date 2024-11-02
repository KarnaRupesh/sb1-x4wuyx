import { create } from 'zustand';
import { SlackUser, SlackChannel, SlackMessage, FetchConfig } from '../types/slack';
import { SlackService } from '../services/SlackService';

interface SlackState {
  users: SlackUser[];
  channels: SlackChannel[];
  messages: Map<string, SlackMessage[]>;
  fetchConfigs: FetchConfig[];
  apiKey: string | null;
  loading: boolean;
  error: string | null;
  setApiKey: (key: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchChannels: () => Promise<void>;
  fetchMessages: (channelId: string) => Promise<void>;
  updateFetchConfig: (index: number, config: Partial<FetchConfig>) => void;
}

export const useSlackStore = create<SlackState>((set, get) => ({
  users: [],
  channels: [],
  messages: new Map(),
  fetchConfigs: [
    { type: 'channels', autoFetch: false, interval: 30 },
    { type: 'users', autoFetch: false, interval: 30 },
    { type: 'messages', autoFetch: false, interval: 15 },
    { type: 'threads', autoFetch: false, interval: 15 },
    { type: 'pins', autoFetch: false, interval: 60 },
    { type: 'reactions', autoFetch: false, interval: 30 }
  ],
  apiKey: null,
  loading: false,
  error: null,

  setApiKey: async (key: string) => {
    try {
      set({ loading: true, error: null });
      const service = SlackService.getInstance();
      await service.saveApiKey(key);
      set({ apiKey: key });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });
      const service = SlackService.getInstance();
      const users = await service.fetchUsers();
      set({ users });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchChannels: async () => {
    try {
      set({ loading: true, error: null });
      const service = SlackService.getInstance();
      const channels = await service.fetchChannels();
      set({ channels });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchMessages: async (channelId: string) => {
    try {
      set({ loading: true, error: null });
      const service = SlackService.getInstance();
      const messages = await service.fetchMessages(channelId);
      const currentMessages = get().messages;
      currentMessages.set(channelId, messages);
      set({ messages: new Map(currentMessages) });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateFetchConfig: (index: number, config: Partial<FetchConfig>) => {
    const configs = [...get().fetchConfigs];
    configs[index] = { ...configs[index], ...config };
    set({ fetchConfigs: configs });
  }
}));