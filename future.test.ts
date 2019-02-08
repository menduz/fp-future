import future from ".";

declare var setTimeout: any, console: any;

describe("sanity tests", () => {
  it("must pass", async () => {
    const x = future();

    setTimeout(() => {
      x.resolve(1);
    }, 100);

    await x;
  });

  it("must fail", async () => {
    const x = future();

    setTimeout(() => {
      x.reject(new Error("did fail"));
    }, 100);

    let didFail = future();

    x.catch(() => {
      didFail.resolve(true);
    });

    setTimeout(() => {
      didFail.reject(new Error("did NOT fail"));
    }, 200);

    console.assert((await didFail) === true, "did not fail");
  });
});
