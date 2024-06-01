/*
 * @rlanz/sentry
 *
 * (c) Romain Lanz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as SentrySDK from '@sentry/node'

export interface SentryConfig extends SentrySDK.NodeOptions {
  /**
   * Enable or disable Sentry
   */
  enabled: boolean

  dsn: string
}
