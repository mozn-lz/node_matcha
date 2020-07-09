-- phpMyAdmin SQL Dump
-- version 4.4.15.9
-- https://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2020 at 11:19 AM
-- Server version: 5.6.37
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `matcha`
--
CREATE DATABASE IF NOT EXISTS `matcha` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `matcha`;

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
CREATE TABLE IF NOT EXISTS `chats` (
  `id` int(100) NOT NULL,
  `user_id` int(6) NOT NULL,
  `partner` int(6) NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `_id` int(6) NOT NULL,
  `usr_user` varchar(30) NOT NULL,
  `usr_email` varchar(50) NOT NULL,
  `usr_name` varchar(30) NOT NULL,
  `usr_surname` varchar(30) NOT NULL,
  `usr_psswd` varchar(255) NOT NULL,
  `login_time` varchar(50) NOT NULL,
  `profile_pic` varchar(255) NOT NULL DEFAULT '/images/ionicons.designerpack/md-person.svg',
  `age` int(3) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `oriantation` varchar(20) NOT NULL,
  `rating` int(1) NOT NULL,
  `bio` varchar(255) NOT NULL,
  `gps_switch` varchar(4) NOT NULL,
  `gps` varchar(255) NOT NULL,
  `verified` int(1) NOT NULL,
  `confirm_code` varchar(255) NOT NULL,
  `intrests` varchar(255) DEFAULT NULL,
  `blocked` varchar(255) DEFAULT NULL,
  `friends` text,
  `notifications` text,
  `picture` text,
  `history` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `_id` int(6) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
