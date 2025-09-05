# Stripe 价格 ID 配置说明

## 📋 需要更新的价格 ID

创建完所有产品和价格后，请按照以下格式更新代码中的价格 ID：

### 1. 在 Stripe Dashboard 中获取价格 ID

访问你的产品页面，点击每个价格获取 ID：

```
Starter Plan:
- 月付 ($9.99): price_xxxxxxxxxxxxxxxxxxxxxxx
- 年付 ($99.90): price_xxxxxxxxxxxxxxxxxxxxxxx

Pro Plan:
- 月付 ($19.99): price_xxxxxxxxxxxxxxxxxxxxxxx
- 年付 ($199.90): price_xxxxxxxxxxxxxxxxxxxxxxx

Enterprise Plan:
- 月付 ($99.99): price_xxxxxxxxxxxxxxxxxxxxxxx
- 年付 ($999.90): price_xxxxxxxxxxxxxxxxxxxxxxx
```

### 2. 更新代码文件

编辑文件：`src/modules/payment/providers/stripe-provider.ts`

找到 `getOrCreatePrice` 方法（约第372行），替换为：

```typescript
private async getOrCreatePrice(plan: string, interval: 'month' | 'year'): Promise<string> {
  const priceMapping: Record<string, Record<string, string>> = {
    starter: {
      month: 'price_你的starter月付ID', // 替换为实际的价格 ID
      year: 'price_你的starter年付ID'   // 替换为实际的价格 ID
    },
    pro: {
      month: 'price_你的pro月付ID',     // 替换为实际的价格 ID
      year: 'price_你的pro年付ID'       // 替换为实际的价格 ID
    },
    enterprise: {
      month: 'price_你的enterprise月付ID', // 替换为实际的价格 ID
      year: 'price_你的enterprise年付ID'   // 替换为实际的价格 ID
    }
  };

  return priceMapping[plan]?.[interval] || 'price_default';
}
```

## 🎯 示例

假设你的价格 ID 是：

- Starter 月付: `price_1NxxxxxxxxxxxxxxxxxxxxA`
- Starter 年付: `price_1NxxxxxxxxxxxxxxxxxxxxB`

则更新为：

```typescript
starter: {
  month: 'price_1NxxxxxxxxxxxxxxxxxxxxA',
  year: 'price_1NxxxxxxxxxxxxxxxxxxxxB'
},
```

## ⚠️ 重要提醒

1. **价格 ID 必须准确** - 错误的 ID 会导致支付失败
2. **区分测试和生产** - 测试环境使用测试 ID
3. **保持一致** - 确保 plan 名称匹配（starter, pro, enterprise）

完成配置后，你的订阅系统就可以正常工作了！
