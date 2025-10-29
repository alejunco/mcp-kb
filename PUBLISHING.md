# Publishing Guide for mcp-kb

This guide will walk you through the process of publishing this package to npm.

## Pre-Publishing Checklist

✅ All files prepared:
- ✅ LICENSE file created (MIT)
- ✅ .npmignore file created (excludes src, tests, etc.)
- ✅ README.md is comprehensive
- ✅ package.json has all required fields
- ✅ TypeScript builds successfully
- ✅ Shebang (`#!/usr/bin/env node`) is in place

## Step 1: Verify Package Name Availability

Before publishing, check if the package name is available:

```bash
npm search mcp-kb
```

If the name is taken, you have two options:

### Option A: Use a Scoped Package Name (Recommended)

Update `package.json`:
```json
{
  "name": "@your-npm-username/mcp-kb",
  ...
}
```

Then publish with:
```bash
npm publish --access public
```

### Option B: Choose a Different Name

Pick an alternative name like:
- `mcp-knowledge-base`
- `mcp-kb-server`
- `knowledge-base-mcp`

Update the `name` field in `package.json` accordingly.

## Step 2: Login to npm

If you haven't logged in yet:

```bash
npm login
```

Verify you're logged in:
```bash
npm whoami
```

## Step 3: Test the Package Locally

Before publishing, test that everything works:

### Test 1: Verify Build
```bash
npm run build
```

### Test 2: Test Package Contents
```bash
npm pack --dry-run
```

This shows what files will be included in the package.

### Test 3: Test Local Installation
```bash
# Create a test package
npm pack

# In another directory, install it
mkdir test-install
cd test-install
npm install /path/to/mcp-kb-1.0.0.tgz

# Try running it
npx mcp-kb --help
```

### Test 4: Run as Binary
```bash
npm start
# or
node dist/index.js
```

## Step 4: Update Version (if needed)

If you're publishing an update (not first time):

```bash
# For bug fixes (1.0.0 -> 1.0.1)
npm version patch

# For new features (1.0.0 -> 1.1.0)
npm version minor

# For breaking changes (1.0.0 -> 2.0.0)
npm version major
```

This will:
- Update the version in package.json
- Create a git tag
- Commit the change

## Step 5: Publish to npm

### For unscoped packages:
```bash
npm publish
```

### For scoped packages (@username/mcp-kb):
```bash
npm publish --access public
```

The `prepublishOnly` script will automatically build the project before publishing.

## Step 6: Verify the Publication

After publishing, verify it worked:

```bash
# View your package on npm
npm view mcp-kb

# Or for scoped packages
npm view @your-username/mcp-kb

# Test installation
npx mcp-kb@latest
```

## Step 7: Create a Git Tag and Push

```bash
git tag v1.0.0
git push origin main --tags
```

## Step 8: Create a GitHub Release (Optional but Recommended)

1. Go to your GitHub repository
2. Click on "Releases" → "Create a new release"
3. Select the tag you just created (v1.0.0)
4. Write release notes describing:
   - New features
   - Bug fixes
   - Breaking changes
   - Migration guide (if applicable)

## Post-Publishing Tasks

### Update README Badges

Add npm badges to your README.md:

```markdown
[![npm version](https://badge.fury.io/js/mcp-kb.svg)](https://badge.fury.io/js/mcp-kb)
[![npm downloads](https://img.shields.io/npm/dm/mcp-kb.svg)](https://www.npmjs.com/package/mcp-kb)
```

### Share Your Package

- Tweet about it
- Post on Reddit (r/nodejs, r/typescript, etc.)
- Share on LinkedIn
- Add to awesome lists

## Future Updates

When you need to publish an update:

1. Make your changes
2. Test thoroughly
3. Update version: `npm version [patch|minor|major]`
4. Publish: `npm publish`
5. Push git changes: `git push origin main --tags`
6. Create GitHub release

## Troubleshooting

### "Package name already exists"

- Use a scoped package name: `@username/mcp-kb`
- Or choose a different name

### "You do not have permission to publish"

- Make sure you're logged in: `npm whoami`
- For scoped packages, use: `npm publish --access public`
- Check if you're part of the org (for org-scoped packages)

### "Missing required field"

- Verify your package.json has all required fields:
  - name
  - version
  - description (recommended)
  - license (recommended)
  - repository (recommended)

### Build errors before publishing

- Run `npm run build` manually to see the errors
- Fix TypeScript errors
- Ensure all dependencies are installed

## Package Information

Current package details:
- **Name**: mcp-kb
- **Version**: 1.0.0
- **License**: MIT
- **Main**: dist/index.js
- **Binary**: mcp-kb → dist/index.js
- **Files**: dist/, README.md, LICENSE

## npm Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode
- `npm start` - Run the compiled server
- `npm run watch` - Run with auto-reload
- `npm test` - Run tests (placeholder)

## Environment Variables Required

Users will need to set these environment variables:

- `POSTGRES_CONNECTION_STRING` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `VECTOR_INDEX_NAME` - Vector index name (optional, default: knowledge_base)
- `VECTOR_DIMENSION` - Vector dimension (optional, default: 1536)

## Support

After publishing, consider:
- Setting up issue templates on GitHub
- Adding a CONTRIBUTING.md guide
- Creating documentation site
- Setting up automated testing
- Adding CI/CD pipeline

## Semantic Versioning

Follow semantic versioning (semver):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features, backward compatible
- **PATCH** (0.0.x): Bug fixes, backward compatible

Example:
- 1.0.0 → 1.0.1: Bug fix
- 1.0.1 → 1.1.0: New feature added
- 1.1.0 → 2.0.0: Breaking API change

---

**Ready to publish?** Follow the steps above and your package will be live on npm! 🚀

