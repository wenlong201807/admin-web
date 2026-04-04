import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  InputNumber,
  message,
  Image,
  Avatar,
} from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { getPostList, deletePost } from '@/services/content';
import type { ColumnsType } from 'antd/es/table';

const ContentPage = () => {
  const [searchForm] = Form.useForm();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

  const fetchPosts = async (params?: any) => {
    setLoading(true);
    try {
      const res = await getPostList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...params,
      });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [pagination]);

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    fetchPosts({ ...values, page: 1 });
  };

  const handleReset = () => {
    searchForm.resetFields();
    fetchPosts({ page: 1, pageSize: 20 });
  };

  const handleDelete = (post: any) => {
    setSelectedPost(post);
    setDeleteModalVisible(true);
  };

  const handleDeleteSubmit = async (values: any) => {
    try {
      await deletePost(selectedPost.id, values);
      message.success('删除成功');
      setDeleteModalVisible(false);
      fetchPosts();
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar src={record.user?.avatarUrl} />
          <span>{record.user?.nickname || '-'}</span>
        </Space>
      ),
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '图片',
      dataIndex: 'images',
      key: 'images',
      render: (images: string[]) => (
        <Space>
          {images?.slice(0, 3).map((url, index) => (
            <Image key={index} src={url} width={40} height={40} />
          ))}
          {images?.length > 3 && <span>+{images.length - 3}</span>}
        </Space>
      ),
    },
    {
      title: '互动',
      key: 'interaction',
      render: (_, record) => (
        <Space>
          <span>👍 {record.likeCount}</span>
          <span>💬 {record.commentCount}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        const statusMap: Record<number, { text: string; color: string }> = {
          0: { text: '正常', color: 'green' },
          1: { text: '已删除', color: 'red' },
          2: { text: '违规', color: 'orange' },
        };
        const { text, color } = statusMap[status] || {
          text: '未知',
          color: 'default',
        };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="content-page">
      <Card>
        <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="keyword">
            <Input
              placeholder="搜索内容"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态筛选" style={{ width: 120 }} allowClear>
              <Select.Option value={0}>正常</Select.Option>
              <Select.Option value={1}>已删除</Select.Option>
              <Select.Option value={2}>违规</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize: pageSize || 20 });
            },
          }}
          rowKey="id"
        />
      </Card>

      <Modal
        title="删除内容"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={null}
      >
        {selectedPost && (
          <Form onFinish={handleDeleteSubmit}>
            <Form.Item label="内容">
              <div>{selectedPost.content}</div>
            </Form.Item>
            <Form.Item
              name="reason"
              label="删除原因"
              rules={[{ required: true, message: '请输入删除原因' }]}
            >
              <Input.TextArea rows={3} placeholder="请输入删除原因" />
            </Form.Item>
            <Form.Item name="deductPoints" label="扣除积分">
              <InputNumber
                placeholder="可选"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" danger htmlType="submit">
                  确认删除
                </Button>
                <Button onClick={() => setDeleteModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ContentPage;
