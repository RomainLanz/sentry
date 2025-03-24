/*
 * @rlanz/sentry
 *
 * (c) Romain Lanz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Sentry } from './sentry.js'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SentryMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const activeSpan = Sentry.getActiveSpan()
    const rootSpan = activeSpan && Sentry.getRootSpan(activeSpan)

    if (rootSpan) {
      Sentry.updateSpanName(rootSpan, ctx.routeKey || 'unknown')
    }

    return next()
  }
}
