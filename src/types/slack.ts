export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  email?: string;
  avatar?: string;
  status?: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  members: string[];
  topic?: string;
  purpose?: string;
}

export interface SlackMessage {
  id: string;
  text: string;
  user: string;
  timestamp: string;
  channel: string;
  thread_ts?: string;
  reactions?: SlackReaction[];
  isPinned?: boolean;
}

export interface SlackReaction {
  name: string;
  users: string[];
  count: number;
}

export interface FetchConfig {
  type: 'channels' | 'users' | 'messages' | 'threads' | 'pins' | 'reactions';
  autoFetch: boolean;
  interval?: number;
  lastFetch?: string;
}