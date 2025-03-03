/*
 * @rlanz/sentry
 *
 * (c) Romain Lanz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { assertExists } from '@poppinss/utils/assert'
import { BaseFixture } from './base_fixture.js'
import Configure from '@adonisjs/core/commands/configure'

export class ConfigureFixture extends BaseFixture {
  async whenIRunConfigure() {
    assertExists(this.context.app, 'Cannot access app context without initializing it')

    const ace = await this.context.app.container.make('ace')
    ace.ui.switchMode('raw')

    const command = await ace.create(Configure, ['../../../index.js'])
    await command.exec()
  }

  async thenShouldRegisterProvider() {
    await this.getActiveTest().context.assert.fileExists('adonisrc.ts')
    await this.getActiveTest().context.assert.fileContains('adonisrc.ts', '@rlanz/sentry/provider')
  }

  async thenShouldRegisterMiddleware() {
    await this.getActiveTest().context.assert.fileExists('start/kernel.ts')
    await this.getActiveTest().context.assert.fileContains(
      'start/kernel.ts',
      '@rlanz/sentry/middleware'
    )
  }

  async thenConfigurationShouldBeCreated() {
    await this.getActiveTest().context.assert.fileExists('config/sentry.ts')
  }

  async thenEnvironmentVariablesShouldBeAdded() {
    await this.getActiveTest().context.assert.fileContains('.env', 'SENTRY_DSN')
    await this.getActiveTest().context.assert.fileContains(
      'start/env.ts',
      'SENTRY_DSN: Env.schema.string()'
    )
  }
}
