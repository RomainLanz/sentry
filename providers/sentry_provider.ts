import { Sentry } from '../src/sentry.js'
import type { ApplicationService } from '@adonisjs/core/types'
import type { SentryConfig } from '../src/types/main.js'

export default class SentryProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const config = this.app.config.get<SentryConfig>('sentry', {})

    if (config.enabled) {
      Sentry.init(config)
    }
  }
}
