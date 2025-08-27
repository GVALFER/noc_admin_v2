/*
  Warnings:

  - You are about to drop the column `accessToken` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `accessTokenExpiresAt` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `idToken` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenExpiresAt` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `activeOrganizationId` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `user_invitations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_organizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_verifications` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `user_accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `user_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `user_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `user_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `user_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `user_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_accounts` DROP FOREIGN KEY `user_accounts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user_invitations` DROP FOREIGN KEY `user_invitations_inviterId_fkey`;

-- DropForeignKey
ALTER TABLE `user_invitations` DROP FOREIGN KEY `user_invitations_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `user_members` DROP FOREIGN KEY `user_members_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `user_members` DROP FOREIGN KEY `user_members_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user_sessions` DROP FOREIGN KEY `user_sessions_activeOrganizationId_fkey`;

-- DropForeignKey
ALTER TABLE `user_sessions` DROP FOREIGN KEY `user_sessions_userId_fkey`;

-- DropIndex
DROP INDEX `user_accounts_providerId_accountId_key` ON `user_accounts`;

-- DropIndex
DROP INDEX `user_accounts_userId_idx` ON `user_accounts`;

-- DropIndex
DROP INDEX `user_sessions_activeOrganizationId_idx` ON `user_sessions`;

-- DropIndex
DROP INDEX `user_sessions_createdAt_idx` ON `user_sessions`;

-- DropIndex
DROP INDEX `user_sessions_expiresAt_idx` ON `user_sessions`;

-- DropIndex
DROP INDEX `user_sessions_userId_idx` ON `user_sessions`;

-- DropIndex
DROP INDEX `users_createdAt_idx` ON `users`;

-- DropIndex
DROP INDEX `users_emailVerified_idx` ON `users`;

-- DropIndex
DROP INDEX `users_email_key` ON `users`;

-- DropIndex
DROP INDEX `users_updatedAt_idx` ON `users`;

-- AlterTable
ALTER TABLE `user_accounts` DROP COLUMN `accessToken`,
    DROP COLUMN `accessTokenExpiresAt`,
    DROP COLUMN `accountId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `idToken`,
    DROP COLUMN `password`,
    DROP COLUMN `providerId`,
    DROP COLUMN `refreshToken`,
    DROP COLUMN `refreshTokenExpiresAt`,
    DROP COLUMN `scope`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `email` VARCHAR(255) NOT NULL,
    ADD COLUMN `hash` VARCHAR(255) NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    ADD COLUMN `notifications` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `phone` VARCHAR(255) NULL,
    ADD COLUMN `role` ENUM('OWNER', 'ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    ADD COLUMN `updated_at` TIMESTAMP(0) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user_sessions` DROP COLUMN `activeOrganizationId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `expiresAt`,
    DROP COLUMN `ipAddress`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userAgent`,
    DROP COLUMN `userId`,
    ADD COLUMN `account_id` VARCHAR(255) NOT NULL,
    ADD COLUMN `agent` VARCHAR(255) NULL,
    ADD COLUMN `country` VARCHAR(255) NULL,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `expires_at` TIMESTAMP(0) NOT NULL,
    ADD COLUMN `ip` VARCHAR(255) NULL,
    ADD COLUMN `org` VARCHAR(255) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `createdAt`,
    DROP COLUMN `email`,
    DROP COLUMN `emailVerified`,
    DROP COLUMN `image`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    ADD COLUMN `type` ENUM('COMPANY', 'INDIVIDUAL') NOT NULL DEFAULT 'INDIVIDUAL',
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL;

-- DropTable
DROP TABLE `user_invitations`;

-- DropTable
DROP TABLE `user_members`;

-- DropTable
DROP TABLE `user_organizations`;

-- DropTable
DROP TABLE `user_verifications`;

-- CreateIndex
CREATE UNIQUE INDEX `user_accounts_email_key` ON `user_accounts`(`email`);

-- CreateIndex
CREATE INDEX `user_accounts_user_id_idx` ON `user_accounts`(`user_id`);

-- CreateIndex
CREATE INDEX `user_accounts_created_at_idx` ON `user_accounts`(`created_at`);

-- CreateIndex
CREATE INDEX `user_accounts_updated_at_idx` ON `user_accounts`(`updated_at`);

-- CreateIndex
CREATE INDEX `user_accounts_role_idx` ON `user_accounts`(`role`);

-- CreateIndex
CREATE INDEX `user_accounts_email_idx` ON `user_accounts`(`email`);

-- CreateIndex
CREATE INDEX `user_sessions_account_id_idx` ON `user_sessions`(`account_id`);

-- CreateIndex
CREATE INDEX `user_sessions_expires_at_idx` ON `user_sessions`(`expires_at`);

-- CreateIndex
CREATE INDEX `user_sessions_created_at_idx` ON `user_sessions`(`created_at`);

-- CreateIndex
CREATE INDEX `user_sessions_updated_at_idx` ON `user_sessions`(`updated_at`);

-- CreateIndex
CREATE INDEX `users_created_at_idx` ON `users`(`created_at`);

-- CreateIndex
CREATE INDEX `users_updated_at_idx` ON `users`(`updated_at`);

-- CreateIndex
CREATE INDEX `users_role_idx` ON `users`(`role`);

-- CreateIndex
CREATE INDEX `users_type_idx` ON `users`(`type`);

-- AddForeignKey
ALTER TABLE `user_accounts` ADD CONSTRAINT `user_accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `user_accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
