import React, { useEffect, useState } from 'react';
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
  Popconfirm,
  Tag,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  FireOutlined,
} from '@ant-design/icons';
import {
  getCityList,
  createCity,
  updateCity,
  deleteCity,
  getCityStats,
  City,
  CityStats,
  CreateCityDto,
  UpdateCityDto,
} from '@/services/cities';

const CitiesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [keyword, setKeyword] = useState('');
  const [stats, setStats] = useState<CityStats | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [form] = Form.useForm();

  // 加载城市列表
  const loadCities = async () => {
    setLoading(true);
    try {
      const { data } = await getCityList({
        page,
        pageSize,
        keyword: keyword || undefined,
      });
      setCities(data.list);
      setTotal(data.total);
    } catch (error) {
      message.error('加载城市列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载统计数据
  const loadStats = async () => {
    try {
      const { data } = await getCityStats();
      setStats(data);
    } catch (error) {
      console.error('加载统计数据失败:', error);
      message.error('加载统计数据失败，请稍后重试');
    }
  };

  useEffect(() => {
    loadCities();
  }, [page, pageSize, keyword]);

  useEffect(() => {
    loadStats();
  }, []);

  // 打开新增/编辑弹窗
  const handleOpenModal = (city?: City) => {
    setEditingCity(city || null);
    if (city) {
      form.setFieldsValue(city);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCity) {
        await updateCity(editingCity.id, values as UpdateCityDto);
        message.success('更新成功');
      } else {
        await createCity(values as CreateCityDto);
        message.success('添加成功');
      }
      setModalVisible(false);
      loadCities();
      loadStats();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 删除城市
  const handleDelete = async (id: number) => {
    try {
      await deleteCity(id);
      message.success('删除成功');
      loadCities();
      loadStats();
    } catch (error) {
      message.error('删除失败');
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
      title: '城市名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string, record: City) => (
        <Space>
          <EnvironmentOutlined />
          {name}
          {record.isHot && <Tag color="red">热门</Tag>}
        </Space>
      ),
    },
    {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
      width: 120,
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      key: 'longitude',
      width: 120,
      render: (val: number) => val?.toFixed(6),
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      key: 'latitude',
      width: 120,
      render: (val: number) => val?.toFixed(6),
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
      render: (count: number) => count || 0,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: City) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该城市吗？"
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
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 统计卡片 */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="城市总数"
                value={stats?.totalCities || 0}
                prefix={<GlobalOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="热门城市"
                value={stats?.hotCities || 0}
                prefix={<FireOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总用户数"
                value={stats?.totalUsers || 0}
                prefix={<EnvironmentOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 城市列表 */}
        <Card
          title="城市管理"
          extra={
            <Space>
              <Input.Search
                placeholder="搜索城市名称"
                allowClear
                style={{ width: 200 }}
                onSearch={setKeyword}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenModal()}
              >
                添加城市
              </Button>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={cities}
            rowKey="id"
            loading={loading}
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
      </Space>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingCity ? '编辑城市' : '添加城市'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="城市名称"
            name="name"
            rules={[
              { required: true, message: '请输入城市名称' },
              { min: 2, max: 20, message: '城市名称长度为 2-20 个字符' },
            ]}
          >
            <Input placeholder="请输入城市名称" />
          </Form.Item>
          <Form.Item
            label="省份"
            name="province"
            rules={[
              { required: true, message: '请输入省份' },
              { min: 2, max: 20, message: '省份名称长度为 2-20 个字符' },
            ]}
          >
            <Input placeholder="请输入省份" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="经度"
                name="longitude"
                rules={[
                  { required: true, message: '请输入经度' },
                  {
                    type: 'number',
                    min: -180,
                    max: 180,
                    message: '经度范围必须在 -180 到 180 之间',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入经度"
                  min={-180}
                  max={180}
                  precision={6}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="纬度"
                name="latitude"
                rules={[
                  { required: true, message: '请输入纬度' },
                  {
                    type: 'number',
                    min: -90,
                    max: 90,
                    message: '纬度范围必须在 -90 到 90 之间',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入纬度"
                  min={-90}
                  max={90}
                  precision={6}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="热门城市" name="isHot" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CitiesPage;
