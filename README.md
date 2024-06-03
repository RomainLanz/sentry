<div align="center">
  <img src="https://github.com/RomainLanz/sentry/assets/2793951/229f22b4-6340-482d-8244-9dce18ca395f" alt="@rlanz/sentry">
</div>

<div align="center">

[![typescript-image]][typescript-url]
[![gh-workflow-image]][gh-workflow-url]
[![npm-image]][npm-url]
[![npm-download-image]][npm-download-url]
[![license-image]][license-url]

</div>

<hr />

`@rlanz/sentry` is a simple wrapper around the Sentry SDK to make it easier to use in a AdonisJS application.

## Installation

```sh
node ace add @rlanz/sentry
```

## Usage

The package will automatically register a middleware, configure the Sentry SDK and add an instance of the SDK to the `IoC Container` and the `HttpContext`.

```ts
import type { HttpContext } from '@adonisjs/core/http'

export default class HelloController {
  greet({ params, sentry, response}: HttpContext) {
    sentry.captureMessage(`Hello, ${params.name}!`)

    return response.ok({ message: `Hello, ${params.name}!` })
  }
}
```

Since the SDK is also added to the `IoC Container`, you can also use it in your services.

```ts
import { inject } from '@adonisjs/core'
import { Sentry } from '@rlanz/sentry'

@inject()
export class GreetingService {
  constructor(private sentry: Sentry) {}
  
  greet(name: string) {
    this.sentry.captureMessage(`Hello, ${name}!`)
    
    return `Hello, ${name}!`
  }
}
```

### Capturing Errors

You can capture errors by calling the `captureException` method on the SDK instance inside your exception handler.

```ts
export default class HttpExceptionHandler extends ExceptionHandler {
  // ...

  async report(error: unknown, ctx: HttpContext) {
    if (this.shouldReport(error as any)) {
      ctx.sentry.captureException(error)
    }

    return super.report(error, ctx)
  }
}
```

### Assigning User Context

You can assign user context to the Sentry SDK by calling the `setUser` method on the SDK instance once you are logged in.

```ts
export default class SilentAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // We are authenticating the user
    await ctx.auth.check()

    // If the user is authenticated, we assign the user context to Sentry
    if (ctx.auth.isAuthenticated) {
      const user = ctx.auth.getUserOrFail()
      
      ctx.sentry.setUser({
        id: user.id, 
        email: user.email, 
        username: user.username,
      });
    }
    
    return await next();
  }
}
```

### Adding Integrations

Sentry provides multiple integrations to enhance the data captured by the SDK. You can add integrations by changing the `integrations` array inside the configuration `config/sentry.ts`.

For example, if you want to add profiling to your application, you can add the `Profiler` integration.

```sh
npm install @sentry/profiling-node@7
```

```ts
// config/sentry.ts

import { nodeProfilingIntegration } from '@sentry/profiling-node';

export default defineConfig({
  // ...
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 0.2,
})
```

[gh-workflow-image]: https://img.shields.io/github/actions/workflow/status/rlanz/sentry/checks.yml?branch=main&style=for-the-badge
[gh-workflow-url]: https://github.com/rlanz/sentry/actions/workflows/checks.yml
[npm-image]: https://img.shields.io/npm/v/@rlanz/sentry.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@rlanz/sentry
[npm-download-image]: https://img.shields.io/npm/dm/@rlanz/sentry?style=for-the-badge
[npm-download-url]: https://www.npmjs.com/package/@rlanz/sentry
[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: https://www.typescriptlang.org
[license-image]: https://img.shields.io/npm/l/@rlanz/sentry?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md
