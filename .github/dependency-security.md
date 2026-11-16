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

## Second change: remove obsolete build/test dependency trees

Upgrade Vue CLI to 5, webpack to 5, karma-webpack to 5, and matching Less/raw
loaders. Remove the unused `@vue/eslint-config-standard` dependency, whose old
webpack resolver retained the obsolete crypto tree. The active lint rules remain
in the repository's existing ESLint configuration. VEUI uses ESLint 7 for the
CLI 5 lint integration; keep the root ESLint 6/plugin-vue 6 pair compatible for
repository linting, with vulnerable descendants patched by overrides.
Migrate the theme's Babel 6 presets to Babel 7, AVA to 4 with
`@babel/register`, and esbuild to 0.25. Autoprefixer 10 matches the theme's PostCSS 8
pipeline. These changes remove `request`, `html-minifier`, `babel-traverse`,
`simple-git`, `property-expr`, webpack 4's crypto tree (including unpatched
`elliptic`), and the old update notifier's `got` dependency.

Additional scoped overrides are necessary because the latest compatible parent
releases still request vulnerable dependencies:

| Override | Compatibility check / purpose |
| --- | --- |
| Vue CLI's `webpack-dev-server` 4 → patched 5 | Use `setupMiddlewares` for the existing upload routes. |
| `webpack-dev-middleware` 5/6 → patched 7 | Supports webpack 5; removes both known path-traversal advisories. |
| `serialize-javascript` → patched 7 | Retains its synchronous CommonJS serialization API; development requires Node 20. |
| `cross-spawn` 5 → patched 6; `flatted` → patched 3; `tmp` → patched 0.2 | Retain the APIs used by the existing lint tools. |
| `generic-names` 1's `loader-utils` → patched 1.4 | Uses only `interpolateName`; checked that generated CSS module names are unchanged. Removes JSON5 0.x too. |
| `sockjs`'s `uuid` → patched 11 | Retains the CommonJS `v4()` API used for session IDs. |
| `@vue/component-compiler`'s Stylus → 0.59 | Retains its rendering API and removes the old CSS parser/URI decoder; stays on glob 7. |
| `karma-webpack`'s `minimatch` → patched 11 | Retains its named CommonJS `minimatch()` export. |

Keep the existing spec globs and assertions. Karma-webpack 5 normally shares a
module cache between spec files; disable shared runtimes/chunks to preserve the
old per-file Vue and Vue Test Utils state. Keep Babel in browser mode for Karma,
use Sinon's browser bundle, and adapt the loader test's source extraction to
webpack 5/raw-loader 4. The TagInput fixture explicitly blurs its input rather
than focusing a non-focusable document body; failed focus assertions previously
left DOM behind and caused downstream drag/prompt failures.
The table layout test uses the existing `doubleNextFrame()` helper before
asserting measured column offsets, rather than assuming a zero-delay timer has
allowed ResizeObserver/layout work to finish.

Keep the validated Less 4.1.2 and rimraf 4.1.4 versions. Icon/theme build scripts
use a Babel module-loading hook because `esm` fails on Vercel's Node 24 runtime.
The hook only transforms module syntax and ignores browser Babel configurations.
The complete instrumented browser suite needs an 8 GB heap; the
former 4 GB limit failed locally and on GitHub CI.

The combined changes remove vulnerable versions for **186 of 195 baseline alert
entries**, including **all 16 critical entries**. Nine remain:

| Remaining alerts | Roots | Smallest safe follow-up |
| --- | --- | --- |
| PostCSS: #60, #96, #217, #249, #252, #256 | Vue CLI's `@vue/component-compiler-utils` (PostCSS 7), and `rollup-plugin-vue > @vue/component-compiler > postcss-modules-sync` (PostCSS 5/6/7). | Replace the legacy Vue 2 CSS compilation integrations with a supported PostCSS 8 pipeline, with scoped-style/CSS-module and theme output regression checks. Do not force PostCSS 8 into old plugins via a global override. |
| Vue: #138; vue-template-compiler: #110, #123 | Vue 2 runtime, test utils, CLI, and Rollup compiler. | Requires a supported framework/compiler migration; no compatible patched Vue 2 release exists for these advisories. Preserve the current Vue 2 peer contract until that migration is explicitly reviewed. |

The live npm audit database also contains advisories absent from the captured
Dependabot backlog. Audit results must therefore be reported separately from the
195-entry baseline; this change does not claim a clean audit.

Validation: all 875 browser tests, two Babel plugin tests, and three loader tests
pass. Frozen pnpm 9 installation, package builds, the production demo, and
component scanning pass. The webpack-dev-server 5 demo renders in a browser;
XHR/iframe uploads and downloading the uploaded file pass with the existing
routes. The live audit has no critical findings; remaining packages are PostCSS,
Vue, vue-template-compiler, and deepmerge (no patched release reported).

References: [Vue CLI 5 migration](https://cli.vuejs.org/migrations/migrate-from-v4.html),
[webpack 5 migration](https://webpack.js.org/migrate/5/),
[open repository alerts](https://github.com/ecomfe/veui/security/dependabot).
