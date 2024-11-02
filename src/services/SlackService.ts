import { SecureStorage } from '@nativescript/secure-storage';
import { Observable } from '@nativescript/core';
import { SlackUser, SlackChannel, SlackMessage } from '../types/slack';

export class SlackService extends Observable {
    private static instance: SlackService;
    private apiKey: string | null = null;
    private secureStorage: SecureStorage;
    private users: SlackUser[] = [];
    private channels: SlackChannel[] = [];
    private messages: Map<string, SlackMessage[]> = new Map();

    private constructor() {
        super();
        this.secureStorage = new SecureStorage();
        this.initializeStorage();
    }

    private async initializeStorage() {
        try {
            const key = await this.secureStorage.getSync({
                key: 'slack_api_key'
            });
            this.apiKey = key || null;
        } catch (error) {
            console.error('Error initializing storage:', error);
            this.apiKey = null;
        }
    }

    static getInstance(): SlackService {
        if (!SlackService.instance) {
            SlackService.instance = new SlackService();
        }
        return SlackService.instance;
    }

    async getApiKey(): Promise<string | null> {
        return this.apiKey;
    }

    async saveApiKey(key: string): Promise<void> {
        try {
            await this.secureStorage.setSync({
                key: 'slack_api_key',
                value: key
            });
            this.apiKey = key;
        } catch (error) {
            console.error('Error saving API key:', error);
            throw new Error('Failed to save API key');
        }
    }

    async fetchUsers(): Promise<SlackUser[]> {
        if (!this.apiKey) throw new Error('API key not set');
        
        try {
            const response = await fetch('https://slack.com/api/users.list', {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            const data = await response.json();
            
            if (!data.ok) throw new Error(data.error || 'Failed to fetch users');
            
            this.users = data.members.map(member => ({
                id: member.id,
                name: member.name,
                real_name: member.real_name,
                email: member.profile?.email,
                avatar: member.profile?.image_72,
                status: member.profile?.status_text
            }));

            this.notify({ eventName: 'usersUpdated', data: this.users });
            return this.users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async fetchChannels(): Promise<SlackChannel[]> {
        if (!this.apiKey) throw new Error('API key not set');
        
        try {
            const response = await fetch('https://slack.com/api/conversations.list', {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            const data = await response.json();
            
            if (!data.ok) throw new Error(data.error || 'Failed to fetch channels');
            
            this.channels = data.channels.map(channel => ({
                id: channel.id,
                name: channel.name,
                is_private: channel.is_private,
                members: [],
                topic: channel.topic?.value,
                purpose: channel.purpose?.value
            }));

            this.notify({ eventName: 'channelsUpdated', data: this.channels });
            return this.channels;
        } catch (error) {
            console.error('Error fetching channels:', error);
            throw error;
        }
    }

    async fetchMessages(channelId: string): Promise<SlackMessage[]> {
        if (!this.apiKey) throw new Error('API key not set');
        
        try {
            const response = await fetch(`https://slack.com/api/conversations.history?channel=${channelId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            const data = await response.json();
            
            if (!data.ok) throw new Error(data.error || 'Failed to fetch messages');
            
            const messages = data.messages.map(msg => ({
                id: msg.ts,
                text: msg.text,
                user: msg.user,
                timestamp: msg.ts,
                channel: channelId,
                thread_ts: msg.thread_ts,
                reactions: msg.reactions,
                isPinned: msg.isPinned
            }));

            this.messages.set(channelId, messages);
            this.notify({ eventName: 'messagesUpdated', data: { channelId, messages } });
            return messages;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }
}