import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // A list of all locales that are supported
    locales: ['tr', 'en', 'de'],

    // Used when no locale matches
    defaultLocale: 'tr'
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(tr|en|de)/:path*']
};
