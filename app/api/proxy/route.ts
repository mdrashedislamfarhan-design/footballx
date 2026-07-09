import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': `${parsed.protocol}//${parsed.hostname}/`,
        'Origin': `${parsed.protocol}//${parsed.hostname}`,
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(10000),
    });

    const contentType = upstream.headers.get('content-type') || '';
    const isM3U8 = contentType.includes('mpegurl') || 
                   contentType.includes('x-mpegurl') || 
                   url.includes('.m3u8') ||
                   url.includes('manifest') ||
                   url.includes('playlist') ||
                   url.includes('index');

    if (isM3U8) {
      const text = await upstream.text();
      
      // Base URL = everything up to the last slash
      const base = url.substring(0, url.lastIndexOf('/') + 1);

      // Rewrite ALL URIs in m3u8: .m3u8, .ts, .aac, .mp4, .vtt, .key files
      const rewritten = text.split('\n').map(line => {
        const trimmed = line.trim();
        
        // Skip empty lines and pure comment lines (except URI= attributes)
        if (trimmed === '' || (trimmed.startsWith('#') && !trimmed.includes('URI='))) {
          return line;
        }
        
        // Handle URI="..." attributes inside #EXT- tags (e.g. encryption keys)
        if (trimmed.startsWith('#') && trimmed.includes('URI="')) {
          return line.replace(/URI="([^"]+)"/g, (match, uri) => {
            const fullUri = uri.startsWith('http') ? uri : base + uri;
            return `URI="/api/proxy?url=${encodeURIComponent(fullUri)}"`;
          });
        }
        
        // Handle segment lines (.ts, .aac, .mp4, .m3u8, .vtt, .key, or any URL-like line)
        if (!trimmed.startsWith('#')) {
          const fullUri = trimmed.startsWith('http') ? trimmed : base + trimmed;
          return `/api/proxy?url=${encodeURIComponent(fullUri)}`;
        }
        
        return line;
      }).join('\n');

      return new NextResponse(rewritten, {
        status: upstream.status,
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Cache-Control': 'no-cache, no-store',
        },
      });
    }

    // For binary segments (.ts, .aac, .mp4 etc.) — stream directly
    const buffer = await upstream.arrayBuffer();
    return new NextResponse(buffer, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'video/MP2T',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (err: any) {
    console.error('Proxy error for:', url, err?.message);
    return NextResponse.json({ error: 'Upstream fetch failed', url }, { status: 502 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
