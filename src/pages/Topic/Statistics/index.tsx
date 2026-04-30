import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, message, Spin } from 'antd';
import {
  FireOutlined,
  EyeOutlined,
  HeartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getTopicStatistics, type Topic, type TopicStatistics } from '@/services/topic';
import { useNavigate } from 'react-router-dom';

const TopicStatisticsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<TopicStatistics | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTopicStatistics();
      setStatistics(res.data);
    } catch (error: any) {
      message.error(error.message || '获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnsType<Topic> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_: any, __: Topic, index: number) => index + 1,
    },
    {
      title: '话题名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Topic) => (
        <a onClick={() => navigate(`/topic/detail/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '热度分数',
      dataIndex: 'hotScore',
      key: 'hotScore',
      width: 100,
      render: (score: number) => score.toFixed(2),
    },
    {
      title: '帖子数',
      dataIndex: 'postCount',
      key: 'postCount',
      width: 100,
    },
    {
      title: '关注数',
      dataIndex: 'followCount',
      key: 'followCount',
      width: 100,
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <p>暂无统计数据</p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card title="话题统计概览" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总话题数"
                value={statistics.totalTopics}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="上架话题数"
                value={statistics.activeTopics}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="热门话题数"
                value={statistics.hotTopics}
                prefix={<FireOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总关注数"
                value={statistics.totalFollows}
                prefix={<HeartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总帖子数"
                value={statistics.totalPosts}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="Top 10 热门话题">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={statistics.topTopics}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default TopicStatisticsPage;
