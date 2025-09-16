#!/bin/bash
set -e

echo "🚀 Deploying Velocity Zones Dashboard to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Link project (if not already linked)
echo "🔗 Linking project to Vercel..."
vercel link --yes

# Build the project locally first
echo "🔨 Building project..."
pnpm build

# Deploy to production
echo "🚀 Deploying to production..."
DEPLOY_URL=$(vercel --prod --yes)

echo "✅ Deployment complete!"
echo ""
echo "🎉 Your app is now live!"
echo "🌐 Frontend: $DEPLOY_URL"
echo "📖 API docs: $DEPLOY_URL/api/docs"
echo "🔗 API endpoints: $DEPLOY_URL/api/v1"
echo ""
echo "📝 Note: Using in-memory storage - data resets on cold starts"