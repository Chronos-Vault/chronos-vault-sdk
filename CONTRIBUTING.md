# Contributing to Chronos Vault SDK

Thank you for your interest in contributing to the Chronos Vault SDK! This document provides guidelines for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We welcome contributors of all experience levels.

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- TypeScript knowledge

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Chronos-Vault/chronos-vault-sdk.git
   cd chronos-vault-sdk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Build:
   ```bash
   npm run build
   ```

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Making Changes

1. Create a new branch from `main`
2. Make your changes
3. Write or update tests
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request

### Commit Messages

Follow conventional commits:

```
type(scope): description

feat(vault): add time-lock support
fix(htlc): correct timeout calculation
docs(readme): update installation instructions
test(bridge): add fee estimation tests
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`

## Code Style

- Use TypeScript strict mode
- Format with Prettier
- Follow existing patterns in the codebase
- Add JSDoc comments for public APIs

### Example

```typescript
/**
 * Creates a new vault with Trinity Protocol security.
 * @param options - Vault creation options
 * @returns The created vault details
 * @throws {ConsensusError} If 2-of-3 consensus fails
 */
async createVault(options: CreateVaultOptions): Promise<Vault> {
  // Implementation
}
```

## Testing

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Specific file
npm test -- tests/integration/vault.test.ts
```

### Writing Tests

- Place tests in `tests/integration/` or `tests/unit/`
- Use descriptive test names
- Test both success and error cases

```typescript
describe('VaultClient', () => {
  it('should create a vault with valid options', async () => {
    const vault = await sdk.vault.createVault({
      name: 'Test Vault',
      vaultType: 'standard',
      chain: 'arbitrum',
    });
    expect(vault.id).toBeDefined();
  });

  it('should throw on invalid vault type', async () => {
    await expect(
      sdk.vault.createVault({ vaultType: 'invalid' as any })
    ).rejects.toThrow(SDKError);
  });
});
```

## Pull Request Process

1. Update the CHANGELOG.md with your changes
2. Ensure CI passes
3. Request review from maintainers
4. Address feedback
5. Squash and merge

### PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Types exported if public API
- [ ] No breaking changes (or documented)

## Reporting Issues

### Bug Reports

Include:
- SDK version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Error messages/stack traces

### Feature Requests

Include:
- Use case description
- Proposed API (if applicable)
- Alternatives considered

## Security

For security vulnerabilities, please email security@chronosvault.org instead of opening a public issue.

## Questions?

- Open a GitHub Discussion
- Check existing issues
- Read the documentation at https://docs.chronosvault.org

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Trinity Protocol!
