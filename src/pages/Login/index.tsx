import { useState } from 'react';
import { Form, Input, Button, Card, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { authStore } from '@/stores';
import './index.less';

const LoginPage = observer(() => {
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; password: string; emailCode: string }) => {
    setLoading(true);
    try {
      const result = await authStore.login(values.username, values.password, values.emailCode);
      if (result.success) {
        message.success('登录成功');
        navigate('/');
      } else {
        message.error(result.message || '登录失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    setSendingCode(true);
    try {
      const result = await authStore.sendEmailCode();
      if (result.success) {
        message.success('验证码已发送到管理员邮箱');
        // 开始 60 秒倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        message.error(result.message || '发送失败');
      }
    } finally {
      setSendingCode(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" title={`WeTogether 管理后台 - ${import.meta.env.VITE_APP_TITLE.replace('管理后台-', '')}`}>
        <Form name="login" form={form} onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="emailCode"
            rules={[{ required: true, message: '请输入邮箱验证码' }]}
          >
            <Row gutter={8}>
              <Col flex="auto">
                <Input prefix={<MailOutlined />} placeholder="邮箱验证码" maxLength={6} />
              </Col>
              <Col>
                <Button
                  onClick={handleSendCode}
                  loading={sendingCode}
                  disabled={countdown > 0}
                  style={{ width: 130 }}
                >
                  {countdown > 0 ? `${countdown}s 后重发` : '发送验证码'}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
});

export default LoginPage;
