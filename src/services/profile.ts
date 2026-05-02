import { http } from '@/utils/request';

export interface UserProfile {
  id: number;
  userId: number;
  realName?: string;
  birthDate?: string;
  hometown?: string;
  residence?: string;
  height?: number;
  weight?: number;
  occupation?: string;
  incomeRange?: string;
  education?: string;
  bio?: string;
  showLocation?: boolean;
  latitude?: number;
  longitude?: number;
  // 外貌体征
  bodyType?: string;
  zodiacSign?: string;
  chineseZodiac?: string;
  faceShape?: string;
  hasGlasses?: boolean;
  hasTattoo?: boolean;
  // 教育职业
  graduateSchool?: string;
  major?: string;
  industry?: string;
  company?: string;
  workYears?: number;
  // 家庭背景
  nativePlace?: string;
  familyMembers?: number;
  familyRanking?: string;
  parentsOccupation?: string;
  isOnlyChild?: boolean;
  familyEconomic?: string;
  // 婚恋状况
  maritalStatus?: string;
  hasChildren?: boolean;
  childrenCount?: number;
  childrenInfo?: string;
  marriagePlan?: string;
  // 资产状况
  housingStatus?: string;
  carStatus?: string;
  housingLocation?: string;
  carBrand?: string;
  // 生活方式
  smokingStatus?: string;
  drinkingStatus?: string;
  sleepSchedule?: string;
  exerciseFrequency?: string;
  dietPreference?: string;
  hasPets?: boolean;
  petType?: string;
  cookingSkill?: string;
  // 个性展示
  personalityTags?: string[];
  selfIntroduction?: string;
  innerMonologue?: string;
  voiceIntroUrl?: string;
  // 信息完整度
  profileCompleteness?: number;
  lastUpdateAt?: string;
  updateRemindAt?: string;
}

export interface UserInterest {
  id: number;
  userId: number;
  category: string;
  name: string;
  level: number;
  sortOrder: number;
  createdAt: string;
}

export interface UserPhoto {
  id: number;
  userId: number;
  photoUrl: string;
  photoPath: string;
  category: string;
  isAvatar: boolean;
  isCertified: boolean;
  isPublic: boolean;
  sortOrder: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserMatePreference {
  id: number;
  userId: number;
  ageMin?: number;
  ageMax?: number;
  heightMin?: number;
  heightMax?: number;
  educationRequirement?: string;
  incomeRequirement?: string;
  locationRequirement?: string;
  acceptLongDistance?: boolean;
  maritalStatusRequirement?: string;
  acceptChildren?: boolean;
  housingRequirement?: string;
  carRequirement?: string;
  smokingRequirement?: string;
  drinkingRequirement?: string;
  otherRequirements?: string;
  idealTypeDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export const profileApi = {
  // 获取用户资料
  getProfile: (userId: number) => {
    return http.get<UserProfile>(`/profile/${userId}`);
  },

  // 获取用户兴趣
  getInterests: (userId: number) => {
    return http.get<UserInterest[]>(`/admin/profile/${userId}/interests`);
  },

  // 获取用户照片
  getPhotos: (userId: number) => {
    return http.get<UserPhoto[]>(`/admin/profile/${userId}/photos`);
  },

  // 获取择偶偏好
  getMatePreferences: (userId: number) => {
    return http.get<UserMatePreference>(`/admin/profile/${userId}/mate-preferences`);
  },

  // 获取完整度详情
  getCompletenessDetails: (userId: number) => {
    return http.get<{
      score: number;
      level: string;
      missingFields: string[];
    }>(`/admin/profile/${userId}/completeness`);
  },
};
