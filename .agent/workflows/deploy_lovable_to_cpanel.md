---
description: How to automate deployment of Lovable/Vite apps to cPanel
---

# Automated Deployment to cPanel

This workflow automates the deployment of a React/Vite/Lovable application to a cPanel server using GitHub Actions.

## Prerequisites

1.  **Git Repository**: The project must be hosted on GitHub.
2.  **SSH Access**: You must have SSH access enabled on your cPanel account.
3.  **SSH Key Pair**: An ED25519 key pair dedicated to deployment.

## Step-by-Step Setup

### 1. Generate SSH Key (Local Machine)
Run this command in PowerShell to generate a secure key:
```powershell
mkdir -p ~/.ssh
ssh-keygen -t ed25519 -C "github_actions_deploy" -f "$HOME/.ssh/cpanel_deploy_key" -N ""
```

### 2. Authorize Key in cPanel
1.  Log in to **cPanel**.
2.  Go to **SSH Access** -> **Manage SSH Keys** -> **Import Key**.
3.  Paste the contents of `.pub` file (Public Key) and Import.
4.  **Important**: Click **Manage** next to the key and **Authorize** it.

### 3. Configure GitHub Secrets
Run these commands in your project root using the GitHub CLI (`gh`), or add them manually in repo Settings -> Secrets -> Actions:

```bash
# Set Hostname (e.g. server.domain.com)
gh secret set CPANEL_HOST --body "your.server.com"

# Set Username (e.g. myuser)
gh secret set CPANEL_USER --body "myuser"

# Set Private Key (Paste content of private key file)
gh secret set CPANEL_SSH_KEY < path_to_private_key
```

### 4. Create Configuration Files

**`vite.config.ts` Update:**
Ensure base path is relative to avoid white screens:
```typescript
export default defineConfig({
  base: "./",
  // ... other config
});
```

**`.github/workflows/deploy.yml`:**
Create this file to define the build pipeline (see provided template in project).

## How it Works
1.  You push changes to `main`.
2.  GitHub Actions spins up a runner.
3.  It installs Node.js and builds your site (`npm run build`).
4.  It uses `rsync` over SSH to sync the `dist/` folder to `public_html/`.

## Troubleshooting
-   **White Screen**: Check `base: "./"` in `vite.config.ts`.
-   **Permission Denied**: Check cPanel SSH Key Authorization.
-   **Deploy Failed**: Check GitHub Actions logs tab.
