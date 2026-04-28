---
description: Deploy frontend to Cloudflare Pages and workers to Cloudflare Workers
---

## Pre-conditions
- All sprint issues are merged to `main`
- All tests are passing on `main`
- You have Wrangler authenticated: `wrangler whoami`

## Deploy Frontend (Cloudflare Pages)
Cloudflare Pages auto-deploys on push to `main` via GitHub integration. Manual deploy:

// turbo
1. Build the frontend:
   ```
   pnpm --filter housewins-app build
   ```

2. If auto-deploy is not configured, deploy manually:
   ```
   wrangler pages deploy dist --project-name housewins
   ```

## Deploy Workers (Cloudflare Workers)

// turbo
3. Deploy all workers:
   ```
   pnpm --filter housewins-workers deploy
   ```

   Or deploy a specific worker:
   ```
   wrangler deploy --config workers/wrangler.toml
   ```

## Verify Deployment

4. Run smoke tests against the production URL:
   ```
   PLAYWRIGHT_BASE_URL=https://housewins.pages.dev pnpm --filter housewins-app test:e2e
   ```

5. Manually QA each game page in the browser:
   - Place a bet on each game
   - Confirm global counter updates
   - Confirm balance changes
   - Confirm odds panel shows correct values

## Rollback
If a production issue is found:
```
wrangler rollback --project-name housewins
```
For Workers, redeploy the previous commit:
```
git revert HEAD && git push origin main
```
