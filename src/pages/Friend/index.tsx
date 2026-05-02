import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  message,
  Modal,
  Tag,
  Avatar,
  Statistic,
  Row,
  Col,
  Tabs,
} from 'antd';
import { ReloadOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { friendApi, FriendRelation, BlacklistItem, FriendQueryParams, FriendStatistics } from '@/services/friend';
import { FriendStatus, FriendStatusText, FriendStatusColor } from '@/constants/enums';
import { formatDateTime } from '@/utils/format';

// 常量定义
const ABNORMAL_FOLLOW_THRESHOLD = 100; // 异常关注数阈值

// 异常用户类型定义
interface AbnormalUser {
  userId: number;
  followingCount: number;
  followersCount: number;
  mutualCount: number;
  user: {
    id: number;
    nickname: string;
    mobile: string;
  };
}

const FriendManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'relations' | 'blacklist' | 'abnormal'>('relations');
  const [relations, setRelations] = useState<FriendRelation[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>([]);
  const [abnormalUsers, setAbnormalUsers] = useState<AbnormalUser[]>([]);
  const [total, setTotal] = useState(0);
  const [statistics, setStatistics] = useState<FriendStatistics | null>(null);

  const [queryParams, setQueryParams] = useState<FriendQueryParams>({
    page: 1,
    pageSize: 20,
  });

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (activeTab === 'relations') {
        setLoading(true);
        try {
          const res = await friendApi.getRelations(queryParams);
          if (!cancelled) {
            setRelations(res.data.list);
            setTotal(res.data.total);
          }
        } catch (error: any) {
          if (!cancelled) {
            message.error(error.message || '加载失败');
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      } else if (activeTab === 'blacklist') {
        setLoading(true);
        try {
          const res = await friendApi.getBlacklist(queryParams);
          if (!cancelled) {
            setBlacklist(res.data.list);
            setTotal(res.data.total);
          }
        } catch (error: any) {
          if (!cancelled) {
            message.error(error.message || '加载失败');
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      } else {
        setLoading(true);
        try {
          const res = await friendApi.detectAbnormal({ threshold: ABNORMAL_FOLLOW_THRESHOLD });
          if (!cancelled) {
            setAbnormalUsers(res.data.suspiciousUsers);
          }
        } catch (error: any) {
          if (!cancelled) {
            message.error(error.message || '加载失败');
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      }

      // 加载统计数据
      try {
        const res = await friendApi.getStatistics();
        if (!cancelled) {
          setStatistics(res.data);
        }
      } catch (error: any) {
        if (!cancelled) {
          message.error('加载统计数据失败');
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [activeTab, queryParams]);

  // 重新加载数据
  const reloadData = () => {
    setQueryParams({ ...queryParams });
  };

  const handleRemoveFriend = async (userId: number, friendId: number) => {
    Modal.confirm({
      title: '确认解除',
      content: '确定要解除这个好友关系吗？',
      onOk: async () => {
        try {
          await friendApi.removeFriend(userId, friendId);
          message.success('解除成功');
          reloadData();
        } catch (error: any) {
          message.error(error.message || '解除失败');
        }
      },
    });
  };

  const handleRemoveFromBlacklist = async (userId: number, blockedUserId: number) => {
    Modal.confirm({
      title: '确认解除',
      content: '确定要将此用户移出黑名单吗？',
      onOk: async () => {
        try {
          await friendApi.removeFromBlacklist(userId, blockedUserId);
          message.success('解除成功');
          reloadData();
        } catch (error: any) {
          message.error(error.message || '解除失败');
        }
      },
    });
  };

  const relationColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: 'user',
      width: 200,
      render: (user: any) => (
        <Space>
          <Avatar src={user?.avatar} />
          <div>
            <div>{user?.nickname || '-'}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              ID: {user?.id} | {user?.mobile}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '好友',
      dataIndex: 'friend',
      width: 200,
      render: (friend: any) => (
        <Space>
          <Avatar src={friend?.avatar} />
          <div>
            <div>{friend?.nickname || '-'}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              ID: {friend?.id} | {friend?.mobile}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '关系状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const text = FriendStatusText[status as FriendStatus] || status;
        const color = FriendStatusColor[status as FriendStatus] || 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '关系类型',
      width: 150,
      render: (record: FriendRelation) => (
        <Space>
          {record.isMutual && <Tag color="blue">互相关注</Tag>}
          {record.isFollowing && !record.isMutual && <Tag color="green">关注</Tag>}
          {record.isFollower && !record.isMutual && <Tag color="cyan">粉丝</Tag>}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '操作',
      width: 100,
      render: (record: FriendRelation) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveFriend(record.userId, record.friendId)}
        >
          解除
        </Button>
      ),
    },
  ];

  const blacklistColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: 'user',
      width: 200,
      render: (user: any) => (
        <Space>
          <Avatar src={user?.avatar} />
          <div>
            <div>{user?.nickname || '-'}</div>
            <div style={{ fontSize: 12, color: '#999' }}>ID: {user?.id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '被拉黑用户',
      dataIndex: 'blockedUser',
      width: 200,
      render: (user: any) => (
        <Space>
          <Avatar src={user?.avatar} />
          <div>
            <div>{user?.nickname || '-'}</div>
            <div style={{ fontSize: 12, color: '#999' }}>ID: {user?.id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '拉黑原因',
      dataIndex: 'reason',
      ellipsis: true,
    },
    {
      title: '拉黑时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '操作',
      width: 100,
      render: (record: BlacklistItem) => (
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveFromBlacklist(record.userId, record.blockedUserId)}
        >
          解除
        </Button>
      ),
    },
  ];

  const abnormalColumns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 100,
    },
    {
      title: '用户信息',
      dataIndex: 'user',
      width: 200,
      render: (user: any) => (
        <div>
          <div>{user?.nickname || '-'}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{user?.mobile}</div>
        </div>
      ),
    },
    {
      title: '关注数',
      dataIndex: 'followingCount',
      width: 100,
      render: (count: number) => (
        <Tag color={count > 100 ? 'red' : 'blue'}>{count}</Tag>
      ),
    },
    {
      title: '粉丝数',
      dataIndex: 'followersCount',
      width: 100,
      render: (count: number) => (
        <Tag color="green">{count}</Tag>
      ),
    },
    {
      title: '互关数',
      dataIndex: 'mutualCount',
      width: 100,
      render: (count: number) => (
        <Tag color="cyan">{count}</Tag>
      ),
    },
    {
      title: '异常指标',
      width: 150,
      render: (record: any) => {
        const ratio = record.followersCount > 0
          ? (record.followingCount / record.followersCount).toFixed(2)
          : 'N/A';
        return (
          <Space>
            <Tag color="orange">关注/粉丝: {ratio}</Tag>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      {/* 统计卡片 */}
      {statistics && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic title="总关系数" value={statistics.totalRelations} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="互关好友" value={statistics.mutualFriends} />
       </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="待处理请求"
                value={statistics.pendingRequests}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="黑名单用户"
                value={statistics.blockedUsers}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 查询表单 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="用户ID"
            style={{ width: 120 }}
            value={queryParams.userId}
            onChange={(e) => {
              const val = e.target.value.trim();
              setQueryParams({
                ...queryParams,
                userId: val && !isNaN(Number(val)) ? Number(val) : undefined,
                page: 1
              });
            }}
          />
          <Input
            placeholder="好友ID"
            style={{ width: 120 }}
            value={queryParams.friendId}
            onChange={(e) => {
              const val = e.target.value.trim();
              setQueryParams({
                ...queryParams,
                friendId: val && !isNaN(Number(val)) ? Number(val) : undefined,
                page: 1
              });
            }}
          />
          <Input
            placeholder="关键词"
            style={{ width: 200 }}
            value={queryParams.keyword}
            onChange={(e) => setQueryParams({ ...queryParams, keyword: e.target.value })}
          />
          <Button type="primary" onClick={reloadData}>
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setQueryParams({ page: 1, pageSize: 20 });
            }}
          >
            重置
          </Button>
        </Space>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
          items={[
            {
              key: 'relations',
              label: '好友关系',
              children: (
                <Table
                  loading={loading}
                  dataSource={relations}
                  columns={relationColumns}
                  rowKey="id"
                  pagination={{
                    current: queryParams.page,
                    pageSize: queryParams.pageSize,
                    total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: (page, pageSize) => {
                      setQueryParams({ ...queryParams, page, pageSize });
                    },
                  }}
                />
              ),
            },
            {
              key: 'blacklist',
              label: '黑名单',
              children: (
                <Table
                  loading={loading}
                  dataSource={blacklist}
                  columns={blacklistColumns}
                  rowKey="id"
                  pagination={{
                    current: queryParams.page,
                    pageSize: queryParams.pageSize,
                    total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: (page, pageSize) => {
                      setQueryParams({ ...queryParams, page, pageSize });
                    },
                  }}
                />
              ),
            },
            {
              key: 'abnormal',
              label: (
                <span>
                  <WarningOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
                  异常检测
                </span>
              ),
              children: (
                <Table
                  loading={loading}
                  dataSource={abnormalUsers}
                  columns={abnormalColumns}
                  rowKey="userId"
                  pagination={false}
                />
              ),
            },
        ]}
        />
      </Card>
    </div>
  );
};

export default FriendManagement;
