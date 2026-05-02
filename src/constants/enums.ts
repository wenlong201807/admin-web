/**
 * 枚举常量定义
 */

// 积分类型
export enum PointsType {
  SIGN_IN = 'sign_in',
  POST = 'post',
  COMMENT = 'comment',
  LIKE = 'like',
  CERTIFICATION = 'certification',
  INVITE = 'invite',
  CONSUME = 'consume',
  ADMIN_ADJUST = 'admin_adjust',
}

// 积分类型显示文本
export const PointsTypeText: Record<PointsType, string> = {
  [PointsType.SIGN_IN]: '签到',
  [PointsType.POST]: '发帖',
  [PointsType.COMMENT]: '评论',
  [PointsType.LIKE]: '点赞',
  [PointsType.CERTIFICATION]: '认证',
  [PointsType.INVITE]: '邀请',
  [PointsType.CONSUME]: '消费',
  [PointsType.ADMIN_ADJUST]: '管理员调整',
};

// 积分类型颜色
export const PointsTypeColor: Record<PointsType, string> = {
  [PointsType.SIGN_IN]: 'blue',
  [PointsType.POST]: 'green',
  [PointsType.COMMENT]: 'cyan',
  [PointsType.LIKE]: 'orange',
  [PointsType.CERTIFICATION]: 'purple',
  [PointsType.INVITE]: 'magenta',
  [PointsType.CONSUME]: 'red',
  [PointsType.ADMIN_ADJUST]: 'gold',
};

// 消息类型
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VOICE = 'voice',
  VIDEO = 'video',
}

// 消息类型显示文本
export const MessageTypeText: Record<MessageType, string> = {
  [MessageType.TEXT]: '文本',
  [MessageType.IMAGE]: '图片',
  [MessageType.VOICE]: '语音',
  [MessageType.VIDEO]: '视频',
};

// 消息类型颜色
export const MessageTypeColor: Record<MessageType, string> = {
  [MessageType.TEXT]: 'blue',
  [MessageType.IMAGE]: 'green',
  [MessageType.VOICE]: 'orange',
  [MessageType.VIDEO]: 'purple',
};

// 消息状态
export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  DELETED = 'deleted',
}

// 消息状态显示文本
export const MessageStatusText: Record<MessageStatus, string> = {
  [MessageStatus.SENT]: '已发送',
  [MessageStatus.DELIVERED]: '已送达',
  [MessageStatus.READ]: '已读',
  [MessageStatus.DELETED]: '已删除',
};

// 消息状态颜色
export const MessageStatusColor: Record<MessageStatus, string> = {
  [MessageStatus.SENT]: 'blue',
  [MessageStatus.DELIVERED]: 'green',
  [MessageStatus.READ]: 'cyan',
  [MessageStatus.DELETED]: 'red',
};

// 好友关系状态
export enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
}

// 好友关系状态显示文本
export const FriendStatusText: Record<FriendStatus, string> = {
  [FriendStatus.PENDING]: '待确认',
  [FriendStatus.ACCEPTED]: '已接受',
  [FriendStatus.REJECTED]: '已拒绝',
  [FriendStatus.BLOCKED]: '已拉黑',
};

// 好友关系状态颜色
export const FriendStatusColor: Record<FriendStatus, string> = {
  [FriendStatus.PENDING]: 'orange',
  [FriendStatus.ACCEPTED]: 'green',
  [FriendStatus.REJECTED]: 'red',
  [FriendStatus.BLOCKED]: 'default',
};
