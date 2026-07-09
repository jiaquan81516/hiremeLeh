# GitLab CI/CD Practice Setup for HiremeLeh

This document explains the GitLab CI/CD practice setup for HiremeLeh.

## Purpose

HiremeLeh is currently deployed using GitHub Actions, Azure Static Web Apps, Azure App Service, and MongoDB Atlas.

This GitLab CI/CD setup is added for learning and practice. It shows how the same CI/CD concept can be represented in GitLab using a `.gitlab-ci.yml` file.

The GitLab setup should not replace the existing GitHub Actions deployment unless the project is intentionally migrated to GitLab later.

## Current Real Deployment

```txt
GitHub
→ GitHub Actions
→ Azure Static Web Apps for frontend
→ Azure App Service for backend
→ MongoDB Atlas
```

## GitLab Practice Pipeline

```txt
GitLab
→ .gitlab-ci.yml
→ backend_check stage
→ frontend_build stage
→ manual deploy_preview stage
```

## Pipeline Stages

### 1. backend_check

This stage:

1. Uses Node.js 24
2. Goes into the `backend/` folder
3. Installs backend dependencies
4. Runs `npm run build --if-present`

This confirms that the backend can install and pass a basic build check.

### 2. frontend_build

This stage:

1. Uses Node.js 24
2. Goes into the `frontend/` folder
3. Installs frontend dependencies
4. Builds the React app
5. Stores the `frontend/build` folder as a GitLab artifact

The frontend uses this GitLab CI/CD variable:

```txt
REACT_APP_API_BASE_URL
```

### 3. deploy_preview

The deployment jobs are manual preview jobs.

They do not deploy automatically.

They explain where Azure deployment would happen if GitLab CI/CD were used as the main CI/CD platform.

## Required GitLab CI/CD Variables

If this project is later deployed through GitLab CI/CD, these variables should be added in GitLab:

```txt
Settings → CI/CD → Variables
```

Required variables:

```txt
AZURE_WEBAPP_PUBLISH_PROFILE
AZURE_STATIC_WEB_APPS_API_TOKEN
REACT_APP_API_BASE_URL
```

Possible backend runtime variables should still be stored in Azure App Service App Settings:

```txt
MONGO_URI
JWT_SECRET
NODE_ENV
FRONTEND_URL
```

## Secrets Safety

Do not commit:

```txt
.env
.env.local
.env.production
MongoDB connection strings
JWT secrets
Azure publish profiles
Azure deployment tokens
*.PublishSettings
```

Secrets should be stored in GitLab CI/CD Variables, GitHub Secrets, or Azure App Service App Settings depending on the deployment platform.

## GitHub Actions vs GitLab CI/CD

### GitHub Actions

GitHub Actions uses workflow files inside:

```txt
.github/workflows/
```

Example:

```txt
.github/workflows/backend-deploy.yml
.github/workflows/frontend-deploy.yml
```

### GitLab CI/CD

GitLab CI/CD uses one main pipeline file:

```txt
.gitlab-ci.yml
```

Instead of GitHub Secrets, GitLab uses:

```txt
Settings → CI/CD → Variables
```

## Adding GitLab as a Second Remote

The real deployment repo should remain GitHub.

Keep GitHub as:

```txt
origin
```

Add GitLab as a second remote called:

```txt
gitlab
```

Example command:

```bash
git remote add gitlab https://gitlab.com/jiaquan81516/hiremeleh-gitlab.git
```

Check remotes:

```bash
git remote -v
```

Expected idea:

```txt
origin  → GitHub repository
gitlab  → GitLab practice repository
```

Push to GitLab:

```bash
git push -u gitlab main
```

For GitLab CI/CD practice branch:

```bash
git push -u gitlab devops/gitlab-cicd-practice
```

Do not replace `origin` with GitLab because GitHub Actions is still the real Azure deployment path.

## Why This Was Added

This was added to understand how CI/CD concepts transfer across platforms.

The same core DevOps flow applies:

```txt
Developer pushes code
Pipeline runs
Dependencies install
App builds
Secrets are injected securely
App deploys to cloud
```

The main difference is the CI/CD platform syntax and where secrets are stored.

## Important Note

This GitLab pipeline is for practice only.

The real production deployment remains GitHub Actions unless the project is intentionally migrated.
