import * as Sentry from '@sentry/node'
import type { ApplicationService } from '@adonisjs/core/types'
import type { SentryConfig } from '../src/types/main.js'

export default class MonitoringProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const config = this.app.config.get<SentryConfig>('sentry', {})

    if (config.enabled) {
      Sentry.init(config)
    }
  }
}
