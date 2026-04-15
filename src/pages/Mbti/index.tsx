import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Tag,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import type { ColumnsType } from 'antd/es/table';

interface MbtiQuestion {
  id: number;
  dimension: string;
  direction: number;
  content: string;
  optionA: string;
  optionB: string;
  sortOrder: number;
  createdAt: string;
}

interface MbtiReport {
  id: number;
  mbtiType: string;
  typeName: string;
  description: string;
  avatarUrl: string;
  themeColor: string;
  createdAt: string;
}

const MbtiPage = observer(() => {
  const [activeTab, setActiveTab] = useState<'questions' | 'reports'>('questions');
  const [questions, setQuestions] = useState<MbtiQuestion[]>([]);
  const [reports, setReports] = useState<MbtiReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (activeTab === 'questions') {
      fetchQuestions();
    } else {
      fetchReports();
    }
  }, [activeTab]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // TODO: 调用API获取题目列表
      message.info('题目管理功能开发中');
      setQuestions([]);
    } catch (error: any) {
      message.error(error.message || '获取题目列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      // TODO: 调用API获取报告列表
      message.info('报告管理功能开发中');
      setReports([]);
    } catch (error: any) {
      message.error(error.message || '获取报告列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // TODO: 调用API删除
      message.success('删除成功');
      if (activeTab === 'questions') {
        fetchQuestions();
      } else {
        fetchReports();
      }
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // TODO: 调用API保存
      message.success(editingItem ? '更新成功' : '创建成功');
      setModalVisible(false);
      if (activeTab === 'questions') {
        fetchQuestions();
      } else {
        fetchReports();
      }
    } catch (error: any) {
      message.error(error.message || '保存失败');
    }
  };

  const questionColumns: ColumnsType<MbtiQuestion> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '维度',
      dataIndex: 'dimension',
      width: 100,
      render: (dimension: string) => {
        const colorMap: Record<string, string> = {
          EI: 'blue',
          SN: 'green',
          TF: 'orange',
          JP: 'purple',
        };
        return <Tag color={colorMap[dimension]}>{dimension}</Tag>;
      },
    },
    {
      title: '方向',
      dataIndex: 'direction',
      width: 80,
      render: (direction: number) => (direction === 1 ? '正向' : '反向'),
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '选项A',
      dataIndex: 'optionA',
      width: 150,
      ellipsis: true,
    },
    {
      title: '选项B',
      dataIndex: 'optionB',
      width: 150,
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      width: 80,
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
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const reportColumns: ColumnsType<MbtiReport> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: 'MBTI类型',
      dataIndex: 'mbtiType',
      width: 120,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '类型名称',
      dataIndex: 'typeName',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      width: 100,
      render: (url: string) =>
        url ? (
          <img src={url} alt="avatar" style={{ width: 40, height: 40 }} />
        ) : (
          '-'
        ),
    },
    {
      title: '主题色',
      dataIndex: 'themeColor',
      width: 100,
      render: (color: string) =>
        color ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 20,
                height: 20,
                background: color,
                borderRadius: 4,
              }}
            />
            <span>{color}</span>
          </div>
        ) : (
          '-'
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
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.id)}
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
    <div className="mbti-page">
      <Card
        title="MBTI 管理"
        extra={
          <Space>
            <Button
              type={activeTab === 'questions' ? 'primary' : 'default'}
              onClick={() => setActiveTab('questions')}
            >
              题目管理
            </Button>
            <Button
              type={activeTab === 'reports' ? 'primary' : 'default'}
              onClick={() => setActiveTab('reports')}
            >
              报告管理
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增{activeTab === 'questions' ? '题目' : '报告'}
            </Button>
          </Space>
        }
      >
        <Table
          columns={activeTab === 'questions' ? questionColumns : reportColumns}
          dataSource={activeTab === 'questions' ? questions : reports}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={
          editingItem
            ? `编辑${activeTab === 'questions' ? '题目' : '报告'}`
            : `新增${activeTab === 'questions' ? '题目' : '报告'}`
        }
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {activeTab === 'questions' ? (
            <>
              <Form.Item
                name="dimension"
                label="维度"
                rules={[{ required: true, message: '请选择维度' }]}
              >
                <Input placeholder="EI/SN/TF/JP" />
              </Form.Item>
              <Form.Item
                name="direction"
                label="方向"
                rules={[{ required: true, message: '请选择方向' }]}
              >
                <InputNumber min={-1} max={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="content"
                label="题目内容"
                rules={[{ required: true, message: '请输入题目内容' }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item
                name="optionA"
                label="选项A"
                rules={[{ required: true, message: '请输入选项A' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="optionB"
                label="选项B"
                rules={[{ required: true, message: '请输入选项B' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="sortOrder" label="排序" initialValue={0}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="mbtiType"
                label="MBTI类型"
                rules={[{ required: true, message: '请输入MBTI类型' }]}
              >
                <Input placeholder="如: INTJ" maxLength={4} />
              </Form.Item>
              <Form.Item
                name="typeName"
                label="类型名称"
                rules={[{ required: true, message: '请输入类型名称' }]}
              >
                <Input placeholder="如: 建筑师" />
              </Form.Item>
              <Form.Item
                name="description"
                label="描述"
                rules={[{ required: true, message: '请输入描述' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item name="avatarUrl" label="头像URL">
                <Input placeholder="https://..." />
              </Form.Item>
              <Form.Item name="themeColor" label="主题色">
                <Input placeholder="#667eea" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
});

export default MbtiPage;
