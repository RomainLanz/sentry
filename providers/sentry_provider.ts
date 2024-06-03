import * as SentrySDK from '@sentry/node'
import { Sentry } from '../src/sentry.js'
import type { ApplicationService } from '@adonisjs/core/types'
import type { SentryConfig } from '../src/types/main.js'

export default class MonitoringProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const config = this.app.config.get<SentryConfig>('sentry', {})

    if (config.enabled) {
      SentrySDK.init(config)
    }

    this.app.container.bind(Sentry, () => new SentrySDK.Scope())
  }
}
