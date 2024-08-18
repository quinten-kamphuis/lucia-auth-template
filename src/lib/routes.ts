/**
 * ## Syntax for Route Expressions:
 * - **Exact Match**: To match an exact path, simply use the path string prefixed with `^` and suffixed with `$`.
 *   Example: `'^/exact-path$'` matches only `/exact-path`.
 *
 * - **Prefix Match**: To match any path that starts with a certain segment, use `^` followed by the path segment.
 *   Example: `'^/start-of-path'` matches any path starting with `/start-of-path` like `/start-of-path/item`.
 *
 * - **Dynamic Segments**:
 *   - **Wildcard**: To include a wildcard segment that matches any characters, use `(.*)` after the segment.
 *     Example: `'^/browse(.*)'` matches `/browse`, `/browse/`, and `/browse/any/sub-path`.
 *   - **Named Parameters**: To capture specific segments of a path, use `:name` where `name` is the variable to hold the path segment.
 *     Example: `'^/user/:userId/post/:postId'` to match paths like `/user/123/post/456`.
 *
 * ## Usage Examples:
 * Below are examples of how to implement route expressions in an array for use in middleware to check against the current URL.
 *
 * ```javascript
 * const publicRoutes = [
 *   '^/$',                       // Matches the root path exactly
 *   '^/auth/verify-email$',      // Matches this specific path exactly
 *   '^/browse(.*)'               // Matches any path starting with /browse
 * ];
 *
 * function matchesAnyPublicRoute(url) {
 *   return publicRoutes.some(pattern => new RegExp(pattern).test(url));
 * }
 * ```
 *
 * Use these patterns to manage access controls, redirect logic, or simply to apply specific handlers based on URL paths.
 * Note: Always test your regex patterns to ensure they accurately match the intended paths without unintended overlaps.
 */

export const publicRoutes = ['/$', '/auth/verify-email$', '/terms', '/privacy'];

export const authRoutes = [
  '/auth/login',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export const apiAuthPrefix = ['/api/auth(.*)'];

//Default redirect after sign in
export const DEFAULT_LOGIN_REDIRECT = '/chat';

//Default redirect after sign out
export const DEFAULT_LOGOUT_REDIRECT = '/auth/login';
