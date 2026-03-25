import { useState } from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AuditOutlined,
  FileTextOutlined,
  WarningOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../index.less';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '数据看板',
    },
    {
      key: '/user',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/certification',
      icon: <AuditOutlined />,
      label: '认证审核',
    },
    {
      key: '/content',
      icon: <FileTextOutlined />,
      label: '内容管理',
    },
    {
      key: '/report',
      icon: <WarningOutlined />,
      label: '举报管理',
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统配置',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>WeTogether</h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        inlineCollapsed={collapsed}
      />
    </div>
  );
};

export default Sidebar;
