# npm Registry Practice — GitHub Packages

Hands-on submission for GitHub's ["Working with the npm registry"](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) guide. This folder is a minimal, real npm package configured to authenticate, publish to, and install from **GitHub Packages** instead of the public npm registry.

## What's here

| File | Purpose |
|:--|:--|
| `package.json` | Scoped package name (`@joshwanda17/npm-registry-practice`), `repository` field pointing at this repo, and `publishConfig.registry` set to `https://npm.pkg.github.com` |
| `.npmrc` | Maps the `@joshwanda17` scope to the GitHub Packages registry, so `npm install`/`npm publish` route there automatically instead of npmjs.org |
| `src/index.js` | A trivial exported function, just so there's a real artifact to publish |
| `../.github/workflows/npm-registry-practice-publish.yml` | CI workflow that publishes the package on every GitHub Release |

## Key concepts demonstrated

### 1. Authentication
GitHub Packages only supports personal access tokens (classic) for interactive/local auth. Two equivalent ways to authenticate locally:

```shell
# Option A — edit ~/.npmrc directly
echo "//npm.pkg.github.com/:_authToken=YOUR_PAT" >> ~/.npmrc

# Option B — npm login
npm login --scope=@joshwanda17 --auth-type=legacy --registry=https://npm.pkg.github.com
```

The PAT needs `write:packages` (and `read:packages`) scope. `read:packages` alone is enough to install.

### 2. Authenticating in CI
Rather than storing a personal access token as a secret, the workflow in this repo uses the automatically-provided `GITHUB_TOKEN`, which is the recommended approach for publishing packages associated with the same repository:

```yaml
permissions:
  contents: read
  packages: write

steps:
  - uses: actions/setup-node@v4
    with:
      registry-url: "https://npm.pkg.github.com"
  - run: npm publish
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

A PAT is only needed in CI when installing packages from a **different** private repository that hasn't granted the workflow's `GITHUB_TOKEN` read access.

### 3. Scoping
GitHub Packages requires scoped package names (`@owner/name`). The `.npmrc` scope mapping (`@joshwanda17:registry=...`) means only requests for that scope get routed to GitHub Packages — everything else still resolves from npmjs.org, so this package can safely sit alongside normal public dependencies.

### 4. Linking the package to this repository
The `repository.url` field in `package.json` matches this repo's GitHub URL, so once published the package is automatically connected to `Joshwanda17/Joshwanda17` and inherits its visibility/access permissions.

## Try it locally

```shell
cd npm-registry-practice
npm test
```

## Publish it for real (requires a PAT or running via the included workflow)

```shell
npm login --scope=@joshwanda17 --auth-type=legacy --registry=https://npm.pkg.github.com
npm publish
```

Or trigger the `Publish npm-registry-practice to GitHub Packages` workflow manually from the Actions tab (`workflow_dispatch`), or by cutting a GitHub Release.
