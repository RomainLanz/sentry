/*
 * @rlanz/sentry
 *
 * (c) Romain Lanz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { ConfigureFixture } from './fixtures/configure_fixture.js'

test.group('Configure', (group) => {
  group.tap((t) => t.timeout(10_000))

  let fixture: ConfigureFixture

  group.each.setup(async () => {
    fixture = new ConfigureFixture()
  })

  test('should register provider', async () => {
    await fixture.givenIHaveAnApplication()

    await fixture.whenIRunConfigure()

    await fixture.thenShouldRegisterProvider()
  })

  test('should create configuration file', async () => {
    await fixture.givenIHaveAnApplication()

    await fixture.whenIRunConfigure()

    await fixture.thenConfigurationShouldBeCreated()
  })

  test('should register middleware', async () => {
    await fixture.givenIHaveAnApplication()

    await fixture.whenIRunConfigure()

    await fixture.thenShouldRegisterMiddleware()
  })

  test('should add environment variables', async () => {
    await fixture.givenIHaveAnApplication()

    await fixture.whenIRunConfigure()

    await fixture.thenEnvironmentVariablesShouldBeAdded()
  })
})
