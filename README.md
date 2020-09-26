

> **A Future is a placeholder object for a value that may not yet exist**

Futures are well [known data structures](https://en.wikipedia.org/wiki/Futures_and_promises), at it's core, futures, are simply promises. This simple package exposes a simple interface on top of promises to leverage a them as boxed value placeholders.  

# Installation

```bash
npm install fp-future
```

# Interface

```ts
function future<T>(): IFuture<T>;

type IFuture<T> = Promise<T> & {
  resolve: (x: T) => void;
  reject: (x: Error) => void;
  finally: (fn: () => void) => void;
  isPending: boolean;
}
```

# Usage

## Futures are awaitable

```ts
const loading = future()

loading.resolve(123)

assert(await loading == 123)
```

## Futures are awaitable and can be rejected

```ts
const loading = future()

loading.reject(new Error('It did fail'))

try {
  await loading
} catch(e) {
  assert(e.message == 'It did fail')
}
```

## Promisify is easy too

```ts

const loadingFuture = future()

// load(successCallback, errorCallback)
   load(loadingFuture.resolve, loadingFuture.reject)

await loadingFuture

```

## Blackbox testing has never been easier (to read)

It is useful for blackbox testing without _weird injections_ and other magical things.

```ts
it("executes the callback", async () => {
  const didClickFuture = future();

  // happy path
  entity.onClick(clickId => {
    didClickFuture.resolve(clickId);
    //             ^^^^^^^^^^^^^^ 
    //             Here we resolve the future with a click
  });

  // unhappy path
  setTimeout(() => {
    didClickFuture.reject(new Error("Timeout"))
    //             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //             Timeout, just in case we don't receive the event
  }, 1000);

  // Generate synthetic event and trigger the event
  const clickId = Math.random()
  entity.triggerClick(clickId);

  // Await the value or fail!
  const receivedNonce = await somethingToBeResolved;

  // Assertion
  expect(receivedNonce).toEq(clickId);
});
```

## Async-awaitable injection of scripts in an HTML

```ts
async function injectScript(url: string) {
  const theFuture = future<Event>();
  const theScript = document.createElement("script");
  theScript.src = url;
  theScript.async = true;
  theScript.type = "application/javascript";
  theScript.addEventListener("load", theFuture.resolve);
  theScript.addEventListener("error", e => theFuture.reject(e.error));
  document.body.appendChild(theScript);
  return theFuture;
}

async function main() {
  await injectScript("https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js");
  await injectScript("https://www.gstatic.com/firebasejs/7.12.0/firebase-analytics.js");
  await injectScript("https://www.gstatic.com/firebasejs/7.12.0/firebase-auth.js");

  // use the injected scripts
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

```

## Load image data

```ts
async function loadImageData(src: string): Promise<ImageData> {
  const futureColors = future<ImageData>();

  var img = new Image();
  img.crossOrigin = "Anonymous"
  img.onload = function() {
    var imageData = loadingContext.getImageData(0, 0, img.width, img.height);

    futureColors.resolve(imageData);
  };

  img.src = src;

  return futureColors;
}
```
