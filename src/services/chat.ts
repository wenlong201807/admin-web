import { http } from '@/utils/request';
import { BaseResponse } from '@/types/api';

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  receiverId: number;
  content: string;
  type: 'text' | 'image' | 'voice' | 'video';
  status: 'sent' | 'delivered' | 'read' | 'deleted';
  isRecalled: boolean;
  createdAt: string;
  sender?: {
    id: number;
    nickname: string;
    avatar: string;
  };
  receiver?: {
    id: number;
    nickname: string;
    avatar: string;
  };
}

export interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  lastMessageId?: number;
  lastMessageAt?: string;
  user1UnreadCount: number;
  user2UnreadCount: number;
  createdAt: string;
  updatedAt: string;
  user1?: {
    id: number;
    nickname: string;
    avatar: string;
  };
  user2?: {
    id: number;
    nickname: string;
    avatar: string;
  };
  lastMessage?: ChatMessage;
}

export interface ChatQueryParams {
  page?: number;
  pageSize?: number;
  userId?: number;
  conversationId?: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

export interface ChatStatistics {
  totalConversations: number;
  totalMessages: number;
  todayMessages: number;
  activeUsers: number;
}

export const chatApi = {
  // 获取会话列表
  getConversations: (params: ChatQueryParams) => {
    return http.get<BaseResponse<{ list: Conversation[]; total: number }>>('/admin/chat/conversations', params);
  },

  // 获取会话详情
  getConversation: (conversationId: number) => {
    return http.get<BaseResponse<Conversation>>(`/admin/chat/conversations/${conversationId}`);
  },

  // 获取消息列表
  getMessages: (params: ChatQueryParams) => {
    return http.get<BaseResponse<{ list: ChatMessage[]; total: number }>>('/admin/chat/messages', params);
  },

  // 获取用户聊天记录
  getUserMessages: (userId: number, params?: { page?: number; pageSize?: number }) => {
    return http.get<BaseResponse<{ list: ChatMessage[]; total: number }>>(`/admin/chat/user/${userId}/messages`, params);
  },

  // 获取聊天统计
  getStatistics: (params?: { startDate?: string; endDate?: string }) => {
    return http.get<BaseResponse<ChatStatistics>>('/admin/chat/statistics', params);
  },

  // 删除消息（管理员操作）
  deleteMessage: (messageId: number) => {
    return http.delete(`/admin/chat/messages/${messageId}`);
  },

  // 批量删除消息
  batchDeleteMessages: (messageIds: number[]) => {
    return http.post('/admin/chat/messages/batch-delete', { messageIds });
  },
};
