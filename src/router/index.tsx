import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { routes } from './routes';
import MainLayout from '@/components/Layout';
import { authStore } from '@/stores';

// 404 页面
const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '100px 0' }}>
    <h1>404</h1>
    <p>页面不存在</p>
  </div>
);

// 路由守卫组件
const RouteGuard = ({
  children,
  requireAuth,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) => {
  if (requireAuth && !authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// 渲染路由
const renderRoutes = (routeList: any) => {
  return routeList.map((route: any) => {
    const { path, element, children, meta } = route;
    // debugger;

    if (children) {
      return (
        <Route
          key={path}
          path={path}
          element={
            <RouteGuard requireAuth={meta?.requireAuth}>{element}</RouteGuard>
          }
        >
          {children.map((child: any) => (
            <Route
              key={child.path}
              path={child.path}
              element={
                <RouteGuard requireAuth={child.meta?.requireAuth}>
                  <Suspense fallback={<Spin size="large" />}>
                    {child.element}
                  </Suspense>
                </RouteGuard>
              }
            />
          ))}
        </Route>
      );
    }

    return (
      <Route
        key={path}
        path={path}
        element={
          <RouteGuard requireAuth={meta?.requireAuth}>
            <Suspense fallback={<Spin size="large" />}>{element}</Suspense>
          </RouteGuard>
        }
      />
    );
  });
};

const Router = () => {
  return (
    <Suspense
      fallback={
        <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
      }
    >
      <Routes>{renderRoutes(routes)}</Routes>
    </Suspense>
  );
};

export default Router;
