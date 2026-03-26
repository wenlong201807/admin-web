export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminUser {
  id: number;
  username: string;
  role: string;
}

export interface User {
  id: number;
  mobile: string;
  nickname: string;
  avatarUrl: string;
  gender: number;
  points: number;
  inviteCode: string;
  status: number;
  isVerified: boolean;
  violationCount: number;
  createdAt: string;
}

export interface Certification {
  id: number;
  userId: number;
  type: string;
  imageUrl: string;
  description: string;
  status: number;
  rejectReason: string | null;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
    mobile: string;
    avatarUrl: string;
  };
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  status: number;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
    avatarUrl: string;
  };
}

export interface Report {
  id: number;
  postId: number;
  reporterId: number;
  reason: number;
  description: string;
  status: number;
  createdAt: string;
  post: {
    id: number;
    content: string;
    user: {
      id: number;
      nickname: string;
    };
  };
  reporter: {
    id: number;
    nickname: string;
  };
}

export interface SystemConfig {
  'points.register': number;
  'points.sign': number;
  'points.sign.continuous': number;
  'points.publish': number;
  'points.comment': number;
  'points.like': number;
  'points.invite': number;
  'points.unlock_chat': number;
  'max_friend.base': number;
  'max_friend.per_points': number;
  'violation.max_count': number;
}

export interface StatisticsData {
  user: {
    total: number;
    newToday: number;
    activeToday: number;
  };
  content: {
    posts: number;
    comments: number;
  };
  points: {
    totalIssued: number;
    totalConsumed: number;
  };
}

export interface PointsConfigItem {
  id: number;
  key: string;
  value: number;
  description: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CertificationTypeItem {
  id: number;
  code: string;
  name: string;
  icon: string;
  description: string;
  requiredFields: string[];
  isEnabled: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
