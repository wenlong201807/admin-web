import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Tabs,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  message,
  Descriptions,
} from 'antd';
import { getReportList, handleReport } from '@/services/report';
import type { ColumnsType } from 'antd/es/table';

const ReportPage = () => {
  const [activeTab, setActiveTab] = useState('0');
  const [handleModalVisible, setHandleModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

  const fetchReports = async (status: number) => {
    setLoading(true);
    try {
      const res = await getReportList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        status,
      });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Fetch reports error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(parseInt(activeTab));
  }, [activeTab, pagination]);

  const handleReportAction = (report: any) => {
    setSelectedReport(report);
    setHandleModalVisible(true);
  };

  const handleReportSubmit = async (values: any) => {
    try {
      await handleReport(selectedReport.id, values);
      message.success('处理成功');
      setHandleModalVisible(false);
      fetchReports(parseInt(activeTab));
    } catch (error: any) {
      message.error(error.message || '处理失败');
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: '举报人',
      dataIndex: 'reporter',
      key: 'reporter',
      render: (_, record) => (
        <Space>
          <Avatar src={record.reporter.avatarUrl} />
          <span>{record.reporter.nickname}</span>
        </Space>
      ),
    },
    {
      title: '被举报人',
      dataIndex: 'post',
      key: 'post',
      render: (_, record) => (
        <Space>
          <Avatar src={record.post.user.avatarUrl} />
          <span>{record.post.user.nickname}</span>
        </Space>
      ),
    },
    {
      title: '举报原因',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: number) => {
        const reasonMap: Record<number, string> = {
          1: '色情',
          2: '暴力',
          3: '广告',
          4: '诈骗',
          5: '其他',
        };
        return reasonMap[reason] || '未知';
      },
    },
    {
      title: '举报描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '举报内容',
      dataIndex: 'post',
      key: 'postContent',
      render: (_, record) => (
        <div style={{ maxWidth: 200 }}>
          {record.post.content}
        </div>
      ),
    },
    {
      title: '举报时间',
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
        <Button type="link" size="small" onClick={() => handleReportAction(record)}>
          处理
        </Button>
      ),
    },
  ];

  return (
    <div className="report-page">
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="待处理" key="0" />
          <Tabs.TabPane tab="已处理" key="1" />
        </Tabs>

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
        title="处理举报"
        open={handleModalVisible}
        onCancel={() => setHandleModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedReport && (
          <Form onFinish={handleReportSubmit}>
            <Descriptions bordered column={1} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="举报人">
                {selectedReport.reporter.nickname}
              </Descriptions.Item>
              <Descriptions.Item label="被举报人">
                {selectedReport.post.user.nickname}
              </Descriptions.Item>
              <Descriptions.Item label="举报原因">
                {selectedReport.reason}
              </Descriptions.Item>
              <Descriptions.Item label="举报描述">
                {selectedReport.description}
              </Descriptions.Item>
              <Descriptions.Item label="举报内容">
                {selectedReport.post.content}
              </Descriptions.Item>
            </Descriptions>
            <Form.Item
              name="action"
              label="处理方式"
              rules={[{ required: true, message: '请选择处理方式' }]}
            >
              <Select>
                <Select.Option value="delete">删除帖子</Select.Option>
                <Select.Option value="ignore">忽略</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.action !== currentValues.action
              }
            >
              {({ getFieldValue }) =>
                getFieldValue('action') === 'delete' ? (
                  <Form.Item
                    name="deductPoints"
                    label="扣除积分"
                  >
                    <InputNumber
                      placeholder="可选"
                      min={0}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
                <Button onClick={() => setHandleModalVisible(false)}>
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

export default ReportPage;
