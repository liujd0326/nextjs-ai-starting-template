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
- **Tailwind CSS v4** - 最新版本原子化 CSS 框架
- **Motion** (Framer Motion v12) - 动画库，用于页面转场和交互动画
- **next-themes** - 深色/浅色主题切换支持
- **Sonner** - Toast 通知组件
- 响应式设计，移动端优先

### 支付系统

- **Stripe** - 主要支付提供商，支持订阅和一次性支付
- **Creem & PayPal** - 备用支付提供商（配置中）
- 多支付提供商架构，易于扩展
- Webhook 处理，自动同步支付状态
- 积分系统，支持订阅积分和一次性购买积分

### 存储与部署

- **Cloudflare R2** - 静态资源存储（图片、生成内容）
- **Cloudflare Workers** - 边缘计算部署
- **OpenNext.js** - Cloudflare 部署适配器
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

# 开发（带热重载）
pnpm dev

# 开发（包含 webhook 测试）
pnpm dev:all

# 代码检查和格式化
pnpm lint:format

# 构建项目
pnpm build

# 部署到 Cloudflare
pnpm deploy

# 数据库相关
pnpm db:push      # 推送 schema 变更
pnpm db:migrate   # 运行迁移
pnpm db:generate  # 生成类型
pnpm db:studio    # 打开数据库管理界面
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
- **积分/额度系统**:
  - 月度积分（订阅用户）
  - 一次性购买积分（永久有效）
  - 自动重置和到期管理
- **订阅管理**:
  - Free、Starter、Pro 和 Credits Pack 套餐
  - 月付/年付选项
  - 自动续费和取消管理
- 使用历史记录
- 完整的支付和订阅生命周期管理

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

## 数据库设计

### 核心表结构

- **user** - 用户信息，包含计划、积分和重置日期
- **subscriptions** - 订阅记录，支持多支付提供商
- **payments** - 支付记录，追踪所有交易
- **userCredits** - 用户积分详情，支持不同类型和到期管理
- **webhookEvents** - Webhook 事件记录，防重复处理
- **session/account/verification** - Better Auth 认证相关表

### 枚举定义

- **subscriptionStatusEnum**: active, canceled, past_due, unpaid, trialing, paused
- **paymentProviderEnum**: stripe, creem, paypal
- **paymentStatusEnum**: pending, succeeded, failed, canceled, refunded
- **subscriptionPlanEnum**: free, starter, pro, credits_pack

## 环境变量配置

### 必需配置

```bash
# 应用基础配置
NEXT_PUBLIC_APP_NAME="AI Template"
BETTER_AUTH_SECRET="your-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"
DATABASE_URL="your-neon-db-url"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# 支付配置
DEFAULT_PAYMENT_PROVIDER="stripe"
NEXT_PUBLIC_ENABLE_YEARLY_PRICING="true"
```

### Stripe 配置

```bash
# 测试环境
STRIPE_SECRET_KEY_TEST="sk_test_..."
STRIPE_WEBHOOK_SECRET_TEST="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST="pk_test_..."

# 生产环境
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# 价格 ID 配置
STRIPE_PRICE_STARTER_MONTHLY_TEST="price_test_starter_monthly"
STRIPE_PRICE_STARTER_YEARLY_TEST="price_test_starter_yearly"
STRIPE_PRICE_PRO_MONTHLY_TEST="price_test_pro_monthly"
STRIPE_PRICE_PRO_YEARLY_TEST="price_test_pro_yearly"
STRIPE_PRICE_CREDITS_PACK_TEST="price_test_credits_pack"
```

## 支付系统架构

### 多支付提供商设计

- **BasePaymentProvider** - 抽象基类定义通用接口
- **StripeProvider** - Stripe 实现
- **PaymentProviderFactory** - 工厂模式创建提供商实例
- **PaymentService** - 统一业务逻辑层

### 主要功能

1. **订阅管理** - 创建、更新、取消订阅
2. **一次性支付** - 积分包购买
3. **Webhook 处理** - 自动同步支付状态
4. **积分系统** - 月度重置和永久积分
5. **客户管理** - 跨平台客户信息同步

### 支付流程

1. 用户选择套餐或积分包
2. Server Action 创建支付会话
3. 重定向到支付提供商页面
4. 支付完成后 Webhook 通知
5. 系统自动更新用户状态和积分

## 项目结构详解

### 应用路由 (`src/app`)

- `(auth)/` - 认证相关页面
- `(dashboard)/` - 仪表板和订阅管理
- `(marketing)/` - 营销页面（定价、支付成功等）
- `api/` - API 路由（认证端点、Webhooks）

### 模块化架构 (`src/modules`)

- `auth/` - 认证模块
- `dashboard/` - 仪表板模块
- `legal/` - 法律条款模块
- `payment/` - 支付系统模块（完整实现）
- `pricing/` - 定价展示模块

### 支付模块结构

```
src/modules/payment/
├── actions/          # Server Actions
├── components/       # UI 组件
├── providers/        # 支付提供商实现
├── services/         # 业务逻辑服务
├── types/           # TypeScript 类型
├── utils/           # 工具函数
└── views/           # 视图组件
```

## 开发注意事项

### 支付系统

- 测试时使用测试环境的 API 密钥
- Webhook 端点需要 HTTPS（本地使用 ngrok）
- 支付金额以分为单位存储
- 所有支付操作都需要幂等性检查

### 数据库操作

- 使用事务处理复杂操作
- 支付相关操作必须有错误处理和回滚
- 定期清理过期的 Webhook 事件
- 积分操作需要原子性保证

### 安全考虑

- Webhook 签名验证是必需的
- 支付金额和用户 ID 必须严格验证
- 敏感信息不得记录在日志中
- API 访问需要适当的权限检查

### 错误处理

- 支付失败需要友好的用户提示
- Webhook 处理失败需要重试机制
- 积分不足时给出明确的升级指引
- 订阅状态异常需要客服介入流程

## 注意事项

- 所有用户输入都需要验证和清理
- 图片处理需要考虑文件大小和格式
- AI API 调用需要实现重试机制和错误处理
- 定期清理临时文件和过期数据
- 遵循 Cloudflare Workers 的资源限制
- 支付相关操作务必确保数据一致性和安全性
