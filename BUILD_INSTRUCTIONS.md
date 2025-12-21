# SDK Build & Deployment Instructions

**Version:** 1.1.0  
**Last Updated:** December 2025

## Prerequisites

- Node.js 18+
- npm 9+ or yarn 3+
- Git
- GitHub account with write access to chronos-vault-sdk

## Local Development

### 1. Clone Repository

```bash
git clone https://github.com/Chronos-Vault/chronos-vault-sdk.git
cd chronos-vault-sdk
npm install
```

### 2. Build the SDK

```bash
# Build once
npm run build

# Build in watch mode (development)
npm run build:watch

# Check for type errors
npm run typecheck
```

### 3. Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### 4. Lint Code

```bash
npm run lint
```

## Build Output

The build produces:

- `dist/index.js` - CommonJS bundle
- `dist/index.mjs` - ES modules bundle
- `dist/index.d.ts` - TypeScript type definitions
- `dist/**/*.d.ts` - Type definitions for submodules

All submodules (`trinity`, `htlc`, `vault`, `bridge`) have their own exports configured in `package.json`.

## Publishing to npm

### Prerequisites

1. npm account at https://www.npmjs.com
2. Organization: `@chronos-vault` configured
3. Two-factor authentication enabled (recommended)
4. Repository linked to GitHub

### Manual Publishing

```bash
# 1. Update version in package.json
npm version patch  # For bug fixes
npm version minor  # For new features
npm version major  # For breaking changes

# 2. Build
npm run build

# 3. Verify dist/ folder exists with all files
ls -la dist/

# 4. Publish
npm publish

# 5. Verify on npm
npm view @chronos-vault/sdk
```

### Automated Publishing (GitHub Actions)

Create `.github/workflows/npm-publish.yml`:

```yaml
name: Publish SDK to npm

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run build
      - run: npm test
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## TypeScript Configuration

The SDK is built with TypeScript strict mode:

```bash
# Check types without building
npm run typecheck

# Build with type checking
npm run build
```

## Package.json Configuration

Key configurations for publishing:

```json
{
  "main": "dist/index.js",              // CommonJS entry
  "module": "dist/index.mjs",           // ESM entry
  "types": "dist/index.d.ts",           // Type definitions
  "exports": {
    ".": { ... },                       // Default export
    "./trinity": { ... },               // Submodule exports
    "./htlc": { ... },
    "./vault": { ... },
    "./bridge": { ... }
  },
  "files": ["dist", "README.md", "LICENSE"],
  "prepublishOnly": "npm run build"     // Auto-build before publish
}
```

## Submodule Imports

Users can import specific modules:

```typescript
// Default import
import { ChronosVaultSDK } from '@chronos-vault/sdk';

// Submodule imports
import { TrinityRPCClient } from '@chronos-vault/sdk/trinity';
import { HTLCRPCClient } from '@chronos-vault/sdk/htlc';
import { VaultRPCClient } from '@chronos-vault/sdk/vault';
import { BridgeRPCClient } from '@chronos-vault/sdk/bridge';
```

## Version Management

### Semantic Versioning

- **MAJOR** (1.0.0 → 2.0.0) - Breaking changes
- **MINOR** (1.0.0 → 1.1.0) - New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1) - Bug fixes

### Release Process

1. Update `CHANGELOG.md` with changes
2. Bump version: `npm version [patch|minor|major]`
3. Build: `npm run build`
4. Test: `npm test`
5. Publish: `npm publish`
6. Create GitHub release with tag

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Type Errors

```bash
# Check type errors
npm run typecheck

# Regenerate types
npm run build
```

### Tests Fail

```bash
# Run with verbose output
npm test -- --reporter=verbose

# Run specific test file
npm test -- tests/integration/vault.test.ts
```

### Cannot Publish to npm

1. Check npm login: `npm whoami`
2. Re-login: `npm login`
3. Verify 2FA enabled
4. Check organization permissions
5. Ensure `.npmignore` is correct

## Distribution Checklist

Before publishing:

- [ ] Version bumped in `package.json`
- [ ] `CHANGELOG.md` updated
- [ ] All tests pass: `npm test`
- [ ] Types check: `npm run typecheck`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Examples tested locally
- [ ] README updated if needed
- [ ] Exports in `package.json` are correct

## Maintenance

### Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Major version updates (risky)
npm install package@latest
```

### Security Audit

```bash
# Check for vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix
```

## Resources

- [npm Documentation](https://docs.npmjs.com)
- [TypeScript Publishing Guide](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)
- [Package.json Guide](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
