import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Switch,
  InputNumber,
  message,
} from 'antd';
import { observer } from 'mobx-react-lite';
import {
  certificationTypeApi,
  type CertificationType,
  type CreateCertificationTypeDto,
  type UpdateCertificationTypeDto,
} from '@/services/certificationType';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const CertificationTypePage = observer(() => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CertificationType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificationType | null>(
    null,
  );
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await certificationTypeApi.getList();
      setData(res.data.list);
    } catch (error) {
      console.error('Fetch certification types error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: CertificationType) => {
    setEditingItem(record);
    form.setFieldsValue({
      code: record.code,
      name: record.name,
      icon: record.icon,
      description: record.description,
      requiredFields: record.requiredFields?.join(', '),
      isEnabled: record.isEnabled,
      sortOrder: record.sortOrder,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该认证类型吗？',
      onOk: async () => {
        try {
          await certificationTypeApi.delete(id);
          message.success('删除成功');
          fetchData();
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    const dto: CreateCertificationTypeDto | UpdateCertificationTypeDto = {
      name: values.name,
      icon: values.icon,
      description: values.description,
      requiredFields: values.requiredFields
        ? values.requiredFields
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      isEnabled: values.isEnabled,
      sortOrder: values.sortOrder,
    };

    try {
      if (editingItem) {
        await certificationTypeApi.update(editingItem.id, dto);
        message.success('更新成功');
      } else {
        // await certificationTypeApi.create({ ...dto, code: values.code });
        // message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  const handleInit = async () => {
    try {
      await certificationTypeApi.init();
      message.success('初始化成功');
      fetchData();
    } catch (error: any) {
      message.error(error.message || '初始化失败');
    }
  };

  const columns = [
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon: string) => icon || '📋',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '必填字段',
      dataIndex: 'requiredFields',
      key: 'requiredFields',
      render: (fields: string[]) => fields?.join(', ') || '-',
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      render: (enabled: boolean) => (
        <span style={{ color: enabled ? '#52c41a' : '#ff4d4f' }}>
          {enabled ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CertificationType) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="certification-type-page">
      <Card
        title="认证类型管理"
        extra={
          <Space>
            <Button onClick={handleInit}>初始化默认类型</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增类型
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title={editingItem ? '编辑认证类型' : '新增认证类型'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {!editingItem && (
            <Form.Item
              name="code"
              label="编码"
              rules={[{ required: true, message: '请输入编码' }]}
            >
              <Input placeholder="如: house, education" />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="如: 房产认证" />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input placeholder="图标 emoji 或图片URL" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="认证类型描述" />
          </Form.Item>
          <Form.Item name="requiredFields" label="必填字段">
            <Input placeholder="多个字段用逗号分隔，如: name, id_card" />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isEnabled" label="启用状态" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default CertificationTypePage;
