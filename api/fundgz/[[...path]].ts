export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/fundgz', '');
  const targetUrl = `http://fundgz.1234567.com.cn${path}${url.search}`;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      'Referer': 'http://fundgz.1234567.com.cn/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': '*/*',
    },
  });

  const data = await response.text();

  return new Response(data, {
    status: response.status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
