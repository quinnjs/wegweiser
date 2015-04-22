# Wegweiser

[![Build Status](https://travis-ci.org/quinnjs/wegweiser.svg?branch=master)](https://travis-ci.org/quinnjs/wegweiser)

A router for [Quinn](https://www.npmjs.org/package/quinn).

Running the code currently requires io.js v2/next-nightly
with the `--harmony-rest-parameters` flag.
For actually using decorators, babel with `--stage 1` should work.

```js
import { createRouter, GET, PUT } from 'wegweiser';

const simpleHandler = GET `/my/scope` (req => {
  return respond().body('ok');
});

const usingDecorators = {
  @GET `/add/${Number}/${Number}`
  getSum(req, a, b) {
    return respond().body(`${a} + ${b} = ${a + b}`);
  }
};

class PretendingItsJava {
  @PUT `/user/${String}/profile`
  async updateProfile(req, username) {
    const data = await readJson(req);
    return respond.json({ ok: true, firstName: data.firstName });
  }
}

const router = createRouter(simpleHandler, usingDecorators, PretendingItsJava);
// router is a quinn handler; (req) => respond()
```
