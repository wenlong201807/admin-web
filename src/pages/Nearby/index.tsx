import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  DatePicker,
  Space,
  Tag,
  Avatar,
  message,
} from 'antd';
import {
  EyeOutlined,
  UserOutlined,
  RiseOutlined,
  EnvironmentOutlined,
  FireOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import {
  getNearbyStats,
  getPopularAreas,
  getUserActivity,
  NearbyStats,
  PopularArea,
  UserActivity,
} from '@/services/nearby';

const { RangePicker } = DatePicker;

const NearbyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState<NearbyStats | null>(null);
  const [popularAreas, setPopularAreas] = useState<PopularArea[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [activityDateRange, setActivityDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);

  // 加载统计数据
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await getNearbyStats({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      });
      setStats(data);
    } catch (error) {
      console.error('加载统计数据失败:', error);
      message.error('加载统计数据失败，请稍后重试');
    } finally {
      setStatsLoading(false);
    }
  }, [dateRange]);

  // 加载热门区域
  const loadPopularAreas = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPopularAreas(10);
      setPopularAreas(data.list);
    } catch (error) {
      console.error('加载热门区域失败:', error);
      message.error('加载热门区域失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载用户活跃度
  const loadUserActivity = useCallback(async () => {
    try {
      const days = activityDateRange[1].diff(activityDateRange[0], 'day');
      const { data } = await getUserActivity({
        limit: 20,
          });
      setUserActivity(data.list);
    } catch (error) {
      console.error('加载用户活跃度失败:', error);
      message.error('加载用户活跃度失败，请稍后重试');
    }
  }, [activityDateRange]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadPopularAreas();
  }, [loadPopularAreas]);

  useEffect(() => {
    loadUserActivity();
  }, [loadUserActivity]);

  const areaColumns = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Tag color={index < 3 ? 'red' : 'default'}>{index + 1}</Tag>
      ),
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 120,
      render: (city: string) => (
        <Space>
          <EnvironmentOutlined />
          {city}
        </Space>
      ),
    },
    {
      title: '区域',
      dataIndex: 'district',
      key: 'district',
      width: 120,
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
      render: (count: number) => (
        <Tag color="blue" icon={<UserOutlined />}>
          {count}
        </Tag>
      ),
    },
    {
      title: '访问次数',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      render: (count: number) => (
        <Tag color="green" icon={<EyeOutlined />}>
          {count}
        </Tag>
      ),
    },
  ];

  const activityColumns = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Tag color={index < 3 ? 'gold' : 'default'}>{index + 1}</Tag>
      ),
    },
    {
      title: '用户',
      key: 'user',
      width: 200,
      render: (_: any, record: UserActivity) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <span>{record.username}</span>
        </Space>
      ),
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 120,
      render: (city: string) => (
        <Tag icon={<EnvironmentOutlined />}>{city}</Tag>
      ),
    },
    {
      title: '查看次数',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      render: (count: number) => (
        <Tag color="blue" icon={<EyeOutlined />}>
          {count}
        </Tag>
      ),
    },
    {
      title: '打招呼次数',
      dataIndex: 'helloCount',
      key: 'helloCount',
      width: 120,
      render: (count: number) => (
        <Tag color="green" icon={<FireOutlined />}>
          {count}
        </Tag>
      ),
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActiveTime',
      key: 'lastActiveTime',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 日期筛选 */}
        <Card>
          <Space>
            <span>统计时间:</span>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                if (dates) {
                  setDateRange([dates[0]!, dates[1]!]);
                }
              }}
            />
          </Space>
        </Card>

        {/* 统计卡片 */}
        <Row gutter={16}>
          <Col span={6}>
            <Card loading={statsLoading}>
              <Statistic
                title="总访问量"
                value={stats?.totalViews || 0}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={statsLoading}>
              <Statistic
                title="独立用户"
                value={stats?.uniqueUsers || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={statsLoading}>
              <Statistic
                title="人均访问"
                value={stats?.avgViewsPerUser || 0}
                precision={2}
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={statsLoading}>
              <Statistic
                title="今日访问"
                value={stats?.todayViews || 0}
                prefix={<FireOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 热门区域 */}
        <Card title="热门区域 TOP 10">
          <Table
            columns={areaColumns}
            dataSource={popularAreas}
            rowKey={(record) => `${record.city}-${record.district}`}
            loading={loading}
            pagination={false}
          />
        </Card>

        {/* 用户活跃度排行 */}
        <Card
          title="用户活跃度排行 TOP 20"
          extra={
            <Space>
              <span>统计周期:</span>
              <DatePicker.RangePicker
                value={activityDateRange}
                onChange={(dates) => {
                  if (dates) {
                    setActivityDateRange([dates[0]!, dates[1]!]);
                  }
                }}
              />
            </Space>
          }
        >
          <Table
            columns={activityColumns}
            dataSource={userActivity}
            rowKey="userId"
            pagination={false}
          />
        </Card>
      </Space>
    </div>
  );
};

export default NearbyPage;
