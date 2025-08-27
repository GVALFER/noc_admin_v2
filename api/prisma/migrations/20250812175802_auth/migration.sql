/*
  Warnings:

  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    ADD COLUMN `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    ADD COLUMN `updatedAt` TIMESTAMP(0) NULL,
    MODIFY `email` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `user_sessions` (
    `id` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,
    `ipAddress` VARCHAR(255) NULL,
    `userAgent` VARCHAR(255) NULL,
    `userId` VARCHAR(255) NOT NULL,
    `activeOrganizationId` VARCHAR(255) NULL,

    UNIQUE INDEX `user_sessions_token_key`(`token`),
    INDEX `user_sessions_expiresAt_idx`(`expiresAt`),
    INDEX `user_sessions_userId_idx`(`userId`),
    INDEX `user_sessions_createdAt_idx`(`createdAt`),
    INDEX `user_sessions_activeOrganizationId_idx`(`activeOrganizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_accounts` (
    `id` VARCHAR(255) NOT NULL,
    `accountId` VARCHAR(255) NOT NULL,
    `providerId` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `idToken` TEXT NULL,
    `accessTokenExpiresAt` DATETIME(3) NULL,
    `refreshTokenExpiresAt` DATETIME(3) NULL,
    `scope` TEXT NULL,
    `password` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `user_accounts_userId_idx`(`userId`),
    UNIQUE INDEX `user_accounts_providerId_accountId_key`(`providerId`, `accountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_verifications` (
    `id` VARCHAR(255) NOT NULL,
    `identifier` VARCHAR(255) NOT NULL,
    `value` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,

    INDEX `user_verifications_identifier_idx`(`identifier`),
    INDEX `user_verifications_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_organizations` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `metadata` JSON NULL,

    INDEX `user_organizations_createdAt_idx`(`createdAt`),
    UNIQUE INDEX `user_organizations_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_members` (
    `id` VARCHAR(255) NOT NULL,
    `organizationId` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_members_organizationId_idx`(`organizationId`),
    INDEX `user_members_userId_idx`(`userId`),
    INDEX `user_members_createdAt_idx`(`createdAt`),
    UNIQUE INDEX `user_members_organizationId_userId_key`(`organizationId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_invitations` (
    `id` VARCHAR(255) NOT NULL,
    `organizationId` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NULL,
    `status` VARCHAR(255) NOT NULL,
    `inviterId` VARCHAR(255) NOT NULL,
    `expiresAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_invitations_organizationId_idx`(`organizationId`),
    INDEX `user_invitations_expiresAt_idx`(`expiresAt`),
    INDEX `user_invitations_inviterId_idx`(`inviterId`),
    INDEX `user_invitations_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `users_createdAt_idx` ON `users`(`createdAt`);

-- CreateIndex
CREATE INDEX `users_updatedAt_idx` ON `users`(`updatedAt`);

-- CreateIndex
CREATE INDEX `users_emailVerified_idx` ON `users`(`emailVerified`);

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_activeOrganizationId_fkey` FOREIGN KEY (`activeOrganizationId`) REFERENCES `user_organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_accounts` ADD CONSTRAINT `user_accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_members` ADD CONSTRAINT `user_members_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `user_organizations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_members` ADD CONSTRAINT `user_members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_invitations` ADD CONSTRAINT `user_invitations_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `user_organizations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_invitations` ADD CONSTRAINT `user_invitations_inviterId_fkey` FOREIGN KEY (`inviterId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
