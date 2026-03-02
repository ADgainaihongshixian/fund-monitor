export const config = {
  runtime: 'edge',
  matches: [
    {
      source: '/api/eastmoney/:path*',
      destination: '/api/proxy',
    },
    {
      source: '/api/fundgz/:path*',
      destination: '/api/proxy',
    },
    {
      source: '/api/fund/:path*',
      destination: '/api/proxy',
    },
    {
      source: '/api/sina-metal/:path*',
      destination: '/api/proxy',
    },
    {
      source: '/api/sina-exchange/:path*',
      destination: '/api/proxy',
    },
  ],
};

const API_CONFIGS: Record<string, { target: string; referer: string }> = {
  '/api/eastmoney': {
    target: 'https://fund.eastmoney.com',
    referer: 'https://fund.eastmoney.com/',
  },
  '/api/fundgz': {
    target: 'http://fundgz.1234567.com.cn',
    referer: 'http://fundgz.1234567.com.cn/',
  },
  '/api/fund': {
    target: 'https://api.fund.eastmoney.com',
    referer: 'https://fund.eastmoney.com/',
  },
  '/api/sina-metal': {
    target: 'https://hq.sinajs.cn',
    referer: 'https://finance.sina.com.cn/',
  },
  '/api/sina-exchange': {
    target: 'https://hq.sinajs.cn',
    referer: 'https://finance.sina.com.cn/',
  },
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  let targetUrl = '';
  let referer = '';

  for (const [prefix, config] of Object.entries(API_CONFIGS)) {
    if (pathname.startsWith(prefix)) {
      const path = pathname.replace(prefix, '');
      targetUrl = `${config.target}${path}${url.search}`;
      referer = config.referer;
      break;
    }
  }

  if (!targetUrl) {
    return new Response('Not Found', { status: 404 });
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Referer': referer,
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
};