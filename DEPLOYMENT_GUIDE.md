# MarketTrader - Google Cloud Run Deployment Guide

## Prerequisites
- Google Cloud account with billing enabled
- gcloud CLI installed and configured
- Docker installed (for local testing)
- Project ID: `microsaas-projects-2024`

## Overview
The MarketTrader platform consists of two services:
1. **AI Service** (Fastify + Claude API) - Port 8080
2. **Web App** (Next.js) - Port 8080

##  Quick Deployment (Recommended)

### Step 1: Deploy AI Service

```bash
# Navigate to AI service directory
cd services/ai-service

# Deploy to Cloud Run (builds automatically from Dockerfile)
gcloud run deploy markettrader-ai \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="ANTHROPIC_API_KEY=your_key_here" \
  --project=microsaas-projects-2024

# Note the service URL from output (e.g., https://markettrader-ai-xxxxx-uc.a.run.app)
```

### Step 2: Deploy Web App

```bash
# Navigate to web app directory
cd ../../apps/web

# Build Next.js app locally first to generate standalone output
pnpm build

# Deploy to Cloud Run
gcloud run deploy markettrader-web \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_AI_SERVICE_URL=https://markettrader-ai-xxxxx-uc.a.run.app" \
  --project=microsaas-projects-2024
```

## Alternative: Manual Docker Build & Deploy

If automatic build fails, use this method:

### AI Service

```bash
cd services/ai-service

# Build Docker image
docker build -t gcr.io/microsaas-projects-2024/markettrader-ai:latest .

# Test locally
docker run -p 8080:8080 \
  -e ANTHROPIC_API_KEY=your_key_here \
  gcr.io/microsaas-projects-2024/markettrader-ai:latest

# Push to Google Container Registry
docker push gcr.io/microsaas-projects-2024/markettrader-ai:latest

# Deploy to Cloud Run
gcloud run deploy markettrader-ai \
  --image gcr.io/microsaas-projects-2024/markettrader-ai:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="ANTHROPIC_API_KEY=your_key_here" \
  --project=microsaas-projects-2024
```

### Web App

```bash
cd apps/web

# Build Next.js first
pnpm build

# Build Docker image
docker build -t gcr.io/microsaas-projects-2024/markettrader-web:latest -f Dockerfile ../..

# Test locally
docker run -p 8080:8080 \
  -e NEXT_PUBLIC_AI_SERVICE_URL=https://markettrader-ai-xxxxx-uc.a.run.app \
  gcr.io/microsaas-projects-2024/markettrader-web:latest

# Push and deploy
docker push gcr.io/microsaas-projects-2024/markettrader-web:latest

gcloud run deploy markettrader-web \
  --image gcr.io/microsaas-projects-2024/markettrader-web:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_AI_SERVICE_URL=https://markettrader-ai-xxxxx-uc.a.run.app" \
  --project=microsaas-projects-2024
```

## Environment Variables

### AI Service
- `ANTHROPIC_API_KEY` - Your Claude API key (required)
- `PORT` - Server port (default: 8080, set by Cloud Run)
- `NODE_ENV` - Set to `production`

### Web App
- `NEXT_PUBLIC_AI_SERVICE_URL` - URL of deployed AI service (required)
- `PORT` - Server port (default: 8080, set by Cloud Run)
- `NODE_ENV` - Set to `production`

## Troubleshooting

### Build Fails
1. Check Dockerfile syntax
2. Ensure all dependencies in package.json
3. Test Docker build locally first
4. Check Cloud Build logs: `gcloud builds list --project=microsaas-projects-2024`

### Service Won't Start
1. Check logs: `gcloud run services logs read markettrader-ai --region=us-central1`
2. Verify environment variables are set
3. Check health endpoint: `curl https://your-service-url/health`

### Connection Issues
1. Verify AI service URL is correct in web app env vars
2. Check CORS settings in AI service
3. Ensure both services are in same region
4. Verify `allow-unauthenticated` is set for public access

## Monitoring & Logs

```bash
# View AI service logs
gcloud run services logs read markettrader-ai --region=us-central1 --project=microsaas-projects-2024

# View web app logs
gcloud run services logs read markettrader-web --region=us-central1 --project=microsaas-projects-2024

# Get service details
gcloud run services describe markettrader-ai --region=us-central1 --project=microsaas-projects-2024
gcloud run services describe markettrader-web --region=us-central1 --project=microsaas-projects-2024
```

## Updating Services

```bash
# Update AI service (after code changes)
cd services/ai-service
gcloud run deploy markettrader-ai --source . --region us-central1

# Update web app
cd apps/web
pnpm build
gcloud run deploy markettrader-web --source . --region us-central1
```

## Cost Optimization

- Cloud Run charges per request and CPU/memory usage
- Free tier: 2 million requests/month, 360,000 GB-seconds/month
- Set min instances to 0 for cost savings (cold starts will occur)
- Set max instances based on expected traffic

```bash
# Configure scaling (optional)
gcloud run services update markettrader-ai \
  --min-instances=0 \
  --max-instances=10 \
  --region=us-central1
```

## Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create --service markettrader-web --domain your-domain.com --region us-central1

# Follow DNS configuration instructions from output
```

## Security Best Practices

1. **Never commit API keys** - Use Secret Manager for production
2. **Enable authentication** if not public-facing
3. **Set up VPC** for service-to-service communication
4. **Enable Cloud Armor** for DDoS protection
5. **Regular security audits** of dependencies

## Next Steps

1. Set up CI/CD with GitHub Actions
2. Configure monitoring and alerting
3. Set up custom domain
4. Enable Cloud CDN for static assets
5. Implement authentication/authorization
6. Set up database (Cloud SQL or Supabase)

---

**Deployed Services (when complete):**
- AI Service: `https://markettrader-ai-[hash]-uc.a.run.app`
- Web App: `https://markettrader-web-[hash]-uc.a.run.app`

**Repository:** https://github.com/akaash-nigam/msSaaS_marketTrader
