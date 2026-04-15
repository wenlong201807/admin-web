import { lazy } from 'react';
import MainLayout from '@/components/Layout';

// 懒加载页面组件
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UserList = lazy(() => import('@/pages/User/List'));
const Certification = lazy(() => import('@/pages/Certification'));
const CertificationType = lazy(() => import('@/pages/CertificationType'));
const Content = lazy(() => import('@/pages/Content'));
const Report = lazy(() => import('@/pages/Report'));
const System = lazy(() => import('@/pages/System'));
const File = lazy(() => import('@/pages/File'));
const Mbti = lazy(() => import('@/pages/Mbti'));

// 路由配置
export const routes = [
  {
    path: '/login',
    element: <Login />,
    meta: {
      title: '登录',
      requireAuth: false,
    },
  },
  {
    path: '/',
    element: <MainLayout />,
    meta: {
      title: '首页',
      requireAuth: true,
    },
    children: [
      {
        path: '',
        element: <Dashboard />,
        meta: {
          title: '数据看板',
          requireAuth: true,
        },
      },
      {
        path: 'user',
        element: <UserList />,
        meta: {
          title: '用户管理',
          requireAuth: true,
        },
      },
      {
        path: 'certification',
        element: <Certification />,
        meta: {
          title: '认证审核',
          requireAuth: true,
        },
      },
      {
        path: 'certification-type',
        element: <CertificationType />,
        meta: {
          title: '认证类型',
          requireAuth: true,
        },
      },
      {
        path: 'content',
        element: <Content />,
        meta: {
          title: '内容管理',
          requireAuth: true,
        },
      },
      {
        path: 'report',
        element: <Report />,
        meta: {
          title: '举报管理',
          requireAuth: true,
        },
      },
      {
        path: 'system',
        element: <System />,
        meta: {
          title: '系统配置',
          requireAuth: true,
        },
      },
      {
        path: 'file',
        element: <File />,
        meta: {
          title: '图片管理',
          requireAuth: true,
        },
      },
      {
        path: 'mbti',
        element: <Mbti />,
        meta: {
          title: 'MBTI管理',
          requireAuth: true,
        },
      },
    ],
  },
];
