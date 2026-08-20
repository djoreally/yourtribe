-- Content Pyramid: Better Auth + multi-tenant UGC distribution foundation
CREATE TYPE "TenantRole" AS ENUM ('OWNER', 'MANAGER', 'REVIEWER');
CREATE TYPE "Platform" AS ENUM ('INSTAGRAM', 'TIKTOK', 'FACEBOOK', 'GMB', 'YOUTUBE');
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');
CREATE TYPE "AssetStatus" AS ENUM ('PENDING', 'APPROVED', 'SCHEDULED', 'REJECTED');
CREATE TYPE "BroadcastStatus" AS ENUM ('PROCESSING', 'SUCCESS', 'FAILED');

CREATE TABLE "user" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

CREATE TABLE "session" (
  "id" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "token" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL,
  "activeOrganizationId" TEXT,
  CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

CREATE TABLE "account" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP(3),
  "refreshTokenExpiresAt" TIMESTAMP(3),
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

CREATE TABLE "verification" (
  "id" TEXT NOT NULL,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "verification_identifier_value_key" ON "verification"("identifier", "value");

CREATE TABLE "organization" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "logo" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

CREATE TABLE "member" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "member_organizationId_userId_key" ON "member"("organizationId", "userId");

CREATE TABLE "invitation" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "inviterId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cp_tenants" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "customDomain" TEXT,
  "logoUrl" TEXT,
  "primaryColor" TEXT NOT NULL DEFAULT '#111827',
  "secondaryColor" TEXT NOT NULL DEFAULT '#C8FF47',
  "welcomeMessage" TEXT NOT NULL DEFAULT 'Upload your moment. Get featured on our official feeds.',
  "uploadLimitMb" INTEGER NOT NULL DEFAULT 100,
  "uploadLimitSeconds" INTEGER NOT NULL DEFAULT 60,
  "ayrshareProfileKey" TEXT,
  "collectiveEnabled" BOOLEAN NOT NULL DEFAULT false,
  "collectiveName" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cp_tenants_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "cp_tenants_organizationId_key" ON "cp_tenants"("organizationId");
CREATE UNIQUE INDEX "cp_tenants_slug_key" ON "cp_tenants"("slug");
CREATE UNIQUE INDEX "cp_tenants_customDomain_key" ON "cp_tenants"("customDomain");
CREATE INDEX "cp_tenants_slug_idx" ON "cp_tenants"("slug");

CREATE TABLE "cp_tenant_members" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "TenantRole" NOT NULL DEFAULT 'MANAGER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "cp_tenant_members_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "cp_tenant_members_tenantId_userId_key" ON "cp_tenant_members"("tenantId", "userId");
CREATE INDEX "cp_tenant_members_userId_idx" ON "cp_tenant_members"("userId");

CREATE TABLE "cp_social_accounts" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "platform" "Platform" NOT NULL,
  "accountName" TEXT,
  "accountHandle" TEXT,
  "isConnected" BOOLEAN NOT NULL DEFAULT false,
  "lastSyncedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cp_social_accounts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "cp_social_accounts_tenantId_platform_key" ON "cp_social_accounts"("tenantId", "platform");

CREATE TABLE "cp_media_assets" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "rawMediaUrl" TEXT NOT NULL,
  "processedMediaUrl" TEXT,
  "thumbnailUrl" TEXT,
  "mediaType" "MediaType" NOT NULL,
  "patronHandle" TEXT,
  "patronCaption" TEXT,
  "rightsAgreed" BOOLEAN NOT NULL DEFAULT false,
  "rightsAgreedAt" TIMESTAMP(3),
  "status" "AssetStatus" NOT NULL DEFAULT 'PENDING',
  "scheduledFor" TIMESTAMP(3),
  "rejectionReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cp_media_assets_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "cp_media_assets_tenantId_status_createdAt_idx" ON "cp_media_assets"("tenantId", "status", "createdAt");

CREATE TABLE "cp_broadcast_logs" (
  "id" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "platformsTargeted" "Platform"[] NOT NULL,
  "ayrsharePostId" TEXT,
  "status" "BroadcastStatus" NOT NULL DEFAULT 'PROCESSING',
  "errorLog" TEXT,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "cp_broadcast_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "cp_broadcast_logs_tenantId_status_createdAt_idx" ON "cp_broadcast_logs"("tenantId", "status", "createdAt");

ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "member" ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cp_tenants" ADD CONSTRAINT "cp_tenants_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cp_tenant_members" ADD CONSTRAINT "cp_tenant_members_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "cp_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cp_tenant_members" ADD CONSTRAINT "cp_tenant_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cp_social_accounts" ADD CONSTRAINT "cp_social_accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "cp_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cp_media_assets" ADD CONSTRAINT "cp_media_assets_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "cp_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cp_broadcast_logs" ADD CONSTRAINT "cp_broadcast_logs_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "cp_media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cp_broadcast_logs" ADD CONSTRAINT "cp_broadcast_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "cp_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Compatibility intake table used by pre-existing repository routes.
CREATE TABLE "form_submissions" (
  "id" SERIAL NOT NULL,
  "formType" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);
