export const config = {
  runtime: 'edge',
};

const API_CONFIGS: Record<string, { target: string; referer: string }> = {
  'eastmoney': {
    target: 'https://fund.eastmoney.com',
    referer: 'https://fund.eastmoney.com/',
  },
  'fundgz': {
    target: 'http://fundgz.1234567.com.cn',
    referer: 'http://fundgz.1234567.com.cn/',
  },
  'fund': {
    target: 'https://api.fund.eastmoney.com',
    referer: 'https://fund.eastmoney.com/',
  },
  'sina-metal': {
    target: 'https://hq.sinajs.cn',
    referer: 'https://finance.sina.com.cn/',
  },
  'sina-exchange': {
    target: 'https://hq.sinajs.cn',
    referer: 'https://finance.sina.com.cn/',
  },
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || '';
  const path = url.searchParams.get('path') || '';

  const apiConfig = API_CONFIGS[type];
  if (!apiConfig) {
    return new Response('Invalid API type', { status: 400 });
  }

  // 移除 type 和 path 参数，保留其他查询参数
  const searchParams = new URLSearchParams(url.searchParams);
  searchParams.delete('type');
  searchParams.delete('path');

  // 构建目标 URL
  let targetUrl = apiConfig.target;
  if (path) {
    targetUrl += '/' + path;
  }
  const queryString = searchParams.toString();
  if (queryString) {
    targetUrl += '?' + queryString;
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Referer': apiConfig.referer,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
      },
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(`Proxy Error: ${error}`, { status: 500 });
  }
}
