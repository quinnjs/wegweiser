# Wegweiser

A router for [Quinn](https://www.npmjs.org/package/quinn).

```js
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
```
