import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  DatePicker,
  Select,
  Input,
  message,
  Statistic,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  InputNumber,
} from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { pointsApi, PointsLog, PointsQueryParams, PointsStatistics } from '@/services/points';
import { PointsType, PointsTypeText, PointsTypeColor } from '@/constants/enums';
import { formatDateTime } from '@/utils/format';

const { RangePicker } = DatePicker;

const PointsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<PointsLog[]>([]);
  const [total, setTotal] = useState(0);
  const [statistics, setStatistics] = useState<PointsStatistics | null>(null);
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [form] = Form.useForm();

  const [queryParams, setQueryParams] = useState<PointsQueryParams>({
    page: 1,
    pageSize: 20,
  });

  // 加载积分记录
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pointsApi.getList(queryParams);
      setDataSource(res.data.list);
      setTotal(res.data.total);
    } catch (error: any) {
      message.error(error.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  // 加载统计数据
  const loadStatistics = useCallback(async () => {
    try {
      const res = await pointsApi.getStatistics();
      setStatistics(res.data);
    } catch (error: any) {
      message.error('加载统计数据失败');
    }
  }, []);

  useEffect(() => {
    loadData();
    loadStatistics();
  }, [loadData, loadStatistics]);

  // 手动调整积分
  const handleAdjustPoints = async (values: any) => {
    setAdjusting(true);
    try {
      await pointsApi.adjustPoints(values);
      message.success('积分调整成功');
      setAdjustModalVisible(false);
      form.resetFields();
      loadData();
      loadStatistics();
    } catch (error: any) {
      message.error(error.message || '调整失败');
    } finally {
      setAdjusting(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: 'user',
      width: 150,
      render: (user: any) => (
        <div>
          <div>{user?.nickname || '-'}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{user?.mobile || '-'}</div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      render: (type: string) => {
        const text = PointsTypeText[type as PointsType] || type;
        const color = PointsTypeColor[type as PointsType] || 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '积分变动',
      dataIndex: 'amount',
      width: 100,
      render: (amount: number) => (
        <span style={{ color: amount > 0 ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
          {amount > 0 ? '+' : ''}{amount}
        </span>
      ),
    },
    {
      title: '当前余额',
      dataIndex: 'balance',
      width: 100,
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (text: string) => formatDateTime(text),
    },
  ];

  return (
    <div>
      {/* 统计卡片 */}
      {statistics && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总积分发放"
                value={statistics.totalPoints}
                suffix="分"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="参与用户数"
                value={statistics.totalUsers}
                suffix="人"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="今日发放"
                value={statistics.todayPoints}
                suffix="分"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="今日活跃"
                value={statistics.todayUsers}
                suffix="人"
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 查询表单 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
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
          <Select
            placeholder="积分类型"
            style={{ width: 150 }}
            allowClear
            value={queryParams.type}
            onChange={(value) => setQueryParams({ ...queryParams, type: value })}
          >
            {Object.entries(PointsTypeText).map(([key, text]) => (
              <Select.Option key={key} value={key}>
                {text}
              </Select.Option>
            ))}
          </Select>
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
          <Button type="primary" onClick={() => loadData()}>
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAdjustModalVisible(true)}
          >
            手动调整积分
          </Button>
        </Space>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          loading={loading}
          dataSource={dataSource}
          columns={columns}
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

      {/* 手动调整积分弹窗 */}
      <Modal
        title="手动调整积分"
        open={adjustModalVisible}
        confirmLoading={adjusting}
        onCancel={() => {
          setAdjustModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAdjustPoints}>
          <Form.Item
            label="用户ID"
            name="userId"
            rules={[{ required: true, message: '请输入用户ID' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入用户ID" />
          </Form.Item>
          <Form.Item
            label="积分变动"
            name="amount"
            rules={[{ required: true, message: '请输入积分变动值' }]}
            extra="正数为增加，负数为扣除"
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入积分变动值" />
          </Form.Item>
          <Form.Item
            label="调整说明"
            name="description"
            rules={[{ required: true, message: '请输入调整说明' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入调整说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointsManagement;
