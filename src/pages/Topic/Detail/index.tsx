import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Image,
  Tag,
  Statistic,
  Row,
  Col,
  message,
  Spin,
} from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { getTopicById, type Topic } from '@/services/topic';

const TopicDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getTopicById(Number(id));
      setTopic(res.data);
    } catch (error: any) {
      message.error(error.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <p>话题不存在</p>
          <Button onClick={() => navigate('/topic/list')}>返回列表</Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 操作栏 */}
        <Card>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/topic/list')}>
              返回列表
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/topic/edit/${topic.id}`)}
            >
              编辑话题
            </Button>
          </Space>
        </Card>

        {/* 统计数据 */}
        <Card title="数据统计">
          <Row gutter={16}>
            <Col span={6}>
              <Statistic title="帖子数" value={topic.postCount} />
            </Col>
            <Col span={6}>
              <Statistic title="关注数" value={topic.followCount} />
            </Col>
            <Col span={6}>
              <Statistic title="浏览量" value={topic.viewCount} />
            </Col>
            <Col span={6}>
              <Statistic
                title="热度分数"
                value={topic.hotScore}
                precision={2}
              />
            </Col>
          </Row>
        </Card>

        {/* 基本信息 */}
        <Card title="基本信息">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="话题ID">{topic.id}</Descriptions.Item>
            <Descriptions.Item label="话题名称">{topic.name}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={topic.status === 1 ? 'success' : 'default'}>
                {topic.status === 1 ? '上架' : '下架'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="是否热门">
              <Tag color={topic.isHot ? 'red' : 'default'}>
                {topic.isHot ? '热门' : '普通'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="排序权重">{topic.sortOrder}</Descriptions.Item>
            <Descriptions.Item label="创建者ID">{topic.creatorId || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {new Date(topic.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间" span={2}>
              {new Date(topic.updatedAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="话题描述" span={2}>
              {topic.description || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="SEO关键词" span={2}>
              {topic.seoKeywords || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="封面图片" span={2}>
              <Image
                src={topic.coverImage}
                width={200}
                style={{ borderRadius: 4 }}
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </div>
  );
};

export default TopicDetailPage;
