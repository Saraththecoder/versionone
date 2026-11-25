if (!self.define) {
  let e,
    s = {};
  const a = (a, n) => (
    (a = new URL(a + '.js', n).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = a), (e.onload = s), document.head.appendChild(e));
        } else ((e = a), importScripts(a), s());
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, i) => {
    const t = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[t]) return;
    let c = {};
    const r = (e) => a(e, t),
      o = { module: { uri: t }, exports: c, require: r };
    s[t] = Promise.all(n.map((e) => o[e] || r(e))).then((e) => (i(...e), c));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/static/chunks/1674-adca1a21a64925d4.js', revision: 'adca1a21a64925d4' },
        { url: '/_next/static/chunks/1770a7a7-5136ac798b0aea04.js', revision: '5136ac798b0aea04' },
        { url: '/_next/static/chunks/1966.b8f83f7ba376c962.js', revision: 'b8f83f7ba376c962' },
        { url: '/_next/static/chunks/2621-8c6058b42ac37adf.js', revision: '8c6058b42ac37adf' },
        { url: '/_next/static/chunks/2627-6575d09177182d72.js', revision: '6575d09177182d72' },
        { url: '/_next/static/chunks/3036.7c6144c0ec788d2a.js', revision: '7c6144c0ec788d2a' },
        { url: '/_next/static/chunks/3794-c66b3d8325973459.js', revision: 'c66b3d8325973459' },
        { url: '/_next/static/chunks/3841-7b084b89f3e455d7.js', revision: '7b084b89f3e455d7' },
        { url: '/_next/static/chunks/3899.3f761f7e3a944e8c.js', revision: '3f761f7e3a944e8c' },
        { url: '/_next/static/chunks/4173-0e1911aac5a69ff7.js', revision: '0e1911aac5a69ff7' },
        { url: '/_next/static/chunks/4540-e575236ed44610ab.js', revision: 'e575236ed44610ab' },
        { url: '/_next/static/chunks/4bd1b696-e356ca5ba0218e27.js', revision: 'e356ca5ba0218e27' },
        { url: '/_next/static/chunks/6609-078a8cdc853f87c6.js', revision: '078a8cdc853f87c6' },
        { url: '/_next/static/chunks/9015-79e21f31a5fbf81b.js', revision: '79e21f31a5fbf81b' },
        { url: '/_next/static/chunks/913-93a6b5576bd3e614.js', revision: '93a6b5576bd3e614' },
        { url: '/_next/static/chunks/9177-5f605670d193786b.js', revision: '5f605670d193786b' },
        { url: '/_next/static/chunks/952.d2f9591429701aed.js', revision: 'd2f9591429701aed' },
        { url: '/_next/static/chunks/a36bde72-732113f7a0c74c23.js', revision: '732113f7a0c74c23' },
        {
          url: '/_next/static/chunks/app/(auth)/login/page-e1c4e98a5db62798.js',
          revision: 'e1c4e98a5db62798',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/broadcasts/page-337870aad094fe79.js',
          revision: '337870aad094fe79',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/buses/page-1a5b5fd68f5d221c.js',
          revision: '1a5b5fd68f5d221c',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/dashboard/page-67d75a7aa188764c.js',
          revision: '67d75a7aa188764c',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/drivers/page-07ed70cb7830e4c7.js',
          revision: '07ed70cb7830e4c7',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/layout-4a761d6c103a3b1e.js',
          revision: '4a761d6c103a3b1e',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/page-f1367b441244ca62.js',
          revision: 'f1367b441244ca62',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/routes/page-e2f7df2ba7bb03d7.js',
          revision: 'e2f7df2ba7bb03d7',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/stops/page-fd93bade852f029f.js',
          revision: 'fd93bade852f029f',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/students/page-742ab8aa62315b72.js',
          revision: '742ab8aa62315b72',
        },
        {
          url: '/_next/static/chunks/app/(portals)/driver/dashboard/page-bb41de2398bfeff7.js',
          revision: 'bb41de2398bfeff7',
        },
        {
          url: '/_next/static/chunks/app/(portals)/driver/layout-32955b0b47fac302.js',
          revision: '32955b0b47fac302',
        },
        {
          url: '/_next/static/chunks/app/(portals)/driver/page-0e64f4b7f89d5fca.js',
          revision: '0e64f4b7f89d5fca',
        },
        {
          url: '/_next/static/chunks/app/(portals)/driver/summary/page-8dda66e379c1a636.js',
          revision: '8dda66e379c1a636',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/dashboard/page-215b6981d39a0a5d.js',
          revision: '215b6981d39a0a5d',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/layout-1b0a431b5ddbd0a7.js',
          revision: '1b0a431b5ddbd0a7',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/map/page-6877e65455eb0f42.js',
          revision: '6877e65455eb0f42',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/notifications/page-5d80fe003e010584.js',
          revision: '5d80fe003e010584',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/page-523afb0b83aa136c.js',
          revision: '523afb0b83aa136c',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/profile/page-eb62f829d6239c60.js',
          revision: 'eb62f829d6239c60',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/routes/page-27e6ab6d794a0b66.js',
          revision: '27e6ab6d794a0b66',
        },
        {
          url: '/_next/static/chunks/app/_global-error/page-97215e2c76256ef9.js',
          revision: '97215e2c76256ef9',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-97215e2c76256ef9.js',
          revision: '97215e2c76256ef9',
        },
        {
          url: '/_next/static/chunks/app/api/auth/staff/route-97215e2c76256ef9.js',
          revision: '97215e2c76256ef9',
        },
        {
          url: '/_next/static/chunks/app/api/invite-code/route-97215e2c76256ef9.js',
          revision: '97215e2c76256ef9',
        },
        { url: '/_next/static/chunks/app/error-1370e33fff271133.js', revision: '1370e33fff271133' },
        {
          url: '/_next/static/chunks/app/layout-8660cdd3aedbf802.js',
          revision: '8660cdd3aedbf802',
        },
        {
          url: '/_next/static/chunks/app/loading-97215e2c76256ef9.js',
          revision: '97215e2c76256ef9',
        },
        {
          url: '/_next/static/chunks/app/not-authorized/page-cc6bae1bc183d572.js',
          revision: 'cc6bae1bc183d572',
        },
        {
          url: '/_next/static/chunks/app/not-found-cc6bae1bc183d572.js',
          revision: 'cc6bae1bc183d572',
        },
        { url: '/_next/static/chunks/app/page-f88f306dbd9a2238.js', revision: 'f88f306dbd9a2238' },
        { url: '/_next/static/chunks/cc44e60b-f83e4332b3149e6e.js', revision: 'f83e4332b3149e6e' },
        { url: '/_next/static/chunks/d0deef33.3966d0ce670a6335.js', revision: '3966d0ce670a6335' },
        { url: '/_next/static/chunks/d8b2f613-5097470be32e7f20.js', revision: '5097470be32e7f20' },
        { url: '/_next/static/chunks/framework-711ef29bc66f648c.js', revision: '711ef29bc66f648c' },
        { url: '/_next/static/chunks/main-752ee30d8759c89f.js', revision: '752ee30d8759c89f' },
        { url: '/_next/static/chunks/main-app-7b24435a6903a6b2.js', revision: '7b24435a6903a6b2' },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/app-error-97215e2c76256ef9.js',
          revision: '97215e2c76256ef9',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/forbidden-97215e2c76256ef9.js',
          revision: '97215e2c76256ef9',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/global-error-e14ba163cfd747b4.js',
          revision: 'e14ba163cfd747b4',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/unauthorized-97215e2c76256ef9.js',
          revision: '97215e2c76256ef9',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        { url: '/_next/static/chunks/webpack-8b7461c5908dc6b9.js', revision: '8b7461c5908dc6b9' },
        { url: '/_next/static/css/17cc24d2034f3050.css', revision: '17cc24d2034f3050' },
        { url: '/_next/static/css/1de76be520b4de19.css', revision: '1de76be520b4de19' },
        {
          url: '/_next/static/jJbvvsFMRkqFR6eeqiLhh/_buildManifest.js',
          revision: 'e443f938cce53bd2f0980677b5d6f9dd',
        },
        {
          url: '/_next/static/jJbvvsFMRkqFR6eeqiLhh/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/media/layers-2x.9859cd12.png', revision: '9859cd12' },
        { url: '/_next/static/media/layers.ef6db872.png', revision: 'ef6db872' },
        { url: '/_next/static/media/marker-icon.d577052a.png', revision: 'd577052a' },
        { url: '/bus-icon.svg', revision: '3af86aee2dc08fb90e845bd1d60bbc68' },
        { url: '/icon-192x192.png', revision: '8a050df77e6f9d589b4b4ea235a9932e' },
        { url: '/icon-512x512.png', revision: '9ed7276b8cf9f8f65bbad8ce0d0db490' },
        { url: '/images/driver-banner.png', revision: '5d9dfc2c33251897e2cf1ae8404cc294' },
        { url: '/images/driver-banner.svg', revision: 'e4f6d3f01814f082e1a6312a28fe9dbb' },
        { url: '/images/icon-bus.png', revision: 'c5e376d760b0e09be3180faebc1a5b02' },
        { url: '/images/icon-bus.svg', revision: '994c604e08ecfac334be3f13f2680658' },
        { url: '/images/icon-driver.png', revision: '7ccb1b652e4def21028b7457e3970231' },
        { url: '/images/icon-driver.svg', revision: 'a787820011a046ae91cc5d2b15f535c5' },
        { url: '/images/icon-school.png', revision: 'b10e15f676fda8c1705e65a86fe6bf35' },
        { url: '/images/icon-school.svg', revision: '6629dc467cb61cc633822f1bc876d225' },
        { url: '/images/icon-student.png', revision: '469953e4e05c399dfcc7b1bec8c0d79a' },
        { url: '/images/icon-student.svg', revision: '057f64221df0356d482396aaddcc30a9' },
        { url: '/images/splash-bus.png', revision: 'b56fb7eaee24dc6f5189dda089116007' },
        { url: '/images/splash-bus.svg', revision: '531fb93fc34e1aa084de6893ba0bca19' },
        { url: '/manifest.json', revision: '3464f7ef66a44603b7e7ad7dc676ef26' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: a, state: n }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET'
    ));
});
