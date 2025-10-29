# Quick Publishing Checklist

Use this checklist when you're ready to publish to npm:

## Pre-Publish (First Time Only)

- [ ] **Verify npm account**
  ```bash
  npm whoami
  # If not logged in: npm login
  ```

- [ ] **Check package name availability**
  ```bash
  npm search mcp-kb
  # Should return "No matches found" (it's available!)
  ```

- [ ] **Review package.json**
  - [ ] Name is correct
  - [ ] Version is correct
  - [ ] Description is clear
  - [ ] Keywords are relevant
  - [ ] Repository URL is correct
  - [ ] License is set (MIT)

- [ ] **Test build**
  ```bash
  npm run build
  # Should complete without errors
  ```

- [ ] **Preview package contents**
  ```bash
  npm pack --dry-run
  # Review what files will be included
  ```

- [ ] **Test locally**
  ```bash
  npm pack
  # Creates mcp-kb-1.0.0.tgz
  # Install in another directory to test
  ```

## Publishing

- [ ] **Build the package**
  ```bash
  npm run build
  ```

- [ ] **Publish to npm**
  ```bash
  npm publish
  # For scoped package: npm publish --access public
  ```

- [ ] **Verify publication**
  ```bash
  npm view mcp-kb
  ```

- [ ] **Test installation**
  ```bash
  npx mcp-kb@latest
  ```

## Post-Publish

- [ ] **Tag the release**
  ```bash
  git tag v1.0.0
  git push origin main --tags
  ```

- [ ] **Create GitHub release**
  - Go to repository → Releases → New release
  - Select tag v1.0.0
  - Add release notes

- [ ] **Update README with badges** (optional)
  ```markdown
  [![npm version](https://badge.fury.io/js/mcp-kb.svg)](https://www.npmjs.com/package/mcp-kb)
  ```

- [ ] **Share the package** (optional)
  - Social media
  - Relevant communities
  - Your network

## For Future Updates

When publishing updates:

1. **Make changes and test**
2. **Update version**:
   ```bash
   npm version patch  # or minor, or major
   ```
3. **Publish**:
   ```bash
   npm publish
   ```
4. **Push to git**:
   ```bash
   git push origin main --tags
   ```

---

**Current Status**: ✅ Package name `mcp-kb` is available!

**Ready to publish**: Yes! All files are in place.

**Package size**: ~12 KB (compressed)

**Files included**: 15 files (dist/, README.md, LICENSE, package.json)

