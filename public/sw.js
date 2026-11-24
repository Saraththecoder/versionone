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
  self.define = (n, c) => {
    const i = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[i]) return;
    let t = {};
    const r = (e) => a(e, i),
      d = { module: { uri: i }, exports: t, require: r };
    s[i] = Promise.all(n.map((e) => d[e] || r(e))).then((e) => (c(...e), t));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/ZLWQlQ6HR8Ax57jJpB5Mz/_buildManifest.js',
          revision: 'a8f47510f5feed11c7f7ce60d33d048a',
        },
        {
          url: '/_next/static/ZLWQlQ6HR8Ax57jJpB5Mz/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/1674-af7653b88319540a.js', revision: 'af7653b88319540a' },
        { url: '/_next/static/chunks/1770a7a7-02402991f6f33b6a.js', revision: '02402991f6f33b6a' },
        { url: '/_next/static/chunks/1966.1560d0f43ac9a41a.js', revision: '1560d0f43ac9a41a' },
        { url: '/_next/static/chunks/2294-8ca8f5088bbdda14.js', revision: '8ca8f5088bbdda14' },
        { url: '/_next/static/chunks/3036.0a3cb0671b5c8348.js', revision: '0a3cb0671b5c8348' },
        { url: '/_next/static/chunks/3794-a205959ce301b5c6.js', revision: 'a205959ce301b5c6' },
        { url: '/_next/static/chunks/3899.cf10152d8085e352.js', revision: 'cf10152d8085e352' },
        { url: '/_next/static/chunks/4173-cd454ae7fd7befa1.js', revision: 'cd454ae7fd7befa1' },
        { url: '/_next/static/chunks/4bd1b696-c2f6e0877b6c10aa.js', revision: 'c2f6e0877b6c10aa' },
        { url: '/_next/static/chunks/5900-97578e9fff45a925.js', revision: '97578e9fff45a925' },
        { url: '/_next/static/chunks/6198-894ab222fe629df1.js', revision: '894ab222fe629df1' },
        { url: '/_next/static/chunks/6609-1948800b7ad9f570.js', revision: '1948800b7ad9f570' },
        { url: '/_next/static/chunks/913-68198e6fdcfd3093.js', revision: '68198e6fdcfd3093' },
        { url: '/_next/static/chunks/9177-9fabdcfa29e023ae.js', revision: '9fabdcfa29e023ae' },
        { url: '/_next/static/chunks/952.f2f8ab7e96c7cdd1.js', revision: 'f2f8ab7e96c7cdd1' },
        { url: '/_next/static/chunks/a36bde72-e5925af3ae726e0f.js', revision: 'e5925af3ae726e0f' },
        {
          url: '/_next/static/chunks/app/(auth)/login/page-f5caa504f4e34533.js',
          revision: 'f5caa504f4e34533',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/broadcasts/page-4a88ed13a5f98010.js',
          revision: '4a88ed13a5f98010',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/buses/page-0ad071fa883f1931.js',
          revision: '0ad071fa883f1931',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/dashboard/page-d4c219d1db4b0c77.js',
          revision: 'd4c219d1db4b0c77',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/drivers/page-b0c08daa3d8686cb.js',
          revision: 'b0c08daa3d8686cb',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/layout-0fb6475b19ccbace.js',
          revision: '0fb6475b19ccbace',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/page-818cc2251e0a0e54.js',
          revision: '818cc2251e0a0e54',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/routes/page-ce6f1bb72e01951a.js',
          revision: 'ce6f1bb72e01951a',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/stops/page-76c53bcb94171571.js',
          revision: '76c53bcb94171571',
        },
        {
          url: '/_next/static/chunks/app/(portals)/admin/students/page-a2648ad29fce8193.js',
          revision: 'a2648ad29fce8193',
        },
        {
          url: '/_next/static/chunks/app/(portals)/driver/dashboard/page-ad06a0ab157b0e09.js',
          revision: 'ad06a0ab157b0e09',
        },
        {
          url: '/_next/static/chunks/app/(portals)/driver/layout-e6cf633a85b51d9b.js',
          revision: 'e6cf633a85b51d9b',
        },
        {
          url: '/_next/static/chunks/app/(portals)/driver/page-e163775420628a8d.js',
          revision: 'e163775420628a8d',
        },
        {
          url: '/_next/static/chunks/app/(portals)/driver/summary/page-338f68d6ac1253d8.js',
          revision: '338f68d6ac1253d8',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/dashboard/page-ad70ca0cecc8a2a6.js',
          revision: 'ad70ca0cecc8a2a6',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/layout-a71c6882e1f97285.js',
          revision: 'a71c6882e1f97285',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/map/page-6352786c73c3f649.js',
          revision: '6352786c73c3f649',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/notifications/page-b8a0e64e7d3b8770.js',
          revision: 'b8a0e64e7d3b8770',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/page-c2b259c452d5a165.js',
          revision: 'c2b259c452d5a165',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/profile/page-aad2d5e2f5a1a423.js',
          revision: 'aad2d5e2f5a1a423',
        },
        {
          url: '/_next/static/chunks/app/(portals)/student/routes/page-339c879f0ad32900.js',
          revision: '339c879f0ad32900',
        },
        {
          url: '/_next/static/chunks/app/_global-error/page-2fec3e41983a407d.js',
          revision: '2fec3e41983a407d',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-2fec3e41983a407d.js',
          revision: '2fec3e41983a407d',
        },
        { url: '/_next/static/chunks/app/error-c8a868f1dd34a15f.js', revision: 'c8a868f1dd34a15f' },
        {
          url: '/_next/static/chunks/app/layout-cdecd9381a1ae0cf.js',
          revision: 'cdecd9381a1ae0cf',
        },
        {
          url: '/_next/static/chunks/app/loading-2fec3e41983a407d.js',
          revision: '2fec3e41983a407d',
        },
        {
          url: '/_next/static/chunks/app/not-authorized/page-2cd9c58b9201c8f6.js',
          revision: '2cd9c58b9201c8f6',
        },
        {
          url: '/_next/static/chunks/app/not-found-2cd9c58b9201c8f6.js',
          revision: '2cd9c58b9201c8f6',
        },
        { url: '/_next/static/chunks/app/page-74216f2df2b2b12b.js', revision: '74216f2df2b2b12b' },
        { url: '/_next/static/chunks/cc44e60b-45e6013d94c271e2.js', revision: '45e6013d94c271e2' },
        { url: '/_next/static/chunks/d0deef33.f8ec60445fe52e8c.js', revision: 'f8ec60445fe52e8c' },
        { url: '/_next/static/chunks/d8b2f613-a06d15357bd38bbc.js', revision: 'a06d15357bd38bbc' },
        { url: '/_next/static/chunks/framework-d1de002210ddaaef.js', revision: 'd1de002210ddaaef' },
        { url: '/_next/static/chunks/main-157ce8c86130b210.js', revision: '157ce8c86130b210' },
        { url: '/_next/static/chunks/main-app-b76e0e6b74348c31.js', revision: 'b76e0e6b74348c31' },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/app-error-2fec3e41983a407d.js',
          revision: '2fec3e41983a407d',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/forbidden-2fec3e41983a407d.js',
          revision: '2fec3e41983a407d',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/global-error-7c0cfe015e835100.js',
          revision: '7c0cfe015e835100',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/unauthorized-2fec3e41983a407d.js',
          revision: '2fec3e41983a407d',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        { url: '/_next/static/chunks/webpack-a136defabfeec57e.js', revision: 'a136defabfeec57e' },
        { url: '/_next/static/css/1de76be520b4de19.css', revision: '1de76be520b4de19' },
        { url: '/_next/static/css/da47e2b22c593b6b.css', revision: 'da47e2b22c593b6b' },
        { url: '/_next/static/media/layers-2x.9859cd12.png', revision: '9859cd12' },
        { url: '/_next/static/media/layers.ef6db872.png', revision: 'ef6db872' },
        { url: '/_next/static/media/marker-icon.d577052a.png', revision: 'd577052a' },
        { url: '/bus-icon.svg', revision: '5423114878ab13a3c4617aeb4da11e43' },
        { url: '/icon-192x192.png', revision: '8a050df77e6f9d589b4b4ea235a9932e' },
        { url: '/icon-512x512.png', revision: '9ed7276b8cf9f8f65bbad8ce0d0db490' },
        { url: '/images/driver-banner.png', revision: '5d9dfc2c33251897e2cf1ae8404cc294' },
        { url: '/images/driver-banner.svg', revision: 'dd94704db19aa31be8ee2268ade071cf' },
        { url: '/images/icon-bus.png', revision: 'c5e376d760b0e09be3180faebc1a5b02' },
        { url: '/images/icon-bus.svg', revision: '3976799a269df0f4feac9df523cbe0fc' },
        { url: '/images/icon-driver.png', revision: '7ccb1b652e4def21028b7457e3970231' },
        { url: '/images/icon-driver.svg', revision: 'f0cebaf788588059d354cb86b218ebcf' },
        { url: '/images/icon-school.png', revision: 'b10e15f676fda8c1705e65a86fe6bf35' },
        { url: '/images/icon-school.svg', revision: '474b7859ca818b7c2ea29c44202aaba5' },
        { url: '/images/icon-student.png', revision: '469953e4e05c399dfcc7b1bec8c0d79a' },
        { url: '/images/icon-student.svg', revision: '872b6e16edbb326babe7f5dbead083d4' },
        { url: '/images/splash-bus.png', revision: 'b56fb7eaee24dc6f5189dda089116007' },
        { url: '/images/splash-bus.svg', revision: 'fb2cca53ee66968d1dd13227abc75131' },
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
