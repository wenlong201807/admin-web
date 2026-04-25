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

export interface AppConfig {
  apiUrl: string;
  appTitle: string;
  appEnv: 'development' | 'staging' | 'production';
  appPort: number;
  appBaseUrl: string;
  appLogo: string;
  appFavicon: string;
  uploadMaxSize: number;
  uploadAllowedTypes: string[];
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
}

export enum NPSCategory {
  PROMOTER = 'promoter',
  PASSIVE = 'passive',
  DETRACTOR = 'detractor',
}

export enum NPSTriggerType {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export enum NPSTriggerScene {
  AFTER_REGISTER = 'after_register',
  AFTER_FIRST_POST = 'after_first_post',
  AFTER_ADD_FRIEND = 'after_add_friend',
  AFTER_ACTIVE_WEEK = 'after_active_week',
  PERIODIC = 'periodic',
  MANUAL_TRIGGER = 'manual_trigger',
}

export enum NPSStatus {
  PENDING = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  IGNORED = 3,
}

export enum NPSPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  URGENT = 3,
}

export interface NPSFeedback {
  id: number;
  userId: number;
  score: number;
  category: NPSCategory;
  reason?: string;
  suggestion?: string;
  tags?: string[];
  triggerType: NPSTriggerType;
  triggerScene?: NPSTriggerScene;
  userSnapshot?: {
    registerDays: number;
    postCount: number;
    friendCount: number;
    chatCount: number;
    points: number;
    activityLevel: string;
  };
  status: NPSStatus;
  priority: NPSPriority;
  assignedTo?: number;
  handleResult?: string;
  handleTime?: string;
  isFollowedUp: boolean;
  followUpTime?: string;
  followUpResult?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    nickname: string;
    mobile: string;
    avatarUrl: string;
  };
  assignee?: {
    id: number;
    nickname: string;
  };
}

export interface NPSQueryParams extends PaginationParams {
  scoreRange?: string;
  status?: number;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

export interface NPSDashboard {
  overview: {
    totalFeedback: number;
    npsScore: number;
    promoterRate: number;
    detractorRate: number;
  };
  categoryDistribution: {
    promoter: number;
    passive: number;
    detractor: number;
  };
  statusDistribution: {
    pending: number;
    processing: number;
    completed: number;
    ignored: number;
  };
  recentFeedback: NPSFeedback[];
}

export interface NPSStatistics {
  date: string;
  npsScore: number;
  totalCount: number;
  promoterCount: number;
  passiveCount: number;
  detractorCount: number;
}
