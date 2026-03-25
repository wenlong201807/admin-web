import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores';
import Header from './Header';
import Sidebar from './Sidebar';
import './index.less';

const MainLayout = observer(() => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
});

export default MainLayout;
