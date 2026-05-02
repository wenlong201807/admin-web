import { http } from '@/utils/request';

export interface FriendRelation {
  id: number;
  userId: number;
  friendId: number;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  isFollowing: boolean;
  isFollower: boolean;
  isMutual: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    nickname: string;
    avatar: string;
    mobile: string;
  };
  friend?: {
    id: number;
    nickname: string;
    avatar: string;
    mobile: string;
  };
}

export interface BlacklistItem {
  id: number;
  userId: number;
  blockedUserId: number;
  reason?: string;
  createdAt: string;
  user?: {
    id: number;
    nickname: string;
    avatar: string;
  };
  blockedUser?: {
    id: number;
    nickname: string;
    avatar: string;
  };
}

export interface FriendQueryParams {
  page?: number;
  pageSize?: number;
  userId?: number;
  friendId?: number;
  status?: string;
  isMutual?: boolean;
  keyword?: string;
}

export interface FriendStatistics {
  totalRelations: number;
  mutualFriends: number;
  pendingRequests: number;
  blockedUsers: number;
  avgFriendsPerUser: number;
}

export const friendApi = {
  // 获取好友关系列表
  getRelations: (params: FriendQueryParams) => {
    return http.get<{ list: FriendRelation[]; total: number }>('/admin/friend/relations', params);
  },

  // 获取用户好友列表
  getUserFriends: (userId: number, params?: { page?: number; pageSize?: number }) => {
    return http.get<{ list: FriendRelation[]; total: number }>(`/admin/friend/user/${userId}/friends`, params);
  },

  // 获取用户粉丝列表
  getUserFollowers: (userId: number, params?: { page?: number; pageSize?: number }) => {
    return http.get<{ list: FriendRelation[]; total: number }>(`/admin/friend/user/${userId}/followers`, params);
  },

  // 获取用户关注列表
  getUserFollowing: (userId: number, params?: { page?: number; pageSize?: number }) => {
    return http.get<{ list: FriendRelation[]; total: number }>(`/admin/friend/user/${userId}/following`, params);
  },

  // 获取黑名单列表
  getBlacklist: (params: FriendQueryParams) => {
    return http.get<{ list: BlacklistItem[]; total: number }>('/admin/friend/blacklist', params);
  },

  // 获取用户黑名单
  getUserBlacklist: (userId: number) => {
    return http.get<BlacklistItem[]>(`/admin/friend/user/${userId}/blacklist`);
  },

  // 获取好友统计
  getStatistics: () => {
    return http.get<FriendStatistics>('/admin/friend/statistics');
  },

  // 解除好友关系（管理员操作）
  removeFriend: (userId: number, friendId: number) => {
    return http.delete(`/admin/friend/relations/${userId}/${friendId}`);
  },

  // 解除黑名单
  removeFromBlacklist: (userId: number, blockedUserId: number) => {
    return http.delete(`/admin/friend/blacklist/${userId}/${blockedUserId}`);
  },

  // 检测异常关系（批量关注等）
  detectAbnormal: (params?: { threshold?: number }) => {
    return http.get<{
      suspiciousUsers: {
        userId: number;
        followingCount: number;
        followersCount: number;
        mutualCount: number;
        user: {
          id: number;
          nickname: string;
          mobile: string;
        };
      }[];
    }>('/admin/friend/detect-abnormal', params);
  },
};
