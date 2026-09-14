const assert = require("assert");
const { greet } = require("./index");

assert.strictEqual(greet("World"), "Hello, World! Published via GitHub Packages.");
assert.throws(() => greet());

console.log("All tests passed.");
