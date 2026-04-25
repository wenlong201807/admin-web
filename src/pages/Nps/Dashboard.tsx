import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Select, DatePicker } from 'antd';
import {
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { getDashboard, getStatistics } from '@/services/nps';
import { NPSFeedback, NPSStatistics, NPSCategory, NPSStatus } from '@/types/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const NPSDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);
  const [statistics, setStatistics] = useState<NPSStatistics[]>([]);
  const [periodType, setPeriodType] = useState('day');
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchDashboard();
    fetchStatistics();
  }, [periodType, days]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await getDashboard();
      setDashboard(res.data);
    } catch (error) {
      console.error('获取看板数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await getStatistics(periodType, days);
      setStatistics(res.data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  const getCategoryColor = (category: NPSCategory) => {
    switch (category) {
      case NPSCategory.PROMOTER:
        return 'green';
      case NPSCategory.PASSIVE:
        return 'orange';
      case NPSCategory.DETRACTOR:
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: NPSStatus) => {
    switch (status) {
      case NPSStatus.PENDING:
        return '待处理';
      case NPSStatus.PROCESSING:
        return '处理中';
      case NPSStatus.COMPLETED:
        return '已完成';
      case NPSStatus.IGNORED:
        return '已忽略';
      default:
        return '未知';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: ['user', 'nickname'],
      key: 'user',
      width: 120,
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (score: number) => <strong>{score}</strong>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: NPSCategory) => (
        <Tag color={getCategoryColor(category)}>
          {category === NPSCategory.PROMOTER && '推荐者'}
          {category === NPSCategory.PASSIVE && '被动者'}
          {category === NPSCategory.DETRACTOR && '贬损者'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: NPSStatus) => <Tag>{getStatusText(status)}</Tag>,
    },
    {
      title: '反馈时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
  ];

  if (!dashboard) {
    return <div>加载中...</div>;
  }

  return (
    <div className="nps-dashboard">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="NPS 得分"
              value={dashboard.overview.npsScore}
              precision={1}
              valueStyle={{ color: dashboard.overview.npsScore >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={dashboard.overview.npsScore >= 0 ? <SmileOutlined /> : <FrownOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总反馈数"
              value={dashboard.overview.totalFeedback}
              prefix={<CheckCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="推荐者比例"
              value={dashboard.overview.promoterRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
              prefix={<SmileOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="贬损者比例"
              value={dashboard.overview.detractorRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
              prefix={<FrownOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="分类分布">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="推荐者 (9-10分)"
                  value={dashboard.categoryDistribution.promoter}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<SmileOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="被动者 (7-8分)"
                  value={dashboard.categoryDistribution.passive}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<MehOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="贬损者 (0-6分)"
                  value={dashboard.categoryDistribution.detractor}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<FrownOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="处理状态">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="待处理"
                  value={dashboard.statusDistribution.pending}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="处理中"
                  value={dashboard.statusDistribution.processing}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="已完成"
                  value={dashboard.statusDistribution.completed}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="已忽略"
                  value={dashboard.statusDistribution.ignored}
                  valueStyle={{ color: '#999' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card title="最近反馈">
        <Table
          columns={columns}
          dataSource={dashboard.recentFeedback}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default NPSDashboard;
