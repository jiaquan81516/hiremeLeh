# Scheduled Job Refresh for HiremeLeh

This document explains the scheduled job refresh setup for HiremeLeh.

## What It Does

The backend exposes a protected refresh endpoint that reuses the existing MyCareersFuture fetch and MongoDB upsert logic.

GitHub Actions calls that endpoint every 6 hours so the job dataset stays fresh without requiring a full app redeploy.

## Why GitHub Actions Schedule Is Used

GitHub Actions provides a simple hosted scheduler for this project.

This keeps the recurring refresh trigger outside the app server and makes the refresh behavior easy to inspect from the GitHub Actions UI.

## Refresh Endpoint

Endpoint:

```txt
POST /api/jobs/refresh
```

Request header required:

```txt
x-refresh-secret
```

The backend compares that header against:

```txt
REFRESH_JOBS_SECRET
```

If the secret is valid, the backend refreshes job data and returns a JSON summary.

## Required GitHub Secrets

Add these in GitHub:

```txt
Settings -> Secrets and variables -> Actions
```

Required secrets:

```txt
AZURE_API_BASE_URL
REFRESH_JOBS_SECRET
```

## Required Azure App Service Setting

Add this in Azure App Service environment variables:

```txt
REFRESH_JOBS_SECRET
```

Use the same secret value in Azure App Service and GitHub Actions.

## Manual Trigger

You can run the refresh manually from GitHub Actions:

```txt
GitHub -> Actions -> Scheduled Job Data Refresh -> Run workflow
```

## Logs

Check refresh activity in:

```txt
GitHub Actions run logs
Azure App Service log stream
```

The workflow only calls the backend refresh endpoint.

It does not deploy the frontend or backend application.

## Manual Test

Example:

```bash
curl -X POST "https://your-backend-url.azurewebsites.net/api/jobs/refresh" \
  -H "x-refresh-secret: your-secret"
```
