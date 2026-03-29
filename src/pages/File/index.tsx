import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  DatePicker,
  message,
  Image,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getFileList, blockFile, unblockFile, batchBlockFile } from '@/services/file';
import type { FileRecord } from '@/services/file';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const FilePage = () => {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FileRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockForm] = Form.useForm();
  const [currentFile, setCurrentFile] = useState<FileRecord | null>(null);

  const fetchFiles = async (params?: any) => {
    setLoading(true);
    try {
      const searchValues = searchForm.getFieldsValue();
      const res = await getFileList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...searchValues,
        ...params,
        startDate: searchValues.dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: searchValues.dateRange?.[1]?.format('YYYY-MM-DD'),
      });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Fetch files error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [pagination]);

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    fetchFiles({ ...values, page: 1 });
  };

  const handleReset = () => {
    searchForm.resetFields();
    fetchFiles({ page: 1, pageSize: 20 });
  };

  const handleBlock = (file: FileRecord) => {
    setCurrentFile(file);
    blockForm.resetFields();
    setBlockModalVisible(true);
  };

  const handleBlockSubmit = async (values: any) => {
    try {
      await blockFile(currentFile!.id, values.reason);
      message.success('拉黑成功');
      setBlockModalVisible(false);
      fetchFiles();
    } catch (error: any) {
      message.error(error.message || '拉黑失败');
    }
  };

  const handleUnblock = async (file: FileRecord) => {
    try {
      await Modal.confirm({
        title: '确认解除拉黑',
        content: '确定要解除该图片的拉黑状态吗？',
      });
      await unblockFile(file.id);
      message.success('解除拉黑成功');
      fetchFiles();
    } catch (error: any) {
      if (error !== 'cancel') {
        message.error(error.message || '解除拉黑失败');
      }
    }
  };

  const handleBatchBlock = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要拉黑的图片');
      return;
    }
    try {
      await Modal.confirm({
        title: '确认批量拉黑',
        content: `确定要拉黑选中的 ${selectedRowKeys.length} 张图片吗？`,
      });
      await batchBlockFile(selectedRowKeys as number[]);
      message.success('批量拉黑成功');
      setSelectedRowKeys([]);
      fetchFiles();
    } catch (error: any) {
      message.error(error.message || '批量拉黑失败');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const columns: ColumnsType<FileRecord> = [
    {
      title: '预览',
      dataIndex: 'url',
      key: 'preview',
      width: 80,
      render: (url: string) => (
        <Image
          src={url}
          alt="preview"
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
          preview={{ mask: '预览' }}
        />
      ),
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '原始名称',
      dataIndex: 'originalName',
      key: 'originalName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 100,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '类型',
      dataIndex: 'mimeType',
      key: 'mimeType',
      width: 100,
    },
    {
      title: '上传者',
      dataIndex: 'uploadNickname',
      key: 'uploadNickname',
      width: 120,
      render: (nickname: string, record: FileRecord) => (
        `${nickname || '-'} (ID: ${record.uploadUserId})`
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '已拉黑'}
        </Tag>
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_: any, record: FileRecord) => (
        <Space>
          {record.status === 1 ? (
            <Button type="link" danger onClick={() => handleBlock(record)}>
              拉黑
            </Button>
          ) : (
            <Button type="link" onClick={() => handleUnblock(record)}>
              解除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Select.Option value={1}>正常</Select.Option>
              <Select.Option value={0}>已拉黑</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="文件名/上传者" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item name="dateRange" label="日期">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>

        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" danger onClick={handleBatchBlock}>
              批量拉黑 ({selectedRowKeys.length})
            </Button>
          </div>
        )}

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
        />
      </Card>

      <Modal
        title="拉黑图片"
        open={blockModalVisible}
        onCancel={() => setBlockModalVisible(false)}
        onOk={() => blockForm.submit()}
      >
        <Form form={blockForm} onFinish={handleBlockSubmit}>
          <Form.Item name="reason" label="拉黑原因">
            <Input.TextArea rows={3} placeholder="请输入拉黑原因" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FilePage;
