import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Space, Tag, message } from 'antd';
import {
  EnvironmentOutlined,
  UserOutlined,
  GlobalOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import {
  getLocationStats,
  getLocationUsers,
  LocationStats,
  UserLocation,
} from '@/services/location';

const { RangePicker } = DatePicker;

const LocationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState<LocationStats | null>(null);
  const [users, setUsers] = useState<UserLocation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);

  // 加载统计数据
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await getLocationStats({
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

  // 加载用户位置列表
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getLocationUsers({
        page,
        pageSize,
      });
      setUsers(data.list);
      setTotal(data.total);
    } catch (error) {
      console.error('加载用户位置失败:', error);
      message.error('加载用户位置失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150,
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 120,
      render: (city: string) => (
        <Tag icon={<EnvironmentOutlined />} color="blue">
          {city}
        </Tag>
      ),
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      key: 'longitude',
      width: 120,
      render: (val: number) => val?.toFixed(6),
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      key: 'latitude',
      width: 120,
      render: (val: number) => val?.toFixed(6),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
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
                title="总用户数"
                value={stats?.totalUsers || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={statsLoading}>
              <Statistic
                title="活跃用户"
                value={stats?.activeUsers || 0}
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={statsLoading}>
              <Statistic
                title="覆盖城市"
                value={stats?.citiesCount || 0}
                prefix={<GlobalOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={statsLoading}>
              <Statistic
                title="今日更新"
                value={stats?.todayUpdates || 0}
                prefix={<EnvironmentOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 用户位置列表 */}
        <Card title="用户位置列表">
          <Table
            columns={columns}
            dataSource={users}
            rowKey="userId"
            loading={loading}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        </Card>
      </Space>
    </div>
  );
};

export default LocationPage;
