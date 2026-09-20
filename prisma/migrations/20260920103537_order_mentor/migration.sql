-- AlterTable
ALTER TABLE `order` ADD COLUMN `mentorId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
