> A Future is a placeholder object for a value that may not yet exist


# Installation

```bash
npm install fp-future
```

# FP Future library

It is useful for blackbox testing without weird injections and other things.

```ts
it("executes the callback", async () => {
  const somethingToBeResolved = future();

  entity.onClick(event => {
    somethingToBeResolved.resolve(event);
  });

  const nonce = Math.random();

  setTimeout(() => somethingToBeResolved.reject(new Error("timeout")), 1000);

  entityEngine.triggerClick(nonce);

  const receivedNonce = await somethingToBeResolved;

  expect(receivedNonce).toEq(nonce);
});
```
