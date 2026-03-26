import { useEffect } from 'react';
import { Card, Form, InputNumber, Button, message, Row, Col } from 'antd';
import { observer } from 'mobx-react-lite';
import { configStore } from '@/stores';

const SystemPage = observer(() => {
  const [form] = Form.useForm();

  useEffect(() => {
    configStore.fetchConfig();
  }, []);

  useEffect(() => {
    form.setFieldsValue(configStore.config);
  }, [configStore.config, form]);

  const handleSave = async () => {
    const values = await form.validateFields();
    const configs = Object.entries(values)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => ({
        key,
        value: value as number,
      }));
    const result = await configStore.batchUpdate(configs);
    if (result.success) {
      message.success('配置保存成功');
    } else {
      message.error(result.message || '配置保存失败');
    }
  };

  return (
    <div className="system-page">
      <Card title="积分规则配置" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="points.register"
                label="注册赠送积分"
                rules={[{ required: true, message: '请输入注册赠送积分' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="points.sign"
                label="每日签到积分"
                rules={[{ required: true, message: '请输入每日签到积分' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="points.sign.continuous"
                label="连续签到额外积分"
                rules={[{ required: true, message: '请输入连续签到额外积分' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="points.publish"
                label="发布帖子积分"
                rules={[{ required: true, message: '请输入发布帖子积分' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="points.comment"
                label="评论积分"
                rules={[{ required: true, message: '请输入评论积分' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="points.like"
                label="点赞积分"
                rules={[{ required: true, message: '请输入点赞积分' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="points.invite"
                label="邀请注册积分"
                rules={[{ required: true, message: '请输入邀请注册积分' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="points.unlock_chat"
                label="解锁私聊积分"
                rules={[{ required: true, message: '请输入解锁私聊积分' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="系统参数配置" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="max_friend.base"
                label="基础好友上限"
                rules={[{ required: true, message: '请输入基础好友上限' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="max_friend.per_points"
                label="每100积分增加好友位"
                rules={[{ required: true, message: '请输入每100积分增加好友位' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="violation.max_count"
                label="最大违规次数"
                rules={[{ required: true, message: '请输入最大违规次数' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <Button type="primary" onClick={handleSave} loading={configStore.isSaving}>
          保存配置
        </Button>
      </Card>
    </div>
  );
});

export default SystemPage;
