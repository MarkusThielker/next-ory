import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
    swSrc: 'src/app/service-worker.ts',
    swDest: 'public/sw.js',
});

export default withSerwist({
    output: 'standalone',
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    env: {
        appVersion: process.env.npm_package_version,
    },
});
