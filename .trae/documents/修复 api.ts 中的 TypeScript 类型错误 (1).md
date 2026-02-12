## 修复 TypeScript 类型错误计划

### 问题分析
- API 响应体结构：`{ Data: { LSJZList: [...] }, ... }`
- axios 会将响应体包装在 `response.data` 属性中
- 当前代码错误地访问 `response.Data`（缺少 `.data`）

### 修复方案
将代码中的 `response.Data` 改为 `response.data.Data`：

**第 337 行：**
```typescript
// 修改前
if (response?.Data?.LSJZList && Array.isArray(response?.Data?.LSJZList)) {

// 修改后
if (response?.data?.Data?.LSJZList && Array.isArray(response?.data?.Data?.LSJZList)) {
```

**第 339 行：**
```typescript
// 修改前
response?.Data?.LSJZList.forEach((item: any) => {

// 修改后
response?.data?.Data?.LSJZList.forEach((item: any) => {
```

### 修改文件
- `d:\fundMonitor\src\services\api.ts`（第 337 和 339 行）