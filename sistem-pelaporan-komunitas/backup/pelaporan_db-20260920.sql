-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: pelaporan_db
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('dc509b94-5160-48af-9a73-9d38357d701d','1ab7efd08f2989a4c782e69e6744443af008d694e4ddaba97f881059f97ab71a','2026-09-20 11:23:17.470','20260920112316_init',NULL,NULL,'2026-09-20 11:23:16.525',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('cmu9qajqu0003nstp2r3e3acc','Infrastruktur Jalan','Kerusakan jalan, trotoar, jembatan, hingga marka dan rambu lalu lintas.','road',1,'2026-09-20 11:23:57.942'),('cmu9qajr10004nstp8pkvgfrl','Penerangan dan Listrik','Penerangan jalan umum (PJU) mati, tiang miring, hingga kabel listrik putus.','zap',1,'2026-09-20 11:23:57.949'),('cmu9qajr70005nstpoewtcfn3','Kebersihan dan Sampah','Tumpukan sampah, drainase tersumbat, hingga saluran air mampet.','trash',1,'2026-09-20 11:23:57.955'),('cmu9qajrd0006nstp513fim2z','Bencana Alam','Banjir, tanah longsor, pohon tumbang, dan dampak bencana lainnya.','cloud-rain',1,'2026-09-20 11:23:57.961'),('cmu9qajrj0007nstpi9symtvl','Fasilitas Umum','Kerusakan fasilitas publik seperti taman, halte, taman bermain, dan MCK umum.','bus',1,'2026-09-20 11:23:57.967'),('cmu9qajrp0008nstpppp83tjk','Keamanan dan Ketertiban','Kerawanan keamanan, tiang/papan liar, hingga gangguan ketertiban lainnya.','shield',1,'2026-09-20 11:23:57.973'),('cmu9qajrz0009nstpqn80jiwc','Lainnya','Kategori pelaporan yang belum tercakup kategori lainnya.','more',1,'2026-09-20 11:23:57.983');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `counter`
--

DROP TABLE IF EXISTS `counter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `counter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seq` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Counter_date_key` (`date`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `counter`
--

LOCK TABLES `counter` WRITE;
/*!40000 ALTER TABLE `counter` DISABLE KEYS */;
INSERT INTO `counter` VALUES (1,'20260920',1);
/*!40000 ALTER TABLE `counter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `followup`
--

DROP TABLE IF EXISTS `followup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `followup` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reportId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `officerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `photoUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusAfter` enum('MENUNGGU_VERIFIKASI','VERIFIKASI_DITOLAK','DIPROSES','DITINDAKLANJUTI','SELESAI') COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `FollowUp_reportId_fkey` (`reportId`),
  KEY `FollowUp_officerId_fkey` (`officerId`),
  CONSTRAINT `FollowUp_officerId_fkey` FOREIGN KEY (`officerId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FollowUp_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followup`
--

LOCK TABLES `followup` WRITE;
/*!40000 ALTER TABLE `followup` DISABLE KEYS */;
INSERT INTO `followup` VALUES ('cmu9r763h0003k4tpvnnpiegg','cmu9r5gpw0000k4tpnepwisnf','cmu9qajq50001nstpyz6r04pz','Sudah berkoordinasi dengan UPT jalan; penambalan dijadwalkan pekan ini.',NULL,'DITINDAKLANJUTI','2026-09-20 11:49:19.901'),('cmu9r76840005k4tp8ur5jcx2','cmu9r5gpw0000k4tpnepwisnf','cmu9qajq50001nstpyz6r04pz','Lubang jalan telah ditambal dan lokasi diamankan.',NULL,'SELESAI','2026-09-20 11:49:20.068'),('cmu9ri4zz000fe8tp4zhqu83b','cmu9ri4zn000de8tp1xta7s7f','cmu9qajq50001nstpyz6r04pz','Petugas telah turun ke lokasi dan melakukan koordinasi awal dengan perangkat wilayah sekitar.',NULL,'DITINDAKLANJUTI','2026-09-03 10:44:00.000'),('cmu9ri50i000ie8tpqu825o19','cmu9ri507000ge8tp7whtew6t','cmu9qajq50001nstpyz6r04pz','Petugas telah turun ke lokasi dan melakukan koordinasi awal dengan perangkat wilayah sekitar.',NULL,'DITINDAKLANJUTI','2026-09-06 11:57:00.000'),('cmu9ri50x000le8tpl40pdf05','cmu9ri50o000je8tp7mu2puv9','cmu9qajq50001nstpyz6r04pz','Petugas telah turun ke lokasi dan melakukan koordinasi awal dengan perangkat wilayah sekitar.',NULL,'DITINDAKLANJUTI','2026-09-09 02:10:00.000'),('cmu9ri51d000oe8tp7mviov25','cmu9ri512000me8tpdhzqitcq','cmu9qajq50001nstpyz6r04pz','Petugas telah turun ke lokasi dan melakukan koordinasi awal dengan perangkat wilayah sekitar.',NULL,'DITINDAKLANJUTI','2026-09-12 03:23:00.000'),('cmu9ri51j000pe8tpso4s3xjv','cmu9ri512000me8tpdhzqitcq','cmu9qajq50001nstpyz6r04pz','Penanganan telah selesai dilakukan di lokasi dan area dipastikan aman untuk digunakan.',NULL,'SELESAI','2026-09-18 09:23:00.000'),('cmu9ri525000te8tpirg8h6wt','cmu9ri51u000re8tpexaenoln','cmu9qajq50001nstpyz6r04pz','Petugas telah turun ke lokasi dan melakukan koordinasi awal dengan perangkat wilayah sekitar.',NULL,'DITINDAKLANJUTI','2026-09-15 04:36:00.000'),('cmu9ri52c000ue8tp4hnoxchk','cmu9ri51u000re8tpexaenoln','cmu9qajq50001nstpyz6r04pz','Penanganan telah selesai dilakukan di lokasi dan area dipastikan aman untuk digunakan.',NULL,'SELESAI','2026-09-18 10:36:00.000'),('cmu9ri52y000ye8tp76sa2ate','cmu9ri52o000we8tpg3p7386q','cmu9qajq50001nstpyz6r04pz','Petugas telah turun ke lokasi dan melakukan koordinasi awal dengan perangkat wilayah sekitar.',NULL,'DITINDAKLANJUTI','2026-09-18 05:49:00.000'),('cmu9ri532000ze8tpkzkxoaaa','cmu9ri52o000we8tpg3p7386q','cmu9qajq50001nstpyz6r04pz','Penanganan telah selesai dilakukan di lokasi dan area dipastikan aman untuk digunakan.',NULL,'SELESAI','2026-09-22 11:49:00.000');
/*!40000 ALTER TABLE `followup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reportId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Notification_userId_fkey` (`userId`),
  KEY `Notification_reportId_fkey` (`reportId`),
  CONSTRAINT `Notification_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES ('cmu9r5gq30001k4tpuw6l6w2f','cmu9qajqj0002nstpi1d5lyqm','cmu9r5gpw0000k4tpnepwisnf','Laporan LAP-20260920-0001 diterima dan menunggu verifikasi.',0,'2026-09-20 11:48:00.363'),('cmu9r75hz0002k4tpc27xefxw','cmu9qajqj0002nstpi1d5lyqm','cmu9r5gpw0000k4tpnepwisnf','Laporan LAP-20260920-0001 telah diverifikasi dan sedang diproses petugas.',0,'2026-09-20 11:49:19.127'),('cmu9r76410004k4tpvlj19byv','cmu9qajqj0002nstpi1d5lyqm','cmu9r5gpw0000k4tpnepwisnf','Laporan LAP-20260920-0001 sedang ditindaklanjuti.',0,'2026-09-20 11:49:19.921'),('cmu9r768m0006k4tp2cs0egct','cmu9qajqj0002nstpi1d5lyqm','cmu9r5gpw0000k4tpnepwisnf','Laporan LAP-20260920-0001 telah selesai ditindaklanjuti. Terima kasih atas laporannya.',0,'2026-09-20 11:49:20.086'),('cmu9ri4xv0004e8tp9wnmk2w9','cmu9qajqj0002nstpi1d5lyqm','cmu9ri4xm0003e8tpakrtiw6z','Laporan DEMO-1004 telah diverifikasi dan sedang diproses petugas.',0,'2026-08-18 11:39:00.000'),('cmu9ri4yb0006e8tp9yodccmf','cmu9qajqj0002nstpi1d5lyqm','cmu9ri4y20005e8tpaokffj9w','Laporan DEMO-1005 telah diverifikasi dan sedang diproses petugas.',0,'2026-08-21 12:52:00.000'),('cmu9ri4yq0008e8tp0ib25ls3','cmu9qajqj0002nstpi1d5lyqm','cmu9ri4yj0007e8tpjxqzju3f','Laporan DEMO-1006 telah diverifikasi dan sedang diproses petugas.',0,'2026-08-24 13:05:00.000'),('cmu9ri4z3000ae8tp4dynb59y','cmu9qajqj0002nstpi1d5lyqm','cmu9ri4yx0009e8tp4onhsuzu','Laporan DEMO-1007 telah diverifikasi dan sedang diproses petugas.',0,'2026-08-27 14:18:00.000'),('cmu9ri4zh000ce8tp47fqd9da','cmu9qajqj0002nstpi1d5lyqm','cmu9ri4za000be8tplfj0uc9r','Laporan DEMO-1008 telah diverifikasi dan sedang diproses petugas.',0,'2026-08-30 15:31:00.000'),('cmu9ri4zu000ee8tpomqj0qou','cmu9qajqj0002nstpi1d5lyqm','cmu9ri4zn000de8tp1xta7s7f','Laporan DEMO-1009 telah diverifikasi dan sedang diproses petugas.',0,'2026-09-02 16:44:00.000'),('cmu9ri50d000he8tpig00awda','cmu9qajqj0002nstpi1d5lyqm','cmu9ri507000ge8tp7whtew6t','Laporan DEMO-1010 telah diverifikasi dan sedang diproses petugas.',0,'2026-09-05 17:57:00.000'),('cmu9ri50s000ke8tpc3x3v662','cmu9qajqj0002nstpi1d5lyqm','cmu9ri50o000je8tp7mu2puv9','Laporan DEMO-1011 telah diverifikasi dan sedang diproses petugas.',0,'2026-09-08 08:10:00.000'),('cmu9ri519000ne8tpwdmc60wy','cmu9qajqj0002nstpi1d5lyqm','cmu9ri512000me8tpdhzqitcq','Laporan DEMO-1012 telah diverifikasi dan sedang diproses petugas.',0,'2026-09-11 09:23:00.000'),('cmu9ri51o000qe8tpyacg8368','cmu9qajqj0002nstpi1d5lyqm','cmu9ri512000me8tpdhzqitcq','Laporan DEMO-1012 telah selesai ditindaklanjuti. Terima kasih atas laporannya!',0,'2026-09-18 09:23:00.000'),('cmu9ri520000se8tpz3wmmnm2','cmu9qajqj0002nstpi1d5lyqm','cmu9ri51u000re8tpexaenoln','Laporan DEMO-1013 telah diverifikasi dan sedang diproses petugas.',0,'2026-09-14 10:36:00.000'),('cmu9ri52i000ve8tp5n980k7k','cmu9qajqj0002nstpi1d5lyqm','cmu9ri51u000re8tpexaenoln','Laporan DEMO-1013 telah selesai ditindaklanjuti. Terima kasih atas laporannya!',0,'2026-09-18 10:36:00.000'),('cmu9ri52t000xe8tpk2do7yi7','cmu9qajqj0002nstpi1d5lyqm','cmu9ri52o000we8tpg3p7386q','Laporan DEMO-1014 telah diverifikasi dan sedang diproses petugas.',0,'2026-09-17 11:49:00.000'),('cmu9ri5370010e8tpmmqpjcq7','cmu9qajqj0002nstpi1d5lyqm','cmu9ri52o000we8tpg3p7386q','Laporan DEMO-1014 telah selesai ditindaklanjuti. Terima kasih atas laporannya!',0,'2026-09-22 11:49:00.000');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `region`
--

DROP TABLE IF EXISTS `region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `region` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` enum('KECAMATAN','KELURAHAN','DESA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'KELURAHAN',
  `province` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `region`
--

LOCK TABLES `region` WRITE;
/*!40000 ALTER TABLE `region` DISABLE KEYS */;
INSERT INTO `region` VALUES ('cmu9qajsd000anstpcrycfa0n','Palmerah','KECAMATAN','DKI Jakarta','Kota Administrasi Jakarta Barat','Palmerah',-6.2046,106.7947,'2026-09-20 11:23:57.997'),('cmu9qajsk000bnstpkz407hxe','Kebon Jeruk','KECAMATAN','DKI Jakarta','Kota Administrasi Jakarta Barat','Kebon Jeruk',-6.185,106.765,'2026-09-20 11:23:58.004'),('cmu9qajsr000cnstpzm4xmosp','Grogol Petamburan','KECAMATAN','DKI Jakarta','Kota Administrasi Jakarta Barat','Grogol Petamburan',-6.155,106.791,'2026-09-20 11:23:58.011'),('cmu9qajsx000dnstp8qq70xay','Tanah Abang','KECAMATAN','DKI Jakarta','Kota Administrasi Jakarta Pusat','Tanah Abang',-6.185,106.811,'2026-09-20 11:23:58.017'),('cmu9qajt3000enstp4nu7eyrx','Tambora','KECAMATAN','DKI Jakarta','Kota Administrasi Jakarta Barat','Tambora',-6.142,106.805,'2026-09-20 11:23:58.023'),('cmu9qajta000fnstp8tcuqlgj','Kemanggisan','KELURAHAN','DKI Jakarta','Kota Administrasi Jakarta Barat','Palmerah',-6.2085,106.798,'2026-09-20 11:23:58.030'),('cmu9qajtf000gnstpnnzj63n2','Kota Bambu','KELURAHAN','DKI Jakarta','Kota Administrasi Jakarta Barat','Palmerah',-6.202,106.779,'2026-09-20 11:23:58.035'),('cmu9qajtm000hnstpd3upoiwq','Jelambar','KELURAHAN','DKI Jakarta','Kota Administrasi Jakarta Barat','Grogol Petamburan',-6.159,106.779,'2026-09-20 11:23:58.042'),('cmu9qajtt000instpgiy5jpzt','Tomang','KELURAHAN','DKI Jakarta','Kota Administrasi Jakarta Barat','Grogol Petamburan',-6.173,106.79,'2026-09-20 11:23:58.049');
/*!40000 ALTER TABLE `region` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `regionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `status` enum('MENUNGGU_VERIFIKASI','VERIFIKASI_DITOLAK','DIPROSES','DITINDAKLANJUTI','SELESAI') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI',
  `priority` enum('RENDAH','SEDANG','TINGGI','URGENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SEDANG',
  `verificationNote` text COLLATE utf8mb4_unicode_ci,
  `verifiedAt` datetime(3) DEFAULT NULL,
  `verifiedById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assignedToId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assignedAt` datetime(3) DEFAULT NULL,
  `closedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Report_code_key` (`code`),
  KEY `Report_userId_fkey` (`userId`),
  KEY `Report_categoryId_fkey` (`categoryId`),
  KEY `Report_regionId_fkey` (`regionId`),
  KEY `Report_verifiedById_fkey` (`verifiedById`),
  KEY `Report_assignedToId_fkey` (`assignedToId`),
  CONSTRAINT `Report_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Report_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Report_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `region` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Report_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Report_verifiedById_fkey` FOREIGN KEY (`verifiedById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
INSERT INTO `report` VALUES ('cmu9r5gpw0000k4tpnepwisnf','LAP-20260920-0001','cmu9qajqj0002nstpi1d5lyqm','cmu9qajrj0007nstpi9symtvl','cmu9qajsd000anstpcrycfa0n','Uji coba laporan lubang jalan','Lubang jalan cukup dalam di depan gang menimbulkan bahaya bagi pengendara.','',-6.20112,106.7923,'SELESAI','TINGGI',NULL,'2026-09-20 11:49:19.114','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-09-20 11:49:19.906','2026-09-20 11:49:20.071','2026-09-20 11:48:00.356','2026-09-20 11:49:20.079'),('cmu9ri4wm0000e8tpq1a2ktfv','DEMO-1001','cmu9qajqj0002nstpi1d5lyqm','cmu9qajqu0003nstp2r3e3acc','cmu9qajsd000anstpcrycfa0n','Pohon tumbang menutup akses jalan','Pohon besar tumbang di tengah jalan setelah hujan deras, menghalangi akses kendaraan dan pejalan kaki.','Jl. Kemanggisan Utama Raya, Palmerah',-6.2046,106.7947,'MENUNGGU_VERIFIKASI','TINGGI',NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-09 02:00:00.000','2026-09-20 11:57:51.574'),('cmu9ri4wy0001e8tpjg6xs4gz','DEMO-1002','cmu9qajqj0002nstpi1d5lyqm','cmu9qajrd0006nstp513fim2z','cmu9qajsk000bnstpkz407hxe','Penumpukan sampah di TPS liar','Sampah rumah tangga menumpuk dan tidak diangkut selama hampir seminggu, menimbulkan bau tidak sedap.','RT 05 RW 02, Kemanggisan',-6.1838999999999995,106.7676,'MENUNGGU_VERIFIKASI','SEDANG',NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-12 03:13:00.000','2026-09-20 11:57:51.586'),('cmu9ri4xd0002e8tplu9anqq1','DEMO-1003','cmu9qajqj0002nstpi1d5lyqm','cmu9qajr70005nstpoewtcfn3','cmu9qajsr000cnstpzm4xmosp','Trotoar rusak di depan sekolah','Keramik trotoar pecah dan berlubang cukup besar, berbahaya bagi anak sekolah yang lalu lalang.','Jl. Tanjung Duren Raya, Grogol Petamburan',-6.1528,106.7962,'MENUNGGU_VERIFIKASI','RENDAH',NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-15 04:26:00.000','2026-09-20 11:57:51.601'),('cmu9ri4xm0003e8tpakrtiw6z','DEMO-1004','cmu9qajqj0002nstpi1d5lyqm','cmu9qajr10004nstp8pkvgfrl','cmu9qajsx000dnstp8qq70xay','Parkir liar di pinggir jalan','Terdapat kendaraan parkir sembarangan menghalangi jalan masuk kompleks setiap sore hari.','Jelambar Baru, Grogol Petamburan',-6.185,106.81230000000001,'VERIFIKASI_DITOLAK','RENDAH','Laporan terverifikasi sesuai lokasi yang dilaporkan.','2026-08-18 11:39:00.000','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-08-18 11:39:00.000',NULL,'2026-08-18 05:39:00.000','2026-09-20 11:57:51.610'),('cmu9ri4y20005e8tpaokffj9w','DEMO-1005','cmu9qajqj0002nstpi1d5lyqm','cmu9qajrp0008nstpppp83tjk','cmu9qajt3000enstp4nu7eyrx','Lubang jalan cukup dalam di Jl. Palmerah Barat','Lubang berdiameter sekitar 70 cm dengan kedalaman 30 cm di lajur kiri, sering menyebabkan ban kendaraan pecah.','Jl. Palmerah Barat, Palmerah',-6.1409,106.80890000000001,'DIPROSES','URGENT','Laporan terverifikasi sesuai lokasi yang dilaporkan.','2026-08-21 12:52:00.000','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-08-21 12:52:00.000',NULL,'2026-08-21 06:52:00.000','2026-09-20 11:57:51.627'),('cmu9ri4yj0007e8tpjxqzju3f','DEMO-1006','cmu9qajqj0002nstpi1d5lyqm','cmu9qajrj0007nstpi9symtvl','cmu9qajsd000anstpcrycfa0n','Tiang lampu jalan mati total','Lampu penerangan jalan sepanjang Jl. Kebon Jeruk Raya mati, jalan menjadi gelap dan rawan kecelakaan.','Jl. Kebon Jeruk Raya, Kebon Jeruk',-6.2024,106.7947,'DIPROSES','TINGGI','Laporan terverifikasi sesuai lokasi yang dilaporkan.','2026-08-24 13:05:00.000','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-08-24 13:05:00.000',NULL,'2026-08-24 07:05:00.000','2026-09-20 11:57:51.643'),('cmu9ri4yx0009e8tp4onhsuzu','DEMO-1007','cmu9qajqj0002nstpi1d5lyqm','cmu9qajqu0003nstp2r3e3acc','cmu9qajsk000bnstpkz407hxe','Genangan banjir setelah hujan','Genangan air setinggi 30-40 cm di pintu masuk kompleks, menyulitkan akses warga setiap kali hujan turun.','Kota Bambu Selatan, Palmerah',-6.185,106.7676,'DIPROSES','SEDANG','Laporan terverifikasi sesuai lokasi yang dilaporkan.','2026-08-27 14:18:00.000','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-08-27 14:18:00.000',NULL,'2026-08-27 08:18:00.000','2026-09-20 11:57:51.657'),('cmu9ri4za000be8tplfj0uc9r','DEMO-1008','cmu9qajqj0002nstpi1d5lyqm','cmu9qajrd0006nstp513fim2z','cmu9qajsr000cnstpzm4xmosp','Kamera CCTV lingkungan tidak berfungsi','Beberapa CCTV di pos kamling tidak menyala sejak bulan lalu sehingga pemantauan keamanan terhambat.','RW 03 Tomang, Grogol Petamburan',-6.1539,106.7962,'DIPROSES','SEDANG','Laporan terverifikasi sesuai lokasi yang dilaporkan.','2026-08-30 15:31:00.000','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-08-30 15:31:00.000',NULL,'2026-08-30 09:31:00.000','2026-09-20 11:57:51.670'),('cmu9ri4zn000de8tp1xta7s7f','DEMO-1009','cmu9qajqj0002nstpi1d5lyqm','cmu9qajr70005nstpoewtcfn3','cmu9qajsx000dnstp8qq70xay','Jalan berlubang di Jl. Tanah Abang II','Aspal di beberapa titik mulai mengelupas dan berlubang, berpotensi membahayakan pengendara roda dua.','Jl. Tanah Abang II, Tanah Abang',-6.182799999999999,106.81230000000001,'DITINDAKLANJUTI','TINGGI','Laporan terverifikasi sesuai lokasi yang dilaporkan.','2026-09-02 16:44:00.000','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-09-02 16:44:00.000',NULL,'2026-09-02 10:44:00.000','2026-09-20 11:57:51.683'),('cmu9ri507000ge8tp7whtew6t','DEMO-1010','cmu9qajqj0002nstpi1d5lyqm','cmu9qajr10004nstp8pkvgfrl','cmu9qajt3000enstp4nu7eyrx','Sumur resapan warga tersumbat','Sumur resapan di beberapa rumah warga tersumbat sampah sehingga air meluap ke jalan.','Kebon Jeruk, RT 07 RW 01',-6.142,106.80890000000001,'DITINDAKLANJUTI','SEDANG','Laporan terverifikasi sesuai lokasi yang dilaporkan.','2026-09-05 17:57:00.000','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-09-05 17:57:00.000',NULL,'2026-09-05 11:57:00.000','2026-09-20 11:57:51.703'),('cmu9ri50o000je8tp7mu2puv9','DEMO-1011','cmu9qajqj0002nstpi1d5lyqm','cmu9qajrp0008nstpppp83tjk','cmu9qajsd000anstpcrycfa0n','Kabel listrik menjuntai berbahaya','Kabel listrik terkelupas dan menjuntai rendah di area padat penduduk setelah tiang miring.','Tambora, dekat Jl. Keadilan',-6.2035,106.7947,'DITINDAKLANJUTI','URGENT','Laporan terverifikasi sesuai lokasi yang dilaporkan.','2026-09-08 08:10:00.000','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-09-08 08:10:00.000',NULL,'2026-09-08 02:10:00.000','2026-09-20 11:57:51.720'),('cmu9ri512000me8tpdhzqitcq','DEMO-1012','cmu9qajqj0002nstpi1d5lyqm','cmu9qajrj0007nstpi9symtvl','cmu9qajsk000bnstpkz407hxe','Sampah besar di kali meluap','Sampah menyumbat aliran kali kecil dan menyebabkan air meluap ke pemukiman saat hujan.','Palmerah, bantaran Kali Sekretaris',-6.182799999999999,106.7676,'SELESAI','TINGGI','Laporan terverifikasi sesuai lokasi yang dilaporkan.','2026-09-11 09:23:00.000','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-09-11 09:23:00.000','2026-09-18 09:23:00.000','2026-09-11 03:23:00.000','2026-09-20 11:57:51.734'),('cmu9ri51u000re8tpexaenoln','DEMO-1013','cmu9qajqj0002nstpi1d5lyqm','cmu9qajqu0003nstp2r3e3acc','cmu9qajsr000cnstpzm4xmosp','Penerangan gang mati','Lampu gang mati total selama lebih dari dua minggu, gang menjadi gelap dan tidak nyaman dilalui.','Jelambar, gang Melati',-6.155,106.7962,'SELESAI','SEDANG','Laporan terverifikasi sesuai lokasi yang dilaporkan.','2026-09-14 10:36:00.000','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-09-14 10:36:00.000','2026-09-18 10:36:00.000','2026-09-14 04:36:00.000','2026-09-20 11:57:51.762'),('cmu9ri52o000we8tpg3p7386q','DEMO-1014','cmu9qajqj0002nstpi1d5lyqm','cmu9qajrd0006nstp513fim2z','cmu9qajsx000dnstp8qq70xay','Fasilitas toilet umum kotor','Toilet umum di dekat taman tidak terawat dan tidak ada petugas kebersihan yang menjadwalkan pembersihan.','Taman Tomang, Tanah Abang',-6.1838999999999995,106.81230000000001,'SELESAI','RENDAH','Laporan terverifikasi sesuai lokasi yang dilaporkan.','2026-09-17 11:49:00.000','cmu9qajpm0000nstp600hycef','cmu9qajq50001nstpyz6r04pz','2026-09-17 11:49:00.000','2026-09-22 11:49:00.000','2026-09-17 05:49:00.000','2026-09-20 11:57:51.792');
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportmedia`
--

DROP TABLE IF EXISTS `reportmedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportmedia` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reportId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IMAGE',
  `caption` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ReportMedia_reportId_fkey` (`reportId`),
  CONSTRAINT `ReportMedia_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportmedia`
--

LOCK TABLES `reportmedia` WRITE;
/*!40000 ALTER TABLE `reportmedia` DISABLE KEYS */;
/*!40000 ALTER TABLE `reportmedia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('MASYARAKAT','PETUGAS','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MASYARAKAT',
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nik` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_nik_key` (`nik`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('cmu9qajpm0000nstp600hycef','Admin Sistem','admin@pelaporan.id','$2b$10$pZN0YV6uaIGB4k9qEx4VSOOjvrQMo8AugnVdkDo7nPnOKDuBnCTgm','ADMIN','081200000001',NULL,NULL,NULL,NULL,1,'2026-09-20 11:23:57.898','2026-09-20 11:23:57.898'),('cmu9qajq50001nstpyz6r04pz','Petugas Lapangan','petugas@pelaporan.id','$2b$10$TZK6QCTUsODZvSZyQRHs1.2H0xYbeWy2CZXlaQ0hf8P4FFglTtnnC','PETUGAS','081200000002',NULL,NULL,NULL,NULL,1,'2026-09-20 11:23:57.917','2026-09-20 11:23:57.917'),('cmu9qajqj0002nstpi1d5lyqm','Warga Komunitas','masyarakat@pelaporan.id','$2b$10$VktRHl7Z1k2E2878ReNhjOIe.d01V38b7bsnbNcMH003om5vQZHWW','MASYARAKAT','081200000003',NULL,NULL,NULL,NULL,1,'2026-09-20 11:23:57.931','2026-09-20 11:23:57.931');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-20 19:05:07
