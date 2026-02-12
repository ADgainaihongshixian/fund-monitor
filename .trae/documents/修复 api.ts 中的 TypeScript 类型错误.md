## 修复 TypeScript 类型错误计划

### 问题分析
- 接口响应确实返回大写 `Data` 字段
- 但 axios 的 `AxiosResponse` 默认将 `data` 属性定义为 `any` 类型
- TypeScript 不知道 `response.data.Data` 的存在

### 修复方案
1. **在 `src/types/index.ts` 中添加东方财富 API 响应类型**
```typescript
// 东方财富基金历史数据API响应类型
interface EastmoneyHistoryResponse {
  Data: {
    LSJZList: Array<{
      FSRQ: string;  // 日期
      DWJZ: string;  // 单位净值
      JZZZL: string; // 净值增长率
    }>;
  };
  // 其他可能字段...
}
```

2. **在 `src/services/api.ts` 中指定 API 响应类型**
```typescript
const response = await historyApiClient.get<EastmoneyHistoryResponse>(url, {...});
```

### 修改文件
- `src/types/index.ts`：添加类型定义
- `src/services/api.ts`：在 API 调用时指定类型参数

这样 TypeScript 就能正确识别 `response.data.Data` 结构，消除类型错误。