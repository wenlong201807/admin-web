import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Tabs,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Image,
  message,
} from 'antd';
import { observer } from 'mobx-react-lite';
import { getCertificationList, reviewCertification } from '@/services/certification';
import type { ColumnsType } from 'antd/es/table';

const CertificationPage = observer(() => {
  const [activeTab, setActiveTab] = useState('0');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

  const fetchCertifications = async (status: number) => {
    setLoading(true);
    try {
      const res = await getCertificationList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        status,
      });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Fetch certifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications(parseInt(activeTab));
  }, [activeTab, pagination]);

  const handleReview = (cert: any) => {
    setSelectedCert(cert);
    setReviewModalVisible(true);
  };

  const handleReviewSubmit = async (values: any) => {
    try {
      await reviewCertification(selectedCert.id, values);
      message.success(values.status === 1 ? '审核通过' : '审核拒绝');
      setReviewModalVisible(false);
      fetchCertifications(parseInt(activeTab));
    } catch (error: any) {
      message.error(error.message || '审核失败');
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar src={record.user.avatarUrl} />
          <div>
            <div>{record.user.nickname}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {record.user.mobile}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '认证类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          house: '房产认证',
          education: '学历认证',
          id_card: '身份认证',
          business: '企业认证',
          driver: '驾照认证',
          utility: '水电费认证',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '认证图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url: string) => (
        <Image src={url} width={60} height={60} style={{ objectFit: 'cover' }} />
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '提交时间',
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
          <Button type="link" size="small" onClick={() => handleReview(record)}>
            审核
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="certification-page">
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="待审核" key="0" />
          <Tabs.TabPane tab="已通过" key="1" />
          <Tabs.TabPane tab="已拒绝" key="2" />
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
        title="审核认证"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedCert && (
          <Form onFinish={handleReviewSubmit}>
            <Form.Item label="用户">
              <Space>
                <Avatar src={selectedCert.user.avatarUrl} />
                <span>{selectedCert.user.nickname}</span>
              </Space>
            </Form.Item>
            <Form.Item label="认证类型">
              <span>{selectedCert.type}</span>
            </Form.Item>
            <Form.Item label="认证图片">
              <Image src={selectedCert.imageUrl} width={200} />
            </Form.Item>
            <Form.Item label="描述">
              <span>{selectedCert.description}</span>
            </Form.Item>
            <Form.Item
              name="status"
              label="审核结果"
              rules={[{ required: true, message: '请选择审核结果' }]}
            >
              <Select>
                <Select.Option value={1}>通过</Select.Option>
                <Select.Option value={2}>拒绝</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.status !== currentValues.status
              }
            >
              {({ getFieldValue }) =>
                getFieldValue('status') === 2 ? (
                  <Form.Item
                    name="rejectReason"
                    label="拒绝原因"
                    rules={[{ required: true, message: '请输入拒绝原因' }]}
                  >
                    <Input.TextArea rows={3} placeholder="请输入拒绝原因" />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
                <Button onClick={() => setReviewModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
});

export default CertificationPage;
