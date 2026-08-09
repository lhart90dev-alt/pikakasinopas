// Vercel Edge Middleware — language auto-redirect at the root.
// Sends "/" to the best-matching /{lang}/ based on the visitor's Accept-Language.
// Fallback / x-default = Finnish (fi). Every language is directly reachable + in the sitemap.
export const config = { matcher: '/' };

export default function middleware(request) {
  const supported = ['fi', 'en', 'es', 'fr', 'de', 'nl', 'gr'];
  const map = { el: 'gr', sv: 'fi' }; // Greek ISO 'el' lives at /gr/; Swedish speakers → Finnish
  const header = (request.headers.get('accept-language') || '').toLowerCase();
  let target = 'fi';
  for (const part of header.split(',')) {
    let code = part.trim().split(';')[0].split('-')[0];
    if (map[code]) code = map[code];
    if (supported.includes(code)) { target = code; break; }
  }
  const url = new URL(request.url);
  url.pathname = `/${target}/`;
  return Response.redirect(url.toString(), 307);
}
