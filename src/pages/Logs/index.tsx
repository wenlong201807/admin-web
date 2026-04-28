import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Modal,
  Descriptions,
  Typography,
  message,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { queryLogs, getLogDetail, getLogStats, type LogEntry, type LogDetailResponse, type LogStatsResponse } from '../../services/logs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text, Paragraph } = Typography;

const LogsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<LogDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [statsData, setStatsData] = useState<LogStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // 加载日志列表
  const loadLogs = async (params?: any) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const dateRange = values.dateRange;

      const queryParams = {
        ...values,
        startTime: dateRange?.[0]?.toISOString(),
        endTime: dateRange?.[1]?.toISOString(),
        page,
        pageSize,
        ...params,
      };

      delete queryParams.dateRange;

      const response = await queryLogs(queryParams);
      setDataSource(response.data.list);
      setTotal(response.data.total);
    } catch (error: any) {
      message.error(error.message || '加载日志失败');
    } finally {
      setLoading(false);
    }
  };

  // 查看日志详情
  const handleViewDetail = async (requestId: string) => {
    setDetailVisible(true);
    setDetailLoading(true);
    try {
      const response = await getLogDetail(requestId);
      setDetailData(response.data);
    } catch (error: any) {
      message.error(error.message || '加载日志详情失败');
    } finally {
      setDetailLoading(false);
    }
  };

  // 查看统计信息
  const handleViewStats = async () => {
    setStatsVisible(true);
    setStatsLoading(true);
    try {
      const values = form.getFieldsValue();
      const dateRange = values.dateRange;
      const response = await getLogStats(
        dateRange?.[0]?.toISOString(),
        dateRange?.[1]?.toISOString()
      );
      setStatsData(response.data);
    } catch (error: any) {
      message.error(error.message || '加载统计信息失败');
    } finally {
      setStatsLoading(false);
    }
  };

  // 搜索
  const handleSearch = () => {
    setPage(1);
    loadLogs({ page: 1 });
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setPage(1);
    loadLogs({ page: 1 });
  };

  // 表格列定义
  const columns: ColumnsType<LogEntry> = [
    {
      title: 'RequestID',
      dataIndex: 'requestId',
      key: 'requestId',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Text copyable style={{ fontSize: 12 }}>
          {text}
        </Text>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        const colorMap: Record<string, string> = {
          request: 'blue',
          response: 'green',
          error: 'red',
        };
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
      },
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 80,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      width: 300,
    },
    {
      title: '状态码',
      dataIndex: 'statusCode',
      key: 'statusCode',
      width: 100,
      render: (code) => {
        if (!code) return '-';
        const color = code >= 500 ? 'red' : code >= 400 ? 'orange' : 'green';
        return <Tag color={color}>{code}</Tag>;
      },
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      width: 120,
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.requestId)}
        >
          详情
        </Button>
      ),
    },
  ];

  useEffect(() => {
    loadLogs();
  }, [page, pageSize]);

  return (
    <div style={{ padding: 24 }}>
      <Card title="日志查询" style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item name="requestId" label="RequestID">
            <Input placeholder="请输入 RequestID" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="type" label="类型">
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Option value="request">请求</Option>
              <Option value="response">响应</Option>
              <Option value="error">错误</Option>
            </Select>
          </Form.Item>
          <Form.Item name="level" label="级别">
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Option value="error">错误</Option>
              <Option value="warn">警告</Option>
              <Option value="info">信息</Option>
              <Option value="debug">调试</Option>
            </Select>
          </Form.Item>
          <Form.Item name="method" label="方法">
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="PUT">PUT</Option>
              <Option value="DELETE">DELETE</Option>
              <Option value="PATCH">PATCH</Option>
            </Select>
          </Form.Item>
          <Form.Item name="url" label="URL">
            <Input placeholder="请输入 URL" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="statusCode" label="状态码">
            <Input placeholder="请输入状态码" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="dateRange" label="时间范围">
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: 380 }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button
                icon={<BarChartOutlined />}
                onClick={handleViewStats}
              >
                统计
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="requestId"
          scroll={{ x: 1400 }}
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

      {/* 日志详情弹窗 */}
      <Modal
        title="日志详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={1000}
        loading={detailLoading}
      >
        {detailData && (
          <div>
            <Descriptions title="基本信息" bordered column={2} size="small">
              <Descriptions.Item label="RequestID" span={2}>
                <Text copyable>{detailData.requestId}</Text>
              </Descriptions.Item>
            </Descriptions>

            {detailData.request && (
              <Card title="请求信息" size="small" style={{ marginTop: 16 }}>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="方法">
                    {detailData.request.method}
                  </Descriptions.Item>
                  <Descriptions.Item label="URL">
                    {detailData.request.url}
                  </Descriptions.Item>
                  <Descriptions.Item label="IP">
                    {detailData.request.ip}
                  </Descriptions.Item>
                  <Descriptions.Item label="时间">
                    {dayjs(detailData.request.timestamp).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="User-Agent" span={2}>
                    {detailData.request.userAgent}
                  </Descriptions.Item>
                  {detailData.request.body && (
                    <Descriptions.Item label="请求体" span={2}>
                      <Paragraph>
                        <pre style={{ maxHeight: 200, overflow: 'auto' }}>
                          {JSON.stringify(detailData.request.body, null, 2)}
                        </pre>
                      </Paragraph>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            )}

            {detailData.response && (
              <Card title="响应信息" size="small" style={{ marginTop: 16 }}>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="状态码">
                    <Tag
                      color={
                        detailData.response.statusCode! >= 500
                          ? 'red'
                          : detailData.response.statusCode! >= 400
                          ? 'orange'
                          : 'green'
                      }
                    >
                      {detailData.response.statusCode}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="响应时间">
                    {detailData.response.responseTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="时间" span={2}>
                    {dayjs(detailData.response.timestamp).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {detailData.error && (
              <Card
                title="错误信息"
                size="small"
                style={{ marginTop: 16 }}
                headStyle={{ backgroundColor: '#fff1f0' }}
              >
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="错误消息">
                    <Text type="danger">{detailData.error.message}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="状态码">
                    <Tag color="red">{detailData.error.statusCode}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="响应时间">
                    {detailData.error.responseTime}
                  </Descriptions.Item>
                  {detailData.error.stack && (
                    <Descriptions.Item label="堆栈信息">
                      <Paragraph>
                        <pre
                          style={{
                            maxHeight: 300,
                            overflow: 'auto',
                            backgroundColor: '#f5f5f5',
                            padding: 12,
                            borderRadius: 4,
                          }}
                        >
                          {detailData.error.stack}
                        </pre>
                      </Paragraph>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            )}

            {detailData.timeline && detailData.timeline.length > 0 && (
              <Card title="时间线" size="small" style={{ marginTop: 16 }}>
                <Table
                  dataSource={detailData.timeline}
                  columns={[
                    {
                      title: '类型',
                      dataIndex: 'type',
                      key: 'type',
                      render: (type) => {
                        const colorMap: Record<string, string> = {
                          request: 'blue',
                          response: 'green',
                          error: 'red',
                        };
                        return <Tag color={colorMap[type]}>{type}</Tag>;
                      },
                    },
                    {
                      title: '时间',
                      dataIndex: 'timestamp',
                      key: 'timestamp',
                      render: (text) =>
                        dayjs(text).format('YYYY-MM-DD HH:mm:ss.SSS'),
                    },
                    {
                      title: '消息',
                      dataIndex: 'message',
                      key: 'message',
                      ellipsis: true,
                    },
                  ]}
                  pagination={false}
                  size="small"
                  rowKey={(record, index) => `${record.type}-${index}`}
                />
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* 统计信息弹窗 */}
      <Modal
        title="日志统计"
        open={statsVisible}
        onCancel={() => setStatsVisible(false)}
        footer={null}
        width={800}
        loading={statsLoading}
      >
        {statsData && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic title="总日志数" value={statsData.total} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="请求数"
                    value={statsData.requestCount}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="错误数"
                    value={statsData.errorCount}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="错误率"
                    value={statsData.errorRate}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card title="状态码分布" size="small" style={{ marginBottom: 16 }}>
              <Table
                dataSource={Object.entries(statsData.statusCodeStats).map(
                  ([code, count]) => ({ code: Number(code), count })
                )}
                columns={[
                  {
                    title: '状态码',
                    dataIndex: 'code',
                    key: 'code',
                    render: (code) => {
                      const color =
                        code >= 500 ? 'red' : code >= 400 ? 'orange' : 'green';
                      return <Tag color={color}>{code}</Tag>;
                    },
                  },
                  { title: '数量', dataIndex: 'count', key: 'count' },
                ]}
                pagination={false}
                size="small"
                rowKey="code"
              />
            </Card>

            <Card title="Top 10 错误 URL" size="small">
              <Table
                dataSource={statsData.topErrorUrls}
                columns={[
                  {
                    title: 'URL',
                    dataIndex: 'url',
                    key: 'url',
                    ellipsis: true,
                  },
                  { title: '错误次数', dataIndex: 'count', key: 'count' },
                ]}
                pagination={false}
                size="small"
                rowKey="url"
              />
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LogsPage;
