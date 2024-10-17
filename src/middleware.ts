/*
 * @rlanz/sentry
 *
 * (c) Romain Lanz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as SentrySDK from '@sentry/node'
import { Sentry } from './sentry.js'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SentryMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const client = SentrySDK.getClient()
    const scope = new SentrySDK.Scope()

    scope.setClient(client)
    scope.setTag('url', ctx.request.url())

    ctx.sentry = scope
    ctx.containerResolver.bindValue(Sentry, scope)

    await SentrySDK.startSpan(
      {
        name: ctx.routeKey || 'unknown',
        op: 'http.server',
        scope,
      },
      async () => {
        await next()
      }
    )
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    sentry: SentrySDK.Scope
  }
}
