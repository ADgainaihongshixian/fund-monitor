# 基金监控应用部署指南

## 项目分析

### 环境变量配置
- **项目中未使用任何环境变量**，所有配置都是硬编码在代码中
- 无需配置环境变量文件（如 .env 文件）

### API 接口分析
项目使用 Vite 代理配置了以下 API 接口：

| 代理路径 | 目标地址 | 用途 |
|---------|---------|------|
| `/api/eastmoney` | `https://fund.eastmoney.com` | 基金搜索接口 |
| `/api/fundgz` | `http://fundgz.1234567.com.cn` | 基金实时估值数据 |
| `/api/fund` | `https://api.fund.eastmoney.com` | 基金历史数据 |
| `/api/sina-metal` | `https://hq.sinajs.cn` | 贵金属数据 |
| `/api/sina-exchange` | `https://hq.sinajs.cn` | 汇率数据 |

## 部署步骤

### 1. 构建项目

```bash
# 安装依赖
pnpm install

# 构建生产版本
pnpm run build
```

构建完成后，生产文件将生成在 `dist` 目录中。

### 2. 选择部署平台

以下是推荐的免费部署平台：

| 平台 | 特点 | 适用场景 |
|------|------|----------|
| Vercel | 自动部署、支持代理配置 | 推荐 |
| Netlify | 自动部署、支持代理配置 | 推荐 |
| GitHub Pages | 简单易用、适合静态网站 | 需额外配置代理 |
| Cloudflare Pages | 全球 CDN、速度快 | 推荐 |

### 3. 部署配置

#### Vercel 部署

1. 登录 Vercel 账号并连接 GitHub 仓库
2. 创建新项目，选择你的基金监控应用仓库
3. 在项目设置中配置：
   - **构建命令**：`pnpm run build`
   - **输出目录**：`dist`
   - **环境变量**：无需配置

4. 配置代理（在 `vercel.json` 文件中）：

```json
{
  "rewrites": [
    {
      "source": "/api/eastmoney/(.*)",
      "destination": "https://fund.eastmoney.com/$1"
    },
    {
      "source": "/api/fundgz/(.*)",
      "destination": "http://fundgz.1234567.com.cn/$1"
    },
    {
      "source": "/api/fund/(.*)",
      "destination": "https://api.fund.eastmoney.com/$1"
    },
    {
      "source": "/api/sina-metal/(.*)",
      "destination": "https://hq.sinajs.cn/$1"
    },
    {
      "source": "/api/sina-exchange/(.*)",
      "destination": "https://hq.sinajs.cn/$1"
    }
  ]
}
```

#### Netlify 部署

1. 登录 Netlify 账号并连接 GitHub 仓库
2. 创建新项目，选择你的基金监控应用仓库
3. 在构建设置中配置：
   - **构建命令**：`pnpm run build`
   - **发布目录**：`dist`

4. 配置代理（在 `_redirects` 文件中）：

```
/api/eastmoney/*  https://fund.eastmoney.com/:splat  200
/api/fundgz/*  http://fundgz.1234567.com.cn/:splat  200
/api/fund/*  https://api.fund.eastmoney.com/:splat  200
/api/sina-metal/*  https://hq.sinajs.cn/:splat  200
/api/sina-exchange/*  https://hq.sinajs.cn/:splat  200
```

### 4. 部署验证

部署完成后，访问部署的网站并验证以下功能：

1. **基金列表**：检查是否能正常加载和显示基金数据
2. **基金搜索**：测试搜索功能是否正常
3. **基金详情**：查看基金详情和历史数据图表
4. **贵金属数据**：检查贵金属价格是否正常显示
5. **汇率数据**：验证汇率信息是否正确加载
6. **自动刷新**：确认数据自动刷新功能是否正常

### 5. 性能优化（可选）

- **启用 CDN**：利用部署平台的 CDN 加速功能
- **图片优化**：确保所有图片都经过压缩
- **代码分割**：利用 Vite 的自动代码分割功能
- **缓存策略**：配置适当的缓存策略

## 故障排除

### 常见问题及解决方案

1. **API 代理失败**
   - 检查部署平台的代理配置是否正确
   - 确认目标 API 地址是否可访问
   - 检查是否需要添加额外的请求头

2. **数据加载失败**
   - 检查浏览器控制台是否有错误信息
   - 确认网络连接是否正常
   - 验证 API 响应格式是否符合预期

3. **样式问题**
   - 确认 Tailwind CSS 是否正确加载
   - 检查是否有 CSS 冲突

4. **部署平台特定问题**
   - 参考部署平台的官方文档
   - 检查构建日志中的错误信息

## 总结

本项目部署相对简单，主要需要注意以下几点：

1. **无需配置环境变量**：项目中没有使用环境变量
2. **需要配置 API 代理**：确保部署平台正确配置了所有 API 代理规则
3. **保持功能一致性**：部署后的应用应与本地开发环境功能完全一致
4. **验证部署结果**：部署后需全面测试所有功能

通过以上步骤，你可以成功将基金监控应用部署到免费的云平台上，让用户可以随时随地访问和使用。