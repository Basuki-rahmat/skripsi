-- CreateTable
CREATE TABLE `ThesisStage` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `status` ENUM('BELUM_DIMULAI', 'DIKERJAKAN', 'REVISI', 'SELESAI') NOT NULL DEFAULT 'BELUM_DIMULAI',
    `note` TEXT NULL,
    `updatedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ThesisStage_orderId_idx`(`orderId`),
    UNIQUE INDEX `ThesisStage_orderId_key_key`(`orderId`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ThesisStage` ADD CONSTRAINT `ThesisStage_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThesisStage` ADD CONSTRAINT `ThesisStage_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
