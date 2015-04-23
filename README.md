# Wegweiser

[![Build Status](https://travis-ci.org/quinnjs/wegweiser.svg?branch=master)](https://travis-ci.org/quinnjs/wegweiser)

A router for [Quinn](https://www.npmjs.org/package/quinn),
powered by [routington](https://www.npmjs.org/package/routington).

For decorators, you'll need babel with `--stage 1`.

```js
import { createRouter, GET, PUT } from 'wegweiser';

const simpleHandler = GET('/my/scope')(req => {
  return respond().body('ok');
});

const usingDecorators = {
  @GET('/add/:a/:b')
  getSum(req, { a, b }) {
    return respond().body(`${a} + ${b} = ${a + b}`);
  }
};

class PretendingItsJava {
  @PUT('/user/:username/profile')
  async updateProfile(req, { username }) {
    const data = await readJson(req);
    return respond.json({ ok: true, firstName: data.firstName });
  }
}

const router = createRouter(simpleHandler, usingDecorators, PretendingItsJava);
// router is a quinn handler: request => response
```
