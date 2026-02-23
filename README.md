# sample-waku-render

This is a minimal `pnpm` + `Waku` sample project that can be deployed to `render.com`.

## Run Locally

```bash
pnpm install
pnpm dev
```

Verify the production build:

```bash
pnpm build
PORT=3000 pnpm start
```

## Deploy to Render

### Option 1: Blueprint with render.yaml

Use the `render.yaml` file in this directory.

1. Push this project to GitHub.
2. In Render, choose **New +** -> **Blueprint**.
3. Select the repository and deploy.

### Option 2: Create a Web Service Manually

In the Render Web Service setup page, configure:

- Runtime: `Node`
- Build Command: `pnpm install --frozen-lockfile && pnpm build`
- Start Command: `pnpm start`
- Environment Variable: `NODE_VERSION=25.6.1` (or another version that satisfies Waku requirements)

## Notes

- Waku CLI does not automatically read `PORT`, so the `start` script explicitly sets `-p ${PORT:-10000}`.
- Render injects `PORT`, and the app starts on that port.
