import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  DatePicker,
  Input,
  message,
  Modal,
  Tag,
  Avatar,
  Statistic,
  Row,
  Col,
} from 'antd';
import { ReloadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { chatApi, ChatMessage, Conversation, ChatQueryParams, ChatStatistics } from '@/services/chat';
import { MessageType, MessageTypeText, MessageTypeColor, MessageStatus, MessageStatusText, MessageStatusColor } from '@/constants/enums';
import { formatDateTime } from '@/utils/format';

const { RangePicker } = DatePicker;

const ChatManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'conversations' | 'messages'>('conversations');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [statistics, setStatistics] = useState<ChatStatistics | null>(null);
  const [messageDetailVisible, setMessageDetailVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const [queryParams, setQueryParams] = useState<ChatQueryParams>({
    page: 1,
    pageSize: 20,
  });

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (activeTab === 'conversations') {
        setLoading(true);
        try {
          const res = await chatApi.getConversations(queryParams);
          if (!cancelled) {
            setConversations(res.list);
            setTotal(res.total);
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
          const res = await chatApi.getMessages(queryParams);
          if (!cancelled) {
            setMessages(res.list);
            setTotal(res.total);
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
        const res = await chatApi.getStatistics();
        if (!cancelled) {
          setStatistics(res);
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

  const handleDeleteMessage = async (messageId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条消息吗？',
      onOk: async () => {
        try {
          await chatApi.deleteMessage(messageId);
          message.success('删除成功');
          loadMessages();
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };

  const conversationColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '用户1',
      dataIndex: 'user1',
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
      title: '用户2',
      dataIndex: 'user2',
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
      title: '最后消息',
      dataIndex: 'lastMessage',
      ellipsis: true,
      render: (msg: ChatMessage) => msg?.content || '-',
    },
    {
      title: '最后消息时间',
      dataIndex: 'lastMessageAt',
      width: 180,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '未读数',
      width: 100,
      render: (record: Conversation) => (
        <Space>
          <Tag color="blue">{record.user1UnreadCount}</Tag>
          <Tag color="green">{record.user2UnreadCount}</Tag>
        </Space>
      ),
    },
    {
      title: '操作',
      width: 100,
      render: (record: Conversation) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedConversation(record);
            setMessageDetailVisible(true);
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  const messageColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '发送者',
      dataIndex: 'sender',
      width: 150,
      render: (user: any) => (
        <div>
          <div>{user?.nickname || '-'}</div>
          <div style={{ fontSize: 12, color: '#999' }}>ID: {user?.id}</div>
        </div>
      ),
    },
    {
      title: '接收者',
      dataIndex: 'receiver',
      width: 150,
      render: (user: any) => (
        <div>
          <div>{user?.nickname || '-'}</div>
          <div style={{ fontSize: 12, color: '#999' }}>ID: {user?.id}</div>
        </div>
      ),
    },
    {
      title: '消息类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => {
        const text = MessageTypeText[type as MessageType] || type;
        const color = MessageTypeColor[type as MessageType] || 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string, record: ChatMessage) => {
        if (record.isRecalled) {
          return <Tag color="red">已撤回</Tag>;
        }
        const text = MessageStatusText[status as MessageStatus] || status;
        const color = MessageStatusColor[status as MessageStatus] || 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '操作',
      width: 100,
      render: (record: ChatMessage) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteMessage(record.id)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* 统计卡片 */}
      {statistics && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic title="总会话数" value={statistics.totalConversations} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="总消息数" value={statistics.totalMessages} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="今日消息"
                value={statistics.todayMessages}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="活跃用户"
                value={statistics.activeUsers}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 查询表单 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Button
            type={activeTab === 'conversations' ? 'primary' : 'default'}
            onClick={() => setActiveTab('conversations')}
          >
            会话列表
          </Button>
          <Button
            type={activeTab === 'messages' ? 'primary' : 'default'}
            onClick={() => setActiveTab('messages')}
          >
            消息记录
          </Button>
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
            placeholder="关键词"
            style={{ width: 200 }}
            value={queryParams.keyword}
            onChange={(e) => setQueryParams({ ...queryParams, keyword: e.target.value })}
          />
          <RangePicker
            value={
              queryParams.startDate && queryParams.endDate
                ? [dayjs(queryParams.startDate), dayjs(queryParams.endDate)]
                : null
            }
            onChange={(dates) => {
              if (dates) {
                setQueryParams({
                  ...queryParams,
                  startDate: dates[0]?.format('YYYY-MM-DD'),
                  endDate: dates[1]?.format('YYYY-MM-DD'),
                });
              } else {
                setQueryParams({
                  ...queryParams,
                  startDate: undefined,
                  endDate: undefined,
                });
              }
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              if (activeTab === 'conversations') {
                loadConversations();
              } else {
                loadMessages();
              }
            }}
          >
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
        <Table
          loading={loading}
          dataSource={activeTab === 'conversations' ? conversations : messages}
          columns={activeTab === 'conversations' ? conversationColumns : messageColumns}
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
      </Card>

      {/* 会话详情弹窗 */}
      <Modal
        title="会话详情"
        open={messageDetailVisible}
        onCancel={() => {
          setMessageDetailVisible(false);
          setSelectedConversation(null);
        }}
        footer={null}
        width={800}
      >
        {selectedConversation && (
          <div>
            <p>会话ID: {selectedConversation.id}</p>
            <p>用户1: {selectedConversation.user1?.nickname} (ID: {selectedConversation.user1?.id})</p>
            <p>用户2: {selectedConversation.user2?.nickname} (ID: {selectedConversation.user2?.id})</p>
            <p>创建时间: {dayjs(selectedConversation.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChatManagement;
