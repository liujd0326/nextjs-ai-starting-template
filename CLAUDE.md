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
- **React Icons** - 图标库
- 响应式设计，移动端优先

### AI 集成

- **Replicate** - AI 图像生成平台
- 支持文生图和图生图功能
- face-to-many 风格转换模型
- 实时状态追踪和结果存储

### 支付系统

- **Stripe** - 主要支付提供商，支持月付订阅和一次性积分购买
- 简化架构，用户订阅信息直接存储在 user 表
- Stripe Webhook 处理，自动同步支付状态
- 积分系统，支持月度积分重置和永久积分

### 存储与部署

- **Cloudflare R2** - 静态资源存储（AI 生成图片、用户上传文件）
- **AWS SDK S3 Client** - 与 R2 交互的 S3 兼容客户端
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

### AI 功能（Replicate 集成）

- **文生图**: 使用 Replicate API 进行文本到图像生成
- **图生图**: 支持 face-to-many 风格转换，将输入人像转换为多种风格
- **生成历史**: 完整的生成记录和状态管理
- **积分消耗**: 每次生成消耗 1 积分，实时追踪余额
- **多模型支持**: 支持配置不同的 AI 模型和参数

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

- **user** - 用户信息，包含计划、积分和订阅信息
- **userCredits** - 用户积分明细记录，支持不同类型和到期管理
- **aiGenerations** - AI 生成历史记录，包含文生图和图生图
- **webhookEvents** - Webhook 事件记录，防重复处理
- **session/account/verification** - Better Auth 认证相关表

### 枚举定义

- **subscriptionPlanEnum**: free, starter, pro, credits_pack
- **generationStatusEnum**: pending, processing, completed, failed
- **generationTypeEnum**: text_to_image, image_to_image

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
```

### Stripe 配置

```bash
# Stripe 密钥（测试或生产环境）
STRIPE_SECRET_KEY="sk_test_..." # 或 sk_live_... 用于生产环境
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." # 或 pk_live_... 用于生产环境

# Stripe 价格 ID 配置
STRIPE_PRICE_STARTER_MONTHLY="price_test_starter_monthly" # 或 price_live_starter_monthly 用于生产环境
STRIPE_PRICE_PRO_MONTHLY="price_test_pro_monthly" # 或 price_live_pro_monthly 用于生产环境
STRIPE_PRICE_CREDITS_PACK="price_test_credits_pack" # 或 price_live_credits_pack 用于生产环境

# Replicate AI
REPLICATE_API_TOKEN="r8_..."
```

## 支付系统架构（简化版）

### 系统设计

- **Stripe 为主**: 主要使用 Stripe 作为支付提供商
- **简化架构**: 用户订阅信息直接存储在 user 表中
- **userCredits 表**: 用于详细的积分记录和历史追踪
- **webhookEvents 表**: 防止 Webhook 事件重复处理

### 主要功能

1. **订阅管理** - 创建、取消月付订阅（不支持年付）
2. **一次性支付** - 积分包购买，积分永不过期
3. **Webhook 处理** - Stripe Webhook 自动同步支付状态
4. **积分系统** - 月度积分重置 + 购买积分管理
5. **订阅管理** - 直接在 user 表中管理订阅状态

### 支付流程

1. 用户选择 Starter/Pro 月付订阅或积分包
2. Server Action 创建 Stripe Checkout Session
3. 重定向到 Stripe 支付页面
4. 支付完成后 Stripe Webhook 通知
5. 系统更新 user 表和创建 userCredits 记录

## 项目结构详解

### 应用路由 (`src/app`)

- `(auth)/` - 认证相关页面
- `(dashboard)/` - 仪表板和订阅管理
- `(marketing)/` - 营销页面（定价、支付成功等）
- `api/` - API 路由（认证端点、Webhooks）

### 模块化架构 (`src/modules`)

- `auth/` - 认证模块
- `contact/` - 联系我们模块
- `dashboard/` - 仪表板模块
- `legal/` - 法律条款模块（包含 DMCA 政策）
- `payment/` - 支付系统模块（完整实现）
- `pricing/` - 定价展示模块
- `replicate/` - AI 图像生成模块（文生图、图生图）

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

## 文件存储系统 (Cloudflare R2)

### R2 上传功能

项目集成了 Cloudflare R2 对象存储服务，用于处理图片和文件上传。

### 配置要求

```bash
# Cloudflare R2 配置
R2_ACCOUNT_ID=你的32位账户ID
R2_ACCESS_KEY_ID=访问密钥ID
R2_SECRET_ACCESS_KEY=秘密访问密钥
R2_BUCKET_NAME=你的存储桶名称
R2_PUBLIC_URL=https://你的域名.com  # 自定义域名或 R2 提供的公共 URL
```

### Next.js 图片域名配置

需要在 `next.config.ts` 中配置允许的图片域名：

```typescript
const nextConfig: NextConfig = {
  images: {
    domains: ["your-bucket.r2.dev"], // 添加你的 R2 域名
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
};
```

### 核心上传方法

**文件位置**: `src/lib/storage/r2.ts`

```typescript
import { uploadToR2 } from "@/lib/storage/r2";

// 基本上传
const result = await uploadToR2(file);

// 上传到指定文件夹
const result = await uploadToR2(file, "images");

// 指定文件名
const result = await uploadToR2(file, "uploads", "my-file.jpg");
```

**返回值**:

```typescript
interface UploadResult {
  url: string; // 公开访问的 URL
  key: string; // 文件在 R2 中的唯一标识
}
```

### 技术特性

- **S3 兼容**: 使用 @aws-sdk/client-s3 的 S3Client 与 R2 交互
- **唯一文件名**: 使用 uuid v4 生成唯一文件名避免冲突
- **内容类型检测**: 自动检测和设置正确的 MIME 类型
- **错误处理**: 完整的错误处理和环境变量验证
- **延迟初始化**: 客户端在需要时创建，避免连接复用问题

### 使用场景

- AI 生成图片的存储
- 用户头像上传
- 文档和媒体文件存储
- 任何需要公开访问的静态资源

### 安全注意事项

- 确保 R2 访问密钥安全存储
- 对上传文件进行大小和类型限制
- 定期清理不再使用的文件
- 考虑实现文件访问权限控制

## Replicate AI 集成详情

### 配置要求

```bash
# Replicate API Token
REPLICATE_API_TOKEN="r8_..."
```

### 主要功能

- **图生图模型**: `flux-kontext-apps/face-to-many-kontext`
- **状态管理**: pending → processing → completed/failed
- **结果存储**: 生成的图片保存到 Cloudflare R2
- **积分系统**: 每次生成消耗用户积分

### 数据流程

1. 用户上传图片和设置参数
2. 系统检查用户积分余额
3. 创建 aiGenerations 记录
4. 调用 Replicate API 启动生成
5. 定期轮询生成状态
6. 生成完成后下载并上传到 R2
7. 更新生成记录和用户积分

## 注意事项

- 所有用户输入都需要验证和清理
- AI 生成需要实现异步处理和状态追踪
- 图片处理需要考虑文件大小限制（10MB）
- 定期清理失败的生成记录和临时文件
- 遵循 Cloudflare Workers 的资源限制
- 支付相关操作务必确保数据一致性和安全性
- R2 上传的文件使用 UUID 生成唯一文件名

[# AI 编程核心准则 v3.0]

## 0. 核心全局规则 (Core Global Rules) - 最高优先级

- **语言协议 (Language Protocol):** 所有输出，包括代码、注释、解释和任何形式的交流，**必须且只能使用简体中文**。此规则无任何例外。

## 1. 交互原则 (Interaction Protocol)

- 提交权限 (Commitment Authority): 绝对不能在没有得到我的明确许可的情况下提交任何代码。

- 任务处理流程 (Task Processing Flow): 在开始任何任务前，首先评估其性质。如果任务是**简单的、一步到位的**，直接执行。如果任务**不是显而易见的**，并且其本质需要**规划、分析或迭代**，则必须使用 `sequential-thinking`。

- 任务范围 (Task Scope): 除非特别说明，否则绝不创建文档、编写测试、编译或运行代码，也不要对你的工作进行总结。

## 2. 核心哲学 (Guiding Philosophy)

- 单一职责 (Single Responsibility): 一个函数只做一件事。但是，如果拆分会让逻辑更混乱，就不要拆分。**清晰性是最终的判断标准**。

- 接口清晰 (Clear Interfaces): 模块化是为了简化，不是为了增加理解成本。你的目标是让代码的调用变得直观易懂。

- 减少依赖 (Minimize Dependencies): 优先编写自包含的代码。在“复用性”和“简洁性”产生冲突时，**永远优先选择简洁**。

- 避免过度设计 (Avoid Over-engineering): 当代码只服务于当前唯一场景时，用最简单直接的方式实现。**先解决眼前的问题，只在必要时进行重构**。

## 3. 编码风格 (Specific Style Guide)

- 文件命名规范 (File Naming Standard): 所有代码文件必须采用 蛇形命名法（snake_case），即单词全小写并用下划线分隔（例如 `data_processing.py`）。

- 代码格式化原则 (Code Formatting Principle): 只格式化你**新增或修改**的代码部分。**绝对禁止**对任何你未直接操作的已有代码进行重新格式化，以确保代码变更集（diff）的纯净性。

- 视觉紧凑 (Visual Compactness): 减少不必要的空行、空格和缩进，让代码在视觉上更密集。

- 内外有别的命名 (Differentiated Naming):
  - 外部API (函数/类): 使用清晰、完整的描述性名称。

  - 内部变量 (临时/循环): 使用短小精悍的名称 (例如 `i`, `j`, `res`, `tmp`)。

- 代码自解释 (Self-documenting Code): 只为高层逻辑（如关键函数或类）添加一句话注释说明其“为什么”存在。代码本身应该通过清晰的命名和结构来解释“如何”工作。

- 拒绝重复 (DRY Principle): 一旦发现重复的代码块，立即将其提取为可复用的函数。

- 高内聚 (High Cohesion): 功能高度相关的代码应优先放在同一个文件中，而不是拆分到多个小文件中。

- 拥抱现代语法 (Embrace Modern Syntax): 积极使用目标语言的现代特性和语法糖 (如列表推导式、三元运算符等)，用更少的代码表达更丰富的逻辑。

- 依赖轻量化 (Lightweight Dependencies): 如果必须引入第三方库，选择那些以“小而美”、高效著称的库，避免任何形式的臃肿。
