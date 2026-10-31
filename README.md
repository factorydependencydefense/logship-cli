# logship-cli

Groups shipped log lines by service. Part of the dependency-defense demo fleet.

```bash
npm ci
npm test
node bin/logship.js group app.log
```

## Tests

`npm test` runs `test/*.test.js`: `test/logs.test.js` plus `test/preservation.test.js`, which pin the
whole parsed and grouped output of `parseLine`, `groupByService`, `servicesSeen` and `worstFirst`, and
the CLI's usage and unknown-command messages. They must stay green across a lodash upgrade, so a
remediation PR can use them as proof it changed no behaviour.

There is no characterization suite here, because no vulnerable behaviour is observable through this
package's API (see below).

`npm run test:security` runs `test/security/**/*.test.js` and is deliberately **not** part of
`npm test`. It asserts that a service name read out of an untrusted log line cannot reach
`Object.prototype`.

All 4 security tests are **green today**. The advisory against the pinned lodash version is real, but
this package only uses `groupBy`, `sortBy` and `uniq`. `groupBy` writes a hostile `__proto__` service
as an own key rather than walking into the prototype. These tests exist to document the invariant and
catch a regression if the parser starts using a deep-write lodash function such as `set` or `merge`.

What these tests do **not** cover: the planted unused dependencies (`left-pad`, `request`), the bundled
`dist/logship.js`, the `readFileSync`/stdout path inside `run` for a valid command, log lines large
enough to matter, dynamic `require`, and `request`'s network surface.
