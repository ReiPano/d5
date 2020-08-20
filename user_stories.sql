/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80020
 Source Host           : localhost:3306
 Source Schema         : user_stories

 Target Server Type    : MySQL
 Target Server Version : 80020
 File Encoding         : 65001

 Date: 20/08/2020 09:00:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for attachment
-- ----------------------------
DROP TABLE IF EXISTS `attachment`;
CREATE TABLE `attachment`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `story_id` int(0) NULL DEFAULT NULL,
  `date_created` datetime(0) NOT NULL,
  `date_updated` datetime(0) NULL DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `IDX_795FD9BBAA5D4036`(`story_id`) USING BTREE,
  CONSTRAINT `FK_795FD9BBAA5D4036` FOREIGN KEY (`story_id`) REFERENCES `story` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for doctrine_migration_versions
-- ----------------------------
DROP TABLE IF EXISTS `doctrine_migration_versions`;
CREATE TABLE `doctrine_migration_versions`  (
  `version` varchar(191) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `executed_at` datetime(0) NULL DEFAULT NULL,
  `execution_time` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`version`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for story
-- ----------------------------
DROP TABLE IF EXISTS `story`;
CREATE TABLE `story`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NOT NULL,
  `date_created` datetime(0) NOT NULL,
  `date_updated` datetime(0) NULL DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `IDX_EB560438A76ED395`(`user_id`) USING BTREE,
  CONSTRAINT `FK_EB560438A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `date_created` datetime(0) NOT NULL,
  `date_updated` datetime(0) NULL DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `profile_picture` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `background_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
