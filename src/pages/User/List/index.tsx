import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Avatar,
  Modal,
  Form,
  InputNumber,
  message,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { userStore } from '@/stores';
import type { ColumnsType } from 'antd/es/table';

const UserListPage = observer(() => {
  const [searchForm] = Form.useForm();
  const [pointsModalVisible, setPointsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    userStore.fetchUserList();
  }, []);

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    userStore.fetchUserList({
      ...values,
      page: 1,
    });
  };

  const handleReset = () => {
    searchForm.resetFields();
    userStore.fetchUserList({ page: 1, pageSize: 20 });
  };

  const handleAdjustPoints = (user: any) => {
    setSelectedUser(user);
    setPointsModalVisible(true);
  };

  const handlePointsSubmit = async (values: any) => {
    const result = await userStore.adjustPoints(
      selectedUser.id,
      values.amount,
      values.reason
    );
    if (result.success) {
      message.success('积分调整成功');
      setPointsModalVisible(false);
    } else {
      message.error(result.message || '积分调整失败');
    }
  };

  const handleStatusChange = async (userId: number, status: number) => {
    const result = await userStore.updateStatus(userId, status);
    if (result.success) {
      message.success('状态更新成功');
    } else {
      message.error(result.message || '状态更新失败');
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatarUrl} />
          <div>
            <div>{record.nickname}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {record.mobile}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: number) => (gender === 1 ? '男' : '女'),
    },
    {
      title: '积分',
      dataIndex: 'points',
      key: 'points',
      render: (points: number) => <span style={{ color: '#1890ff' }}>{points}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        const statusMap = {
          0: { text: '正常', color: 'green' },
          1: { text: '禁言', color: 'orange' },
          2: { text: '封号', color: 'red' },
        };
        const { text, color } = statusMap[status] || { text: '未知', color: 'default' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '违规次数',
      dataIndex: 'violationCount',
      key: 'violationCount',
    },
    {
      title: '注册时间',
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
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleAdjustPoints(record)}
          >
            调整积分
          </Button>
          <Select
            size="small"
            value={record.status}
            style={{ width: 80 }}
            onChange={(value) => handleStatusChange(record.id, value)}
          >
            <Select.Option value={0}>正常</Select.Option>
            <Select.Option value={1}>禁言</Select.Option>
            <Select.Option value={2}>封号</Select.Option>
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-list-page">
      <Card>
        <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="keyword">
            <Input
              placeholder="搜索手机号/昵称"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态筛选" style={{ width: 120 }} allowClear>
              <Select.Option value={0}>正常</Select.Option>
              <Select.Option value={1}>禁言</Select.Option>
              <Select.Option value={2}>封号</Select.Option>
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
          dataSource={userStore.userList}
          loading={userStore.isLoading}
          pagination={{
            current: userStore.currentParams.page,
            pageSize: userStore.currentParams.pageSize,
            total: userStore.total,
            onChange: (page, pageSize) => {
              userStore.fetchUserList({ page, pageSize });
            },
          }}
          rowKey="id"
        />
      </Card>

      <Modal
        title="调整积分"
        open={pointsModalVisible}
        onCancel={() => setPointsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handlePointsSubmit}>
          <Form.Item label="当前积分">
            <span>{selectedUser?.points}</span>
          </Form.Item>
          <Form.Item
            name="amount"
            label="调整数量"
            rules={[{ required: true, message: '请输入调整数量' }]}
          >
            <InputNumber
              placeholder="正数增加，负数扣除"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="reason"
            label="调整原因"
            rules={[{ required: true, message: '请输入调整原因' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入调整原因" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
              <Button onClick={() => setPointsModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default UserListPage;
