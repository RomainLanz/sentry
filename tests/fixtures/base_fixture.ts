/*
 * @rlanz/sentry
 *
 * (c) Romain Lanz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { IgnitorFactory } from '@adonisjs/core/factories'
import { getActiveTest } from '@japa/runner'
import type { Test } from '@japa/runner/core'
import { assertExists } from '@poppinss/utils/assert'
import { Application } from '@adonisjs/core/app'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export class BaseFixture {
  protected context: { app: Application<any> | undefined } = {
    app: undefined,
  }

  protected test: Test<any> | undefined

  getActiveTest() {
    if (this.test) {
      return this.test
    }

    this.test = getActiveTest()

    assertExists(this.test, 'Cannot access test context outside of a test')

    return this.test
  }

  async givenIHaveAnApplication() {
    this.getActiveTest().context.fs.baseUrl = BASE_URL
    this.getActiveTest().context.fs.basePath = BASE_URL.pathname

    await this.getActiveTest().context.fs.create('.env', '')
    await this.getActiveTest().context.fs.createJson('tsconfig.json', {})
    await this.getActiveTest().context.fs.create(
      'start/env.ts',
      `export default Env.create(new URL('./'), {})`
    )
    await this.getActiveTest().context.fs.create(
      'start/kernel.ts',
      `
          import router from '@adonisjs/core/services/router'
          import server from '@adonisjs/core/services/server'

          router.use([
            () => import('@adonisjs/core/bodyparser_middleware'),
          ])

          server.use([])
        `
    )
    await this.getActiveTest().context.fs.create('adonisrc.ts', `export default defineConfig({})`)

    const ignitor = new IgnitorFactory()
      .withCoreProviders()
      .withCoreConfig()
      .create(BASE_URL, {
        importer: (filePath) => {
          if (filePath.startsWith('./') || filePath.startsWith('../')) {
            return import(new URL(filePath, BASE_URL).href)
          }

          return import(filePath)
        },
      })

    const app = ignitor.createApp('web')
    await app.init().then(() => app.boot())

    this.context.app = app
  }
}
