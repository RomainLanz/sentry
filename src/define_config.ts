/*
 * @rlanz/sentry
 *
 * (c) Romain Lanz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { SentryConfig } from './types/main.js'

export function defineConfig<T extends SentryConfig>(config: T): T {
  return config
}
