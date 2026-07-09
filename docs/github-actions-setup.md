# GitHub Actions Setup for HiremeLeh

This document explains the GitHub Actions CI/CD setup for the HiremeLeh project.

## Backend Workflow

File:

```txt
.github/workflows/backend-deploy.yml
```

The backend workflow deploys the Express backend to Azure App Service.

It runs when code is pushed to the `main` branch and files inside the `backend/` folder change.

The workflow:

1. Checks out the latest code from GitHub
2. Sets up Node.js 20
3. Installs backend dependencies
4. Runs a build check if a build script exists
5. Deploys the backend to Azure App Service

Azure App Service app name:

```txt
hiremeleh-api
```

The workflow uses this GitHub secret:

```txt
AZURE_WEBAPP_PUBLISH_PROFILE
```

## Frontend Workflow

File:

```txt
.github/workflows/frontend-deploy.yml
```

The frontend workflow deploys the React frontend to Azure Static Web Apps.

It runs when code is pushed to the `main` branch and files inside the `frontend/` folder change.

The workflow:

1. Checks out the latest code from GitHub
2. Sets up Node.js 20
3. Installs frontend dependencies
4. Builds the React app
5. Deploys the frontend build output to Azure Static Web Apps

The frontend uses this build-time environment variable:

```txt
REACT_APP_API_BASE_URL
```

The workflow uses this GitHub secret:

```txt
AZURE_STATIC_WEB_APPS_API_TOKEN
```

## Required GitHub Secrets

Add these in GitHub:

```txt
Settings → Secrets and variables → Actions → New repository secret
```

Required secrets:

```txt
AZURE_WEBAPP_PUBLISH_PROFILE
AZURE_STATIC_WEB_APPS_API_TOKEN
REACT_APP_API_BASE_URL
```

## Azure Secrets Reminder

Azure secrets should be added only after Azure resources are created.

Backend runtime environment variables should be stored in Azure App Service environment variables, not in GitHub code.

Examples:

```txt
MONGODB_URI
JWT_SECRET
NODE_ENV
FRONTEND_URL
```

Do not commit real `.env` values.

## Simple CI/CD Flow

```txt
Developer pushes code to GitHub
GitHub Actions runs
Dependencies install
App builds
App deploys to Azure
```
