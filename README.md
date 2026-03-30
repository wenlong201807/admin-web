# WeTogether Admin 管理后台

基于 React + TypeScript + Ant Design + MobX 的管理后台系统。

## 技术栈

- **React 18** - UI 框架
- **TypeScript 5** - 类型安全
- **Ant Design 5** - UI 组件库
- **MobX 6** - 状态管理
- **Vite 5** - 构建工具
- **React Router 6** - 路由管理
- **Axios** - HTTP 客户端
- **Day.js** - 日期处理

## 环境配置

项目支持三个环境：开发环境、测试环境、生产环境。

### 环境变量配置

#### 开发环境 (.env.development)

```bash
VITE_API_BASE_URL=http://localhost:3018/api/v1
VITE_APP_TITLE=WeTogether Admin
VITE_APP_ENV=development
VITE_APP_PORT=5173
VITE_APP_BASE_URL=/
VITE_UPLOAD_MAX_SIZE=10485760
VITE_UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf
```

#### 测试环境 (.env.staging)

```bash
VITE_API_BASE_URL=https://staging-api.wertogether.com/api/v1
VITE_APP_TITLE=WeTogether Admin (Staging)
VITE_APP_ENV=staging
VITE_APP_PORT=5173
VITE_APP_BASE_URL=/admin/
VITE_UPLOAD_MAX_SIZE=10485760
VITE_UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf
```

#### 生产环境 (.env.production)

```bash
VITE_API_BASE_URL=https://api.wertogether.com/api/v1
VITE_APP_TITLE=WeTogether Admin
VITE_APP_ENV=production
VITE_APP_PORT=5173
VITE_APP_BASE_URL=/admin/
VITE_UPLOAD_MAX_SIZE=10485760
VITE_UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf
```

### 可用脚本

#### 开发环境

```bash
pnpm dev              # 启动开发环境
pnpm build:dev        # 构建开发环境
pnpm preview:dev      # 预览开发环境构建结果
```

#### 测试环境

```bash
pnpm dev:staging      # 启动测试环境
pnpm build:staging    # 构建测试环境
pnpm preview:staging  # 预览测试环境构建结果
```

#### 生产环境

```bash
pnpm build:prod       # 构建生产环境
pnpm preview:prod     # 预览生产环境构建结果
```

#### 其他脚本

```bash
pnpm build            # 默认构建
pnpm preview          # 默认预览
pnpm lint             # 代码检查
pnpm format           # 代码格式化
```

### 环境切换

在开发过程中，可以通过以下命令切换环境：

- 开发环境：`pnpm dev`
- 测试环境：`pnpm dev:staging`
- 生产环境：`pnpm dev:prod`

### 注意事项

1. 所有环境变量必须以 `VITE_` 开头才能在 Vite 中使用
2. 生产环境构建时会自动禁用 source map
3. 不同环境的 API 地址需要根据实际情况配置
4. 上传文件大小限制和允许的文件类型可以根据需求调整

## 功能模块

- ✅ 登录认证
- ✅ 数据看板
- ✅ 用户管理
- ✅ 认证审核
- ✅ 内容管理
- ✅ 举报管理
- ✅ 系统配置

## 快速开始

### 环境要求

- Node.js 18.x+
- pnpm 8.x+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 项目结构

```
admin-web/
├── public/                      # 静态资源
├── src/
│   ├── assets/                  # 资源文件
│   │   ├── images/
│   │   └── styles/
│   ├── components/              # 公共组件
│   │   └── Layout/              # 布局组件
│   ├── pages/                   # 页面组件
│   │   ├── Login/               # 登录页
│   │   ├── Dashboard/           # 数据看板
│   │   ├── User/                # 用户管理
│   │   ├── Certification/       # 认证审核
│   │   ├── Content/             # 内容管理
│   │   ├── Report/              # 举报管理
│   │   └── System/              # 系统配置
│   ├── stores/                  # MobX 状态管理
│   ├── services/                # API 服务
│   ├── utils/                   # 工具函数
│   ├── router/                  # 路由配置
│   ├── types/                   # TypeScript 类型定义
│   ├── App.tsx                  # 根组件
│   └── main.tsx                 # 应用入口
├── .env.development             # 开发环境变量
├── .env.production              # 生产环境变量
├── vite.config.ts               # Vite 配置
└── package.json
```

## 环境变量

### 开发环境 (.env.development)

```bash
VITE_API_BASE_URL=http://localhost:3018/api/v1
VITE_APP_TITLE=WeTogether Admin
VITE_APP_ENV=development
```

### 生产环境 (.env.production)

```bash
VITE_API_BASE_URL=https://api.wertogether.com/api/v1
VITE_APP_TITLE=WeTogether Admin
VITE_APP_ENV=production
```

## API 接口

### 基础信息

- **开发环境**: http://localhost:3018/api/v1
- **生产环境**: https://api.wertogether.com/api/v1
- **认证方式**: Bearer Token

### 主要接口

| 模块 | 接口                                 | 说明         |
| ---- | ------------------------------------ | ------------ |
| 认证 | POST /admin/auth/login               | 管理员登录   |
| 用户 | GET /admin/users                     | 获取用户列表 |
| 用户 | POST /admin/users/:userId/points     | 调整用户积分 |
| 用户 | PUT /admin/users/:userId/status      | 更新用户状态 |
| 认证 | GET /admin/certifications            | 获取认证列表 |
| 认证 | PUT /admin/certifications/:id/review | 审核认证     |
| 内容 | GET /admin/posts                     | 获取内容列表 |
| 内容 | DELETE /admin/posts/:id              | 删除内容     |
| 举报 | GET /admin/reports                   | 获取举报列表 |
| 举报 | PUT /admin/reports/:id/handle        | 处理举报     |
| 配置 | GET /admin/config                    | 获取系统配置 |
| 配置 | PUT /admin/config                    | 更新系统配置 |
| 统计 | GET /admin/statistics                | 获取统计数据 |

## 默认账号

### 管理员账号

- 用户名: `admin`
- 密码: `admin123`

## 开发规范

### 命名规范

- **组件**: PascalCase (如 `UserList`)
- **函数**: camelCase (如 `getUserInfo`)
- **常量**: UPPER_SNAKE_CASE (如 `API_BASE_URL`)
- **类型/接口**: PascalCase (如 `UserInfo`)

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Airbnb JavaScript 风格指南
- 使用 TypeScript 类型注解

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

## 部署

### Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 传统部署

```bash
# 构建生产版本
pnpm build

# 部署到服务器
scp -r dist/* user@server:/var/www/wetogether-admin/
```

## 常见问题

### 端口被占用

修改 `vite.config.ts` 中的端口配置：

```typescript
server: {
  port: 5174, // 改为其他端口
}
```

### 接口请求失败

1. 确保后端服务已启动
2. 检查 `.env.development` 中的 `VITE_API_BASE_URL` 配置
3. 检查 Vite 代理配置

### MobX 状态不更新

确保：

1. 组件使用 `observer` 包裹
2. Store 使用 `makeAutoObservable`
3. 异步操作使用 `runInAction`

## 许可证

MIT

## 联系方式

如有问题，请联系开发团队。
