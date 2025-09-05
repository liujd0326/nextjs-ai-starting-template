# Stripe 订阅系统测试指南

## 🚀 快速开始

### 1. 获取 Stripe 测试密钥

1. 前往 [Stripe Dashboard](https://dashboard.stripe.com/test/developers)
2. 切换到 **测试模式** (确保左上角显示 "Test mode")
3. 获取以下密钥：
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### 2. 配置环境变量

在 `.env.local` 文件中添加 Stripe 测试配置：

```env
# Stripe Test Keys
STRIPE_SECRET_KEY_TEST=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_your_publishable_key_here

# Stripe Webhook (稍后配置)
STRIPE_WEBHOOK_SECRET_TEST=whsec_your_webhook_secret_here

# Payment Provider
DEFAULT_PAYMENT_PROVIDER=stripe
```

### 3. 创建 Stripe 产品和价格

在 Stripe Dashboard 中创建产品和价格：

#### 创建产品：
1. 进入 [Products](https://dashboard.stripe.com/test/products)
2. 点击 "Add product"
3. 创建以下产品：
   - **Starter Plan**
   - **Pro Plan** 
   - **Enterprise Plan**

#### 创建价格：
为每个产品创建月度和年度价格：

**Starter Plan:**
- 月度: $9.99/month (`price_starter_monthly`)
- 年度: $99.90/year (`price_starter_yearly`)

**Pro Plan:**
- 月度: $19.99/month (`price_pro_monthly`)
- 年度: $199.90/year (`price_pro_yearly`)

**Enterprise Plan:**
- 月度: $99.99/month (`price_enterprise_monthly`)
- 年度: $999.90/year (`price_enterprise_yearly`)

> **重要**: 记录下每个价格的 Price ID，需要在代码中使用

### 4. 更新代码中的价格 ID

编辑 `src/modules/payment/providers/stripe-provider.ts` 中的 `getOrCreatePrice` 方法，替换为实际的 Price ID：

```typescript
private async getOrCreatePrice(plan: string, interval: 'month' | 'year'): Promise<string> {
  const priceMapping: Record<string, Record<string, string>> = {
    starter: {
      month: 'price_1234567890abcdef', // 替换为实际 ID
      year: 'price_abcdef1234567890'   // 替换为实际 ID
    },
    pro: {
      month: 'price_your_pro_monthly_id',
      year: 'price_your_pro_yearly_id'
    },
    enterprise: {
      month: 'price_your_enterprise_monthly_id',
      year: 'price_your_enterprise_yearly_id'
    }
  };

  return priceMapping[plan]?.[interval] || 'price_default';
}
```

## 🔧 配置 Webhook 测试

### 方法一: 使用 ngrok (推荐)

1. **安装 ngrok**:
   ```bash
   # macOS
   brew install ngrok
   
   # 或直接下载: https://ngrok.com/download
   ```

2. **启动开发服务器**:
   ```bash
   pnpm dev
   ```

3. **在另一个终端启动 ngrok**:
   ```bash
   ngrok http 3000
   ```

4. **复制 HTTPS URL**:
   ```
   https://your-random-id.ngrok.io
   ```

5. **在 Stripe Dashboard 配置 Webhook**:
   - 进入 [Webhooks](https://dashboard.stripe.com/test/webhooks)
   - 点击 "Add endpoint"
   - URL: `https://your-random-id.ngrok.io/api/webhooks/stripe`
   - 选择以下事件：
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

6. **获取 Webhook Secret**:
   - 点击创建的 webhook
   - 点击 "Reveal signing secret"
   - 复制 `whsec_...` 开头的密钥
   - 更新 `.env.local` 中的 `STRIPE_WEBHOOK_SECRET_TEST`

### 方法二: 使用 Stripe CLI

1. **安装 Stripe CLI**:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   ```

2. **登录到 Stripe**:
   ```bash
   stripe login
   ```

3. **转发 webhook 事件**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **获取 Webhook Secret**:
   CLI 会显示 webhook secret，类似：
   ```
   > Ready! Your webhook signing secret is whsec_1234567890abcdef...
   ```

5. **更新环境变量**:
   ```env
   STRIPE_WEBHOOK_SECRET_TEST=whsec_from_cli_output
   ```

## 🧪 测试流程

### 1. 基本订阅流程测试

1. **启动应用**:
   ```bash
   pnpm dev
   ```

2. **访问定价页面**: `http://localhost:3000/pricing`

3. **选择计划**: 点击非免费计划的按钮

4. **使用测试卡号**:
   - 卡号: `4242 4242 4242 4242`
   - 过期: 任意未来日期 (如 `12/34`)
   - CVC: 任意3位数字 (如 `123`)
   - 邮政编码: 任意 (如 `12345`)

5. **完成支付**: 应该重定向到成功页面

6. **检查数据库**: 确认订阅记录已创建

### 2. Webhook 事件测试

监控以下日志输出：

1. **应用日志**: 查看控制台中的 webhook 处理日志
2. **Stripe Dashboard**: 检查 Webhook 页面的事件状态
3. **数据库**: 确认数据正确更新

### 3. 订阅管理测试

1. **访问订阅管理页面**: `http://localhost:3000/dashboard/subscription`

2. **测试取消订阅**: 点击取消按钮，确认状态更新

3. **测试 Billing Portal**: 点击管理账单按钮，应跳转到 Stripe Portal

### 4. 失败场景测试

使用以下测试卡号测试失败场景：

- **卡被拒绝**: `4000 0000 0000 0002`
- **余额不足**: `4000 0000 0000 9995`
- **过期卡**: `4000 0000 0000 0069`

## 📊 监控和调试

### 1. 应用日志
```bash
# 开发模式下查看详细日志
NODE_ENV=development pnpm dev
```

### 2. Stripe Dashboard
- [支付记录](https://dashboard.stripe.com/test/payments)
- [订阅记录](https://dashboard.stripe.com/test/subscriptions) 
- [客户记录](https://dashboard.stripe.com/test/customers)
- [Webhook 日志](https://dashboard.stripe.com/test/webhooks)

### 3. 数据库检查
```bash
# 启动 Drizzle Studio 查看数据
pnpm db:studio
```

## 🚀 自动续费测试

### 模拟自动续费

1. **创建短周期订阅**:
   在 Stripe Dashboard 中创建一个测试用的短周期价格 (如每5分钟)

2. **使用 Stripe CLI 快进时间**:
   ```bash
   # 模拟时间推进
   stripe fixtures fixtures/test_clock.json
   ```

3. **观察 Webhook 事件**: 
   - `invoice.payment_succeeded` - 成功续费
   - `invoice.payment_failed` - 失败续费

## ⚠️ 常见问题

### Q1: Webhook 没有触发？
- 检查 ngrok 是否正常运行
- 确认 webhook URL 正确
- 检查 webhook 签名验证

### Q2: 支付失败？
- 确认使用测试卡号
- 检查 Stripe 密钥是否正确
- 查看 Stripe Dashboard 中的错误信息

### Q3: 数据库没有更新？
- 检查 webhook 处理逻辑
- 确认数据库连接正常
- 查看应用日志中的错误信息

### Q4: 价格 ID 错误？
- 确认在 Stripe Dashboard 中创建了对应价格
- 检查代码中的价格 ID 映射
- 使用正确的测试环境价格 ID

## 📝 测试检查清单

- [ ] Stripe 测试密钥已配置
- [ ] 产品和价格已在 Dashboard 创建
- [ ] Webhook 端点已配置并测试
- [ ] 订阅创建流程正常
- [ ] 支付成功页面显示正确
- [ ] Webhook 事件正确处理
- [ ] 订阅管理页面功能正常
- [ ] 取消订阅功能正常
- [ ] Billing Portal 访问正常
- [ ] 失败场景处理正确
- [ ] 数据库记录正确更新

完成所有检查后，你的 Stripe 订阅系统就可以在本地环境中完整测试了！

## 🔄 下一步：部署到生产环境

当本地测试完成后，可以：
1. 获取 Stripe 生产环境密钥
2. 配置生产环境 webhook
3. 更新环境变量
4. 部署到 Cloudflare Workers