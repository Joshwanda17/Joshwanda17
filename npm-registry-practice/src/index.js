/**
 * Tiny sample export so the package has something real to publish and install.
 */
function greet(name) {
  if (!name) {
    throw new Error("name is required");
  }
  return `Hello, ${name}! Published via GitHub Packages.`;
}

module.exports = { greet };
