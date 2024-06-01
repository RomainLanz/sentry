/*
 * @rlanz/sentry
 *
 * (c) Romain Lanz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { stubsRoot } from './stubs/main.js'
import type Configure from '@adonisjs/core/commands/configure'

/**
 * Configures the package
 */
export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  /**
   * Publish config file
   */
  await codemods.makeUsingStub(stubsRoot, 'config/session.stub', {})

  /**
   * Define environment variables
   */
  await codemods.defineEnvVariables({ SENTRY_DSN: '<your_dns_url>' })
  /**
   * Define environment variables validations
   */
  await codemods.defineEnvValidations({
    variables: {
      SENTRY_DSN: 'Env.schema.string()',
    },
    leadingComment: 'Variables for configuring @rlanz/sentry package',
  })

  /**
   * Register middleware
   */
  await codemods.registerMiddleware('router', [
    {
      path: '@rlanz/sentry/middleware',
      position: 'before',
    },
  ])

  /**
   * Register provider
   */
  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@rlanz/sentry/provider')
  })
}
