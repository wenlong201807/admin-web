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
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  type Banner,
  type CreateBannerDto,
} from '@/services/banner';

const BannerListPage = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Banner[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBanners(page, pageSize);
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
  }, [page, pageSize]);

  const handleAdd = () => {
    setEditingBanner(null);
    form.resetFields();
    form.setFieldsValue({ linkType: 'none', sortOrder: 0, isActive: true });
    setModalVisible(true);
  };

  const handleEdit = (record: Banner) => {
    setEditingBanner(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBanner(id);
      message.success('删除成功');
      fetchData();
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleBannerStatus(id);
      message.success('状态更新成功');
      fetchData();
    } catch (error: any) {
      message.error(error.message || '状态更新失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingBanner) {
        await updateBanner(editingBanner.id, values);
        message.success('更新成功');
      } else {
        await createBanner(values as CreateBannerDto);
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

  const columns: ColumnsType<Banner> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: (url: string) => (
        <Image src={url} width={80} height={40} style={{ objectFit: 'cover' }} />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: '副标题',
      dataIndex: 'subtitle',
      key: 'subtitle',
      width: 200,
      ellipsis: true,
    },
    {
      title: '链接类型',
      dataIndex: 'linkType',
      key: 'linkType',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          none: '无',
          page: '页面',
          topic: '话题',
          user: '用户',
          post: '帖子',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '链接值',
      dataIndex: 'linkValue',
      key: 'linkValue',
      width: 150,
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStatus(record.id)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除吗？"
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

  return (
    <Card
      title="轮播图管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增轮播图
        </Button>
      }
    >
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
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
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingBanner ? '编辑轮播图' : '新增轮播图'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" maxLength={100} />
          </Form.Item>

          <Form.Item label="副标题" name="subtitle">
            <Input placeholder="请输入副标题" maxLength={200} />
          </Form.Item>

          <Form.Item
            label="图片URL"
            name="imageUrl"
            rules={[{ required: true, message: '请输入图片URL' }]}
          >
            <Input placeholder="请输入图片URL" />
          </Form.Item>

          <Form.Item
            label="链接类型"
            name="linkType"
            rules={[{ required: true, message: '请选择链接类型' }]}
          >
            <Select>
              <Select.Option value="none">无</Select.Option>
              <Select.Option value="page">页面</Select.Option>
              <Select.Option value="topic">话题</Select.Option>
              <Select.Option value="user">用户</Select.Option>
              <Select.Option value="post">帖子</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="链接值" name="linkValue">
            <Input placeholder="请输入链接值（如页面路径、话题ID等）" />
          </Form.Item>

          <Form.Item label="排序" name="sortOrder">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="是否启用" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BannerListPage;
