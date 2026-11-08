export default {
  async fetch(request, env) {
    if (!env.SITE_PASSWORD) {
      return new Response('SITE_PASSWORD is not set in Cloudflare.', { status: 500 });
    }

    const header = request.headers.get('Authorization') || '';
    const [scheme, encoded] = header.split(' ');
    if (scheme === 'Basic' && encoded) {
      try {
        const decoded = atob(encoded);
        const password = decoded.slice(decoded.indexOf(':') + 1);
        if (password === env.SITE_PASSWORD) {
          return env.ASSETS.fetch(request);
        }
      } catch (e) {}
    }

    return new Response('Password required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="TimeSync", charset="UTF-8"' }
    });
  }
};
