-- AlterTable
ALTER TABLE `order` MODIFY `note` TEXT NULL;

-- AlterTable
ALTER TABLE `package` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `post` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `progress` MODIFY `note` TEXT NULL;

-- AlterTable
ALTER TABLE `testimonial` MODIFY `content` TEXT NOT NULL;
