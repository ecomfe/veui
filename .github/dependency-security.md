# Dependency security remediation

Baseline: `1150ee16` on `main`; 195 open Dependabot alert entries retrieved on
2026-11-16. Counts below compare the installed lockfile versions against each
alert's vulnerable version range, including duplicate alerts for different
manifests/version lines. GitHub closes alerts only after changes reach the default
branch. No alerts are dismissed or excluded from auditing.

## Dependency roots

| Direct root | Vulnerable descendants / affected functionality |
| --- | --- |
| `veui > lodash` | Published runtime dependency; update its declared minimum as well as the lockfile. |
| `@vue/cli-service` 4 and `webpack` 4 (VEUI and loader tests) | `pbkdf2`, `browserify-sign`, `elliptic`, `bn.js`, `cipher-base`, `sha.js`, `micromatch`, `braces`, `serialize-javascript`; bundler and browser polyfills. |
| `@vue/cli-service > webpack-dev-server` | `selfsigned > node-forge`, `ws`, `websocket-driver`, `express`, `body-parser`, `qs`, `http-proxy-middleware`, `webpack-dev-middleware`, `ip`; local development server. |
| `@vue/cli-service > @vue/cli-shared-utils` | `launch-editor > shell-quote`, `request > form-data / tough-cookie / qs / uuid`; development tooling. |
| `@vue/cli-service > html-webpack-plugin` and CSS optimization plugins | `html-minifier`, `loader-utils`, `svgo > nth-check`, old PostCSS; demo build. |
| `veui > lint-staged` 8 | `g-status > simple-git` and `yup > property-expr`; local commit hooks. Align with root `lint-staged` 10, which removes both trees. |
| `karma` | `socket.io > engine.io / socket.io-parser / ws`; browser test server. |
| `ava` 3 (Babel plugin and loader) | `update-notifier > latest-version > package-json > got`; test runner. |
| Theme's Babel 6 presets | `babel-traverse`, `browserslist` 3; legacy Babel configuration. |
| `rollup-plugin-vue` 5 | `@vue/component-compiler > postcss-modules-sync / stylus` brings old PostCSS, `loader-utils`, `json5`, `decode-uri-component`; library build. |
| `eslint` 6 and Vue CLI ESLint plugin | `flatted`, `inquirer > external-editor > tmp`, `yorkie > execa > cross-spawn`; lint tooling. |
| `mocha`, Babel, Rollup, theme CSS tools | Pinned `js-yaml`, `minimatch`, `diff`, `debug`, plus patched Babel, Rollup, PostCSS and selector-parser releases; tests and builds. |
| `vue` 2 / `vue-template-compiler` 2 | Framework runtime/template compiler; no compatible patched Vue 2 release for the open advisories. |

## First change: compatible dependency refresh

Refresh the pnpm 9 lockfile within existing direct dependency ranges and raise
direct security-related minimums. This removes the vulnerable versions for 142
of the 195 baseline alert entries; 53 remain. Keep Vue 2, webpack 4, existing
test cases, and the pnpm 9 / Node 20 CI environment.

Overrides are limited to dependencies that retain the APIs their callers use:

| Override | Reason |
| --- | --- |
| `selfsigned <2` → `^2.4.1` | Moves certificate generation from `node-forge` 0.x to patched 1.x while retaining synchronous `generate()`. |
| `form-data <2.5.6` → `^2.5.6` | `request` pins the vulnerable 2.3 line. |
| `js-yaml >=3 <3.15.2` → `^3.15.2` | Mocha pins 3.13.1. Keep the v3 API. |
| `minimatch >=3 <3.1.4` → `^3.1.4` | Mocha's older glob tree pins 3.0.4. Keep the v3 API. |
| `diff >=3 <3.5.1` → `^3.5.1` | Mocha pins the vulnerable 3.5.0 release. |
| `debug >=3.2.0 <3.2.7` → `^3.2.7` | Replace the vulnerable pinned v3 release. |

`lint-staged` 10 stages changes itself, so its task list no longer runs `git add`.
The existing PostCSS plugin patch is retained.

## Remaining work and compatibility boundaries

1. Upgrade the build/test tools together: Vue CLI 5, webpack 5 and matching
   Karma/loader integrations. This removes webpack 4's crypto/browser polyfills,
   obsolete minifiers, middleware and `request` tree. Vue CLI 5's default dev
   server is also vulnerable, so verify a patched v5 server and its middleware
   instead of stopping at the CLI upgrade. Preserve the existing test patterns
   and validate development-server uploads and production demo builds.
2. Migrate the remaining independent tools: Babel 6 theme configuration to Babel
   7, AVA's obsolete update notifier, esbuild, and lint tool descendants. Replace
   legacy Vue/Rollup CSS compilation only with demonstrated build compatibility;
   do not force PostCSS 8 into plugins written for PostCSS 5–7.
3. Track Vue 2 framework/compiler advisories separately. A Vue 3 migration changes
   the supported framework and public component behavior, so it cannot be treated
   as a compatible dependency update. The open `elliptic` advisory likewise has
   no patched release; remove its dependency roots instead of overriding it.

The live npm audit database also contains advisories absent from the captured
Dependabot backlog. Audit results must therefore be reported separately from the
195-entry baseline; this change does not claim a clean audit.

References: [Vue CLI 5 migration](https://cli.vuejs.org/migrations/migrate-from-v4.html),
[webpack 5 migration](https://webpack.js.org/migrate/5/),
[open repository alerts](https://github.com/ecomfe/veui/security/dependabot).
