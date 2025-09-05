# AI SaaS 工具站项目指导

## 项目概述

这是一个基于 Next.js 15 的 AI SaaS 工具站，提供文生图、图生图等 AI 功能服务。项目使用现代化的技术栈，注重移动端体验和性能优化。

**语言**: 网站默认使用英语，所有UI文本、提示信息、错误消息等都应该是英文。

## 技术栈

### 核心框架

- **Next.js 15** with App Router
- **TypeScript** - 强类型支持
- **React 19** - 服务端组件和客户端组件混合使用

### 数据库与 ORM

- **Neon** - PostgreSQL 数据库
- **Drizzle ORM** - 类型安全的 ORM，优先使用 schema-first 方法
- 数据库迁移使用 `drizzle-kit`

### 认证系统

- **Better Auth** - 现代化认证解决方案
- 仅支持 **Google OAuth** 登录
- 在 Server Components 中进行认证检查

### UI 与样式

- **shadcn/ui** - 组件库，基于 Radix UI
- **Tailwind CSS** - 原子化 CSS 框架
- **Framer Motion** - 动画库，用于页面转场和交互动画
- 响应式设计，移动端优先

### 存储与部署

- **Cloudflare R2** - 静态资源存储（图片、生成内容）
- **Cloudflare Workers** - 边缘计算部署
- CDN 加速和全球分发

## 开发环境配置

### 包管理工具

- **pnpm** - 项目使用 pnpm 作为包管理工具，请统一使用 pnpm 命令
- **代码质量检查**: 使用 `pnpm lint:format` 进行 ESLint 检查和代码格式化
- **本地服务**: 开发者会自行启动本地开发服务，无需协助启动

### 常用命令

```bash
# 安装依赖
pnpm install

# 代码检查和格式化
pnpm lint:format

# 构建项目
pnpm build

# 数据库迁移
pnpm db:migrate

# 生成数据库类型
pnpm db:generate
```

## 开发规范

### 代码风格

- 使用 **函数式组件** 和 **React Hooks**
- 优先使用 **Server Components**，仅在需要交互时使用 Client Components
- 组件文件使用 **PascalCase**，其他文件使用 **kebab-case**
- 变量和函数使用 **camelCase**
- **组件定义**: 使用箭头函数定义组件，最后使用 `export default` 导出

### 组件组织

- **页面路由**: `app/` 目录下的页面组件作为 **Server Components**，负责认证检查和数据获取
- **模块化架构**: 真正的页面组件放在 `src/modules/` 下，按功能模块组织：
  - `src/modules/[module]/views/` - 页面视图组件（可以是 Client 或 Server Component）
  - `src/modules/[module]/components/` - 模块内组件
  - `src/modules/[module]/actions/` - Server Actions
- **通用组件**: 可复用的 UI 组件放在 `src/components/` 目录下
- UI 组件使用 shadcn/ui，自定义组件继承其设计规范
- 每个复杂组件都要有对应的 TypeScript 接口定义

### 数据库规范

- 使用 Drizzle schema 定义表结构
- 表名使用 **snake_case**
- 字段名使用 **camelCase**（在 schema 中）
- 必须包含 `createdAt` 和 `updatedAt` 字段
- 使用 UUID 作为主键

### API 设计

- **优先使用 Server Actions**: 数据操作放在 `src/modules/[module]/actions/` 目录下
- **API Routes 仅用于必需场景**: `app/api/` 目录仅用于特殊需求：
  - Better Auth 认证端点
  - Stripe Webhook 等第三方回调
  - 需要自定义 HTTP 响应的场景
- 使用 TypeScript 定义请求和响应类型
- 实现适当的错误处理和状态码
- 支持流式响应（适用于 AI 生成场景）

## 业务逻辑

### AI 功能

- **文生图**: 文本到图像生成
- **图生图**: 图像到图像转换
- 支持多种 AI 模型和参数配置
- 实现队列机制处理长时间任务

### 用户系统

- **Google OAuth 登录**: 仅支持 Google 账号登录，无传统注册流程
- 登录后自动将用户信息记录到数据库
- 积分/额度系统
- 使用历史记录
- 订阅和付费功能

### 文件管理

- 图片上传到 Cloudflare R2
- 自动生成缩略图和优化
- CDN 加速访问
- 文件元数据存储在数据库

### 响应式设计

- 移动端优先设计
- 触摸友好的交互
- 适配不同屏幕尺寸
- 性能优化（图片懒加载、代码分割）

## 技术约束

### 性能要求

- 首屏加载时间 < 2 秒
- 图片优化使用 Next.js Image 组件
- 实现适当的缓存策略
- 使用 Suspense 和 loading 状态

### 安全考虑

- 在 Server Components 中使用 Better Auth 进行认证检查
- 输入验证和数据清理
- 文件上传大小和类型限制
- API 速率限制

### 移动端适配

- 响应式布局，支持 320px 到 1920px+ 屏幕
- 触摸手势支持
- 移动端专用的 UI 组件
- PWA 特性支持

### 部署要求

- 兼容 Cloudflare Workers 环境
- 环境变量配置管理
- 生产环境优化构建
- 错误监控和日志记录

## 常用模式

### 页面结构模式

```typescript
// app/dashboard/page.tsx - 页面路由组件
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardView } from '@/modules/dashboard/views/dashboard-view';
import { getUserData } from '@/modules/dashboard/actions/get-user-data';

const DashboardPage = async () => {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const userData = await getUserData(session.user.id);

  return <DashboardView user={session.user} userData={userData} />;
};

export default DashboardPage;
```

### Server Actions 模式

```typescript
// src/modules/dashboard/actions/get-user-data.ts
"use server";
import { db } from "@/lib/db";

export const getUserData = async (userId: string) => {
  const data = await db.select().from(users).where(eq(users.id, userId));
  return data;
};
```

### 模块组件结构

```typescript
// src/modules/dashboard/views/dashboard-view.tsx
interface DashboardViewProps {
  user: User;
  userData: UserData;
}

export const DashboardView = ({ user, userData }: DashboardViewProps) => {
  return (
    <div>
      {/* 页面内容 */}
    </div>
  );
};
```

### 响应式组件

```typescript
// 使用 Tailwind 实现响应式设计
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 内容 */}
</div>
```

### 动画效果

```typescript
// 使用封装的 Motion 组件
import { MotionDiv, MotionSection, MotionH1 } from '@/components/motion-wrapper';

<MotionDiv
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* 内容 */}
</MotionDiv>

<MotionH1
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4 }}
>
  标题内容
</MotionH1>
```

**可用组件**: `MotionDiv`, `MotionSection`, `MotionH1`, `MotionH2`, `MotionH3`, `MotionP`, `MotionSpan`
**注意**: 如需要其他 HTML 元素的动画版本，可以继续在 `src/components/motion-wrapper.tsx` 中添加

## 注意事项

- 所有用户输入都需要验证和清理
- 图片处理需要考虑文件大小和格式
- AI API 调用需要实现重试机制和错误处理
- 定期清理临时文件和过期数据
- 遵循 Cloudflare Workers 的资源限制
