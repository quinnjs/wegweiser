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

class PretendingItsJava {
  @PUT('/user/:username/profile')
  async updateProfile(req, { username }) {
    const data = await readJson(req);
    return respond.json({ ok: true, firstName: data.firstName });
  }
}

const router = createRouter(simpleHandler, PretendingItsJava);
// router is a quinn handler: request => response
```
