import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  message,
  Image,
  Popconfirm,
  Tag,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  batchOperation,
  type Topic,
  type CreateTopicDto,
  type TopicListParams,
} from '@/services/topic';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

const TopicListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Topic[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = useState<TopicListParams>({
    sortBy: 'sortOrder',
    sortOrder: 'DESC',
  });
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTopics({
        page,
        pageSize,
        ...searchParams,
      });
      setDataSource(res.data.list);
      setTotal(res.data.total);
    } catch (error: any) {
      message.error(error.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, searchParams]);

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    setSearchParams({
      ...searchParams,
      keyword: values.keyword,
      status: values.status,
      isHot: values.isHot,
    });
    setPage(1);
  };

  const handleReset = () => {
    searchForm.resetFields();
    setSearchParams({
      sortBy: 'sortOrder',
      sortOrder: 'DESC',
    });
    setPage(1);
  };

  const handleAdd = () => {
    setEditingTopic(null);
    form.resetFields();
    form.setFieldsValue({
      status: true,
      isHot: false,
      sortOrder: 0,
    });
    setModalVisible(true);
  };

  const handleEdit = (record: Topic) => {
    setEditingTopic(record);
    form.setFieldsValue({
      ...record,
      status: record.status === 1,
      isHot: record.isHot,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTopic(id);
      message.success('删除成功');
      fetchData();
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const handleBatchOperation = async (action: 'enable' | 'disable' | 'setHot' | 'unsetHot') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要操作的话题');
      return;
    }

    setBatchLoading(true);
    try {
      await batchOperation({
        ids: selectedRowKeys as number[],
        action,
      });
      message.success('批量操作成功');
      setSelectedRowKeys([]);
      fetchData();
    } catch (error: any) {
      message.error(error.message || '批量操作失败');
    } finally {
      setBatchLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitData = {
        ...values,
        status: values.status ? 1 : 0,
      };
      if (editingTopic) {
        await updateTopic(editingTopic.id, submitData);
        message.success('更新成功');
      } else {
        await createTopic(submitData as CreateTopicDto);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.message || '操作失败');
    }
  };

  const columns: ColumnsType<Topic> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      fixed: 'left',
    },
    {
      title: '封面图',
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: 100,
      render: (url: string) => (
        <Image src={url} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 4 }} />
      ),
    },
    {
      title: '话题名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ellipsis: true,
      render: (text: string, record: Topic) => (
        <Tooltip title={text}>
          <a onClick={() => navigate(`/topic/detail/${record.id}`)}>{text}</a>
        </Tooltip>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: '帖子数',
      dataIndex: 'postCount',
      key: 'postCount',
      width: 80,
      sorter: true,
    },
    {
      title: '关注数',
      dataIndex: 'followCount',
      key: 'followCount',
      width: 80,
      sorter: true,
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
    },
    {
      title: '热度分数',
      dataIndex: 'hotScore',
      key: 'hotScore',
      width: 90,
      sorter: true,
      render: (score: number) => score.toFixed(2),
    },
    {
      title: '排序权重',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 90,
      sorter: true,
    },
    {
      title: '是否热门',
      dataIndex: 'isHot',
      key: 'isHot',
      width: 90,
      render: (isHot: boolean) => (
        <Tag color={isHot ? 'red' : 'default'}>{isHot ? '热门' : '普通'}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '上架' : '下架'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_: any, record: Topic) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个话题吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        {/* 搜索栏 */}
        <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="keyword">
            <Input placeholder="搜索话题名称或描述" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态" style={{ width: 120 }} allowClear>
              <Option value={1}>上架</Option>
              <Option value={0}>下架</Option>
            </Select>
          </Form.Item>
          <Form.Item name="isHot">
            <Select placeholder="是否热门" style={{ width: 120 }} allowClear>
              <Option value={true}>热门</Option>
              <Option value={false}>普通</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 操作按钮 */}
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建话题
          </Button>
          <Button
            onClick={() => handleBatchOperation('enable')}
            disabled={selectedRowKeys.length === 0 || batchLoading}
            loading={batchLoading}
          >
            批量上架
          </Button>
          <Button
            onClick={() => handleBatchOperation('disable')}
            disabled={selectedRowKeys.length === 0 || batchLoading}
            loading={batchLoading}
          >
            批量下架
          </Button>
          <Button
            onClick={() => handleBatchOperation('setHot')}
            disabled={selectedRowKeys.length === 0 || batchLoading}
            loading={batchLoading}
          >
            设为热门
          </Button>
          <Button
            onClick={() => handleBatchOperation('unsetHot')}
            disabled={selectedRowKeys.length === 0 || batchLoading}
            loading={batchLoading}
          >
            取消热门
          </Button>
          <Button onClick={() => navigate('/topic/statistics')}>
            查看统计
          </Button>
        </Space>

        {/* 表格 */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowSelection={rowSelection}
          scroll={{ x: 1500 }}
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

      {/* 创建/编辑弹窗 */}
      <Modal
        title={editingTopic ? '编辑话题' : '新建话题'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="话题名称"
            name="name"
            rules={[
              { required: true, message: '请输入话题名称' },
              { max: 100, message: '话题名称最多100个字符' },
            ]}
          >
            <Input placeholder="请输入话题名称" />
          </Form.Item>

          <Form.Item
            label="话题描述"
            name="description"
            rules={[{ max: 500, message: '话题描述最多500个字符' }]}
          >
            <TextArea rows={4} placeholder="请输入话题描述" />
          </Form.Item>

          <Form.Item
            label="封面图片"
            name="coverImage"
            rules={[
              { required: true, message: '请输入封面图片URL' },
              { type: 'url', message: '请输入有效的URL' },
              {
                pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                message: '请输入有效的图片URL（支持jpg、jpeg、png、gif、webp格式）'
              }
            ]}
          >
            <Input placeholder="请输入封面图片URL（如：https://example.com/image.jpg）" />
          </Form.Item>

          <Form.Item label="SEO关键词" name="seoKeywords">
            <Input placeholder="多个关键词用逗号分隔" />
          </Form.Item>

          <Form.Item label="排序权重" name="sortOrder">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="数值越大越靠前" />
          </Form.Item>

          <Form.Item label="状态" name="status" valuePropName="checked">
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>

          <Form.Item label="是否热门" name="isHot" valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TopicListPage;
