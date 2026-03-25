import { observer } from 'mobx-react-lite';
import { Dropdown, Avatar, Space, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { authStore } from '@/stores';
import { useNavigate } from 'react-router-dom';
import '../index.less';

const Header = observer(() => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authStore.logout();
    message.success('退出登录成功');
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="header">
      <div className="header-left">
        <h3>管理后台</h3>
      </div>
      <div className="header-right">
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Space className="user-info">
            <Avatar icon={<UserOutlined />} />
            <span>{authStore.admin?.username}</span>
          </Space>
        </Dropdown>
      </div>
    </div>
  );
});

export default Header;
