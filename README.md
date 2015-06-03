# Wegweiser

[![Build Status](https://travis-ci.org/quinnjs/wegweiser.svg?branch=master)](https://travis-ci.org/quinnjs/wegweiser)

> Wegweiser {m}, Wegweiser {pl}:
> * signpost; direction sign; guide sign [Am.]
> * (figurative) guide [e.g. a book]
> * a router for [Quinn](https://www.npmjs.org/package/quinn),
>   powered by [routington](https://www.npmjs.org/package/routington)
>   and [footnote](https://www.npmjs.com/package/footnote).

## Install

```bash
npm install --save wegweiser
```

## Example

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

const objectOrInstance {
  @GET('/object/:op')
  getObject(req, { op }) { return respond.json({ op }); }
}

const router = // router is a quinn handler: request => response
  createRouter(simpleHandler, PretendingItsJava, objectOrInstance);
```

For [decorators](https://github.com/wycats/javascript-decorators),
you'll need babel with `--stage 1`.

## API

### `createRouter(...routes)`

*This is also the default export.*

Each argument to this function should be an annotated function,
a class with annotated methods,
or an object with annoated methods.
Both for objects and classes the prototype chain will be scanned.
Routes have to be unambiguous.
If the same method and path combination is configured twice,
creating the router will fail.

The result is a router; a function of form `request => result`.

The `request` is expected to have two properties:

* `method: String`: An HTTP method, e.g. `'GET'`.
* `url: String`: A url path, e.g. `'/foo?a=b'`.

If one of the routes matches, the router will call the route handler
with two arguments: the `request` (just passed through) and `params`.
`params` is an object containing the path parameters.

##### Example

```js
GET('/users/:id')(f);
createRouter(f)({ method: 'GET', 'url': '/users/robin' });
// Calls `f` with `(request, { id: 'robin' })`.
```

The return value of the router is whatever the route handler returns,
no changes or assumptions are made by `wegweiser` itself.
If no route matches, the router will return `undefined`.

### `router.resolve(req)`

Can be used to retrieve the function that would be called for a given request.
It returns either `undefined` (if no route matches the request)
or an object with the following properties:

* `params`: The route parameters.
* `handler`: The request handler, ready to be called with `req` and `params`.

For class method routes, the `handler` will have two properties itself:

* `ctor`: The constructor of the class.
* `key`: The property key of the method to call on the instance.

##### Example

```js
class MyResource {
  constructor(db) { this.db = db; }

  @GET('/my/:id')
  getById(req, {id}) { return this.db.getById(id); }
}
const router = createRouter(MyResource);

const req = { method: 'GET', url: '/my/foo' };
const {params, handler} = router.resolve(req);
const instance = someDIContainer.construct(handler.ctor);
return instance[handler.key](req, params);
```

### `Route(method: String, path: String)`

A `footnote` annotation decorator that adds metadata to functions or methods
to turn them into valid arguments for `createRouter`.

The return value is a decorator function that supports two different call styles:

* `Route('GET', '/')(f: Function)`: Annotates a function.
* `Route('GET', '/')(prototype, propertyKey, propertyDescriptor)`: Annotates a method.

When a method is annotated, the constructor of the class is tracked.
Whenever the route is matched, a new instance of the class will be created
and the method will be called on that instance.
The arguments the router passes into functions and methods are the same (see `createRouter above).

### `GET(path: String)` / `POST(path)` / ...

`Route` partially applied with an HTTP verb.
Unless you need to support some *very* exotic HTTP verbs,
you'll use these instead of `Route` directly.
