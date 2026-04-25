import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Drawer,
  Descriptions,
} from 'antd';
import { EyeOutlined, EditOutlined, PhoneOutlined } from '@ant-design/icons';
import {
  getFeedbackList,
  getFeedbackDetail,
  updateFeedbackStatus,
  followUp,
  UpdateNPSStatusParams,
  FollowUpParams,
} from '@/services/nps';
import {
  NPSFeedback,
  NPSCategory,
  NPSStatus,
  NPSPriority,
  NPSTriggerType,
} from '@/types/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const FeedbackList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<NPSFeedback[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState<any>({});
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<NPSFeedback | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [followUpForm] = Form.useForm();

  useEffect(() => {
    fetchList();
  }, [page, pageSize, filters]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getFeedbackList({
        page,
        pageSize,
        ...filters,
      });
      setDataSource(res.data.list);
      setTotal(res.data.total);
    } catch (error) {
      message.error('获取反馈列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (record: NPSFeedback) => {
    try {
      const res = await getFeedbackDetail(record.id);
      setCurrentFeedback(res.data);
      setDetailVisible(true);
    } catch (error) {
      message.error('获取反馈详情失败');
    }
  };

  const handleUpdateStatus = (record: NPSFeedback) => {
    setCurrentFeedback(record);
    form.setFieldsValue({
      status: record.status,
      priority: record.priority,
      assignedTo: record.assignedTo,
      handleResult: record.handleResult,
    });
    setStatusModalVisible(true);
  };

  const handleFollowUp = (record: NPSFeedback) => {
    setCurrentFeedback(record);
    followUpForm.resetFields();
    setFollowUpModalVisible(true);
  };

  const handleStatusSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (currentFeedback) {
        await updateFeedbackStatus(currentFeedback.id, values);
        message.success('更新成功');
        setStatusModalVisible(false);
        fetchList();
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleFollowUpSubmit = async () => {
    try {
      const values = await followUpForm.validateFields();
      if (currentFeedback) {
        await followUp(currentFeedback.id, values);
        message.success('回访成功');
        setFollowUpModalVisible(false);
        fetchList();
      }
    } catch (error) {
      message.error('回访失败');
    }
  };

  const handleSearch = (values: any) => {
    setFilters(values);
    setPage(1);
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

  const getCategoryText = (category: NPSCategory) => {
    switch (category) {
      case NPSCategory.PROMOTER:
        return '推荐者';
      case NPSCategory.PASSIVE:
        return '被动者';
      case NPSCategory.DETRACTOR:
        return '贬损者';
      default:
        return '未知';
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

  const getPriorityText = (priority: NPSPriority) => {
    switch (priority) {
      case NPSPriority.LOW:
        return '低';
      case NPSPriority.MEDIUM:
        return '中';
      case NPSPriority.HIGH:
        return '高';
      case NPSPriority.URGENT:
        return '紧急';
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
      render: (score: number) => <strong style={{ fontSize: 16 }}>{score}</strong>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: NPSCategory) => (
        <Tag color={getCategoryColor(category)}>{getCategoryText(category)}</Tag>
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
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: NPSPriority) => {
        const color = priority >= NPSPriority.HIGH ? 'red' : priority === NPSPriority.MEDIUM ? 'orange' : 'default';
        return <Tag color={color}>{getPriorityText(priority)}</Tag>;
      },
    },
    {
      title: '触发类型',
      dataIndex: 'triggerType',
      key: 'triggerType',
      width: 100,
      render: (type: NPSTriggerType) => (
        <Tag>{type === NPSTriggerType.AUTO ? '自动' : '手动'}</Tag>
      ),
    },
    {
      title: '反馈时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: NPSFeedback) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleUpdateStatus(record)}
          >
            处理
          </Button>
          {!record.isFollowedUp && (
            <Button
              type="link"
              size="small"
              icon={<PhoneOutlined />}
              onClick={() => handleFollowUp(record)}
            >
              回访
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="feedback-list">
      <Card style={{ marginBottom: 16 }}>
        <Form layout="inline" onFinish={handleSearch}>
          <Form.Item name="scoreRange" label="分数范围">
            <Select style={{ width: 120 }} allowClear placeholder="选择分数范围">
              <Select.Option value="0-6">0-6分</Select.Option>
              <Select.Option value="7-8">7-8分</Select.Option>
              <Select.Option value="9-10">9-10分</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select style={{ width: 120 }} allowClear placeholder="选择状态">
              <Select.Option value={NPSStatus.PENDING}>待处理</Select.Option>
              <Select.Option value={NPSStatus.PROCESSING}>处理中</Select.Option>
              <Select.Option value={NPSStatus.COMPLETED}>已完成</Select.Option>
              <Select.Option value={NPSStatus.IGNORED}>已忽略</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="搜索反馈内容" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Drawer
        title="反馈详情"
        width={720}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
      >
        {currentFeedback && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="ID">{currentFeedback.id}</Descriptions.Item>
            <Descriptions.Item label="用户">
              {currentFeedback.user?.nickname}
            </Descriptions.Item>
            <Descriptions.Item label="评分">
              <strong style={{ fontSize: 18 }}>{currentFeedback.score}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="分类">
              <Tag color={getCategoryColor(currentFeedback.category)}>
                {getCategoryText(currentFeedback.category)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态" span={2}>
              <Tag>{getStatusText(currentFeedback.status)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="评分原因" span={2}>
              {currentFeedback.reason || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="改进建议" span={2}>
              {currentFeedback.suggestion || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="标签" span={2}>
              {currentFeedback.tags?.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              )) || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="触发类型">
              {currentFeedback.triggerType === NPSTriggerType.AUTO ? '自动' : '手动'}
            </Descriptions.Item>
            <Descriptions.Item label="触发场景">
              {currentFeedback.triggerScene || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="优先级">
              {getPriorityText(currentFeedback.priority)}
            </Descriptions.Item>
            <Descriptions.Item label="处理人">
              {currentFeedback.assignee?.nickname || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="处理结果" span={2}>
              {currentFeedback.handleResult || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="是否回访">
              {currentFeedback.isFollowedUp ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="回访时间">
              {currentFeedback.followUpTime
                ? dayjs(currentFeedback.followUpTime).format('YYYY-MM-DD HH:mm')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="回访结果" span={2}>
              {currentFeedback.followUpResult || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="反馈时间">
              {dayjs(currentFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {dayjs(currentFeedback.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      <Modal
        title="更新处理状态"
        open={statusModalVisible}
        onOk={handleStatusSubmit}
        onCancel={() => setStatusModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value={NPSStatus.PENDING}>待处理</Select.Option>
              <Select.Option value={NPSStatus.PROCESSING}>处理中</Select.Option>
              <Select.Option value={NPSStatus.COMPLETED}>已完成</Select.Option>
              <Select.Option value={NPSStatus.IGNORED}>已忽略</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="优先级">
            <Select>
              <Select.Option value={NPSPriority.LOW}>低</Select.Option>
              <Select.Option value={NPSPriority.MEDIUM}>中</Select.Option>
              <Select.Option value={NPSPriority.HIGH}>高</Select.Option>
              <Select.Option value={NPSPriority.URGENT}>紧急</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="handleResult" label="处理结果">
            <TextArea rows={4} placeholder="请输入处理结果" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="回访"
        open={followUpModalVisible}
        onOk={handleFollowUpSubmit}
        onCancel={() => setFollowUpModalVisible(false)}
      >
        <Form form={followUpForm} layout="vertical">
          <Form.Item
            name="followUpResult"
            label="回访结果"
            rules={[{ required: true, message: '请输入回访结果' }]}
          >
            <TextArea rows={4} placeholder="请输入回访结果" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedbackList;
