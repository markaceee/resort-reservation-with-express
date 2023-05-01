-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 01, 2023 at 12:56 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `palm_bliss`
--

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `paymentID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `reservationID` int(11) NOT NULL,
  `guestPaid` int(11) NOT NULL,
  `needToPay` int(11) NOT NULL,
  `paymentMethod` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pricelist`
--

CREATE TABLE `pricelist` (
  `priceListID` int(50) NOT NULL,
  `month` varchar(50) NOT NULL,
  `whatWeek` varchar(50) NOT NULL,
  `numOfHours` int(50) NOT NULL,
  `numOfPerson` int(50) NOT NULL,
  `price` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pricelist`
--

INSERT INTO `pricelist` (`priceListID`, `month`, `whatWeek`, `numOfHours`, `numOfPerson`, `price`) VALUES
(1, 'May', 'weekends', 22, 35, 30000),
(2, 'May', 'weekends', 22, 30, 28000),
(3, 'May', 'weekdays', 22, 35, 24000),
(4, 'May', 'weekdays', 22, 30, 22000),
(5, 'May', 'weekdays', 12, 35, 16000),
(6, 'May', 'weekdays', 12, 30, 14000),
(7, 'May', 'weekends', 22, 25, 26000),
(8, 'May', 'weekends', 22, 20, 24000),
(9, 'May', 'weekdays', 22, 25, 20000),
(10, 'May', 'weekdays', 22, 20, 18000),
(11, 'May', 'weekdays', 22, 15, 16000),
(12, 'May', 'weekdays', 12, 25, 13000),
(13, 'May', 'weekdays', 12, 20, 12000),
(14, 'May', 'weekdays', 12, 15, 11000);

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `reservationID` int(100) NOT NULL,
  `userID` int(100) NOT NULL,
  `checkIn` varchar(100) NOT NULL,
  `checkOut` varchar(100) NOT NULL,
  `timeIn` varchar(100) NOT NULL,
  `timeOut` varchar(100) NOT NULL,
  `numOfHours` int(100) NOT NULL,
  `numOfPerson` varchar(100) NOT NULL,
  `total` int(50) NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'pending',
  `reserveDateCreated` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reservation`
--

INSERT INTO `reservation` (`reservationID`, `userID`, `checkIn`, `checkOut`, `timeIn`, `timeOut`, `numOfHours`, `numOfPerson`, `total`, `status`, `reserveDateCreated`) VALUES
(2, 2, '2023-05-25', '2023-05-26', '12:00 PM', '12:00 AM', 22, '35', 24000, 'cancelled', '2023-04-18 16:18:11.441921'),
(3, 2, '2023-05-25', '2023-05-26', '12:00 PM', '12:00 PM', 12, '35', 16000, 'cancelled', '2023-04-20 15:23:30.373922'),
(4, 2, '2023-05-17', '2023-05-18', '12:00 PM', '12:00 PM', 22, '35', 24000, 'cancelled', '2023-04-22 17:18:56.806949'),
(5, 2, '2023-05-02', '2023-05-03', '12:00 PM', '12:00 PM', 22, '35', 24000, 'approved', '2023-04-22 17:54:26.033181'),
(6, 2, '2023-05-06', '2023-05-07', '12:00 PM', '12:00 PM', 22, '35', 30000, 'cancelled', '2023-04-22 17:54:41.944211'),
(7, 3, '2023-05-23', '2023-05-23', '12:00 PM', '12:00 PM', 12, '30', 14000, 'cancelled', '2023-04-23 01:27:46.346816'),
(8, 3, '2023-05-06', '2023-05-07', '12:00 PM', '12:00 PM', 22, '35', 30000, 'pending', '2023-04-23 01:28:38.193574'),
(9, 2, '2023-05-30', '2023-05-31', '6:00 PM', '4:00 PM', 12, '35', 16000, 'pending', '2023-04-23 10:26:46.781079'),
(10, 2, '2023-05-05', '2023-05-06', '12:00 PM', '12:00 PM', 22, '35', 30000, 'cancelled', '2023-04-23 12:57:02.021137'),
(11, 2, '2023-05-06', '2023-05-07', '10:00 PM', '12:00 PM', 22, '30', 28000, 'pending', '2023-04-23 12:57:27.369930'),
(12, 2, '2023-05-01', '2023-05-01', '12:00 PM', '12:00 PM', 12, '30', 14000, 'cancelled', '2023-04-23 13:00:08.826548'),
(13, 2, '2023-05-09', '2023-05-10', '12', '12:00 PM', 12, '15', 11000, 'pending', '2023-04-23 20:33:31.862660'),
(14, 2, '2023-05-03', '2023-05-04', '12', '12:00 PM', 12, '30', 14000, 'cancelled', '2023-04-30 15:50:13.261942'),
(15, 2, '2023-05-01', '2023-05-01', '22', '12:00 PM', 12, '30', 22000, 'cancelled', '2023-05-01 00:20:00.693778'),
(16, 2, '2023-05-31', '2023-06-01', '22', '12:00 PM', 12, '35', 24000, 'pending', '2023-05-01 00:21:35.400723'),
(17, 2, '2023-05-17', '2023-05-17', '22', '12:00 PM', 12, '35', 24000, 'pending', '2023-05-01 00:31:30.795165');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `contactNumber` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(254) NOT NULL,
  `dateRegistered` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `firstName`, `lastName`, `contactNumber`, `address`, `email`, `password`, `dateRegistered`) VALUES
(2, 'Mark ', 'boquiren', '09582323123', 'dyan lang', 'boqs12345678@gmail.com', '$2b$10$PiNCbeePIBcZe1h3sVfop.25nPB.HBDtR4MI0c6r.0UjQZymI5anm', '2023-04-17'),
(3, 'Levi Yale', 'Cacas', '0958232333', 'asdasdasdasdawd', 'levi@gmail.com', '$2b$10$pbE5A5p2BN0DgHvoS/k87uhu/Q5ejKl9qHNViNUtqS8RGY1R3qTDK', '2023-04-23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD KEY `userFK` (`userID`),
  ADD KEY `reservationFK` (`reservationID`);

--
-- Indexes for table `pricelist`
--
ALTER TABLE `pricelist`
  ADD PRIMARY KEY (`priceListID`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`reservationID`),
  ADD KEY `ForeignKey` (`userID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pricelist`
--
ALTER TABLE `pricelist`
  MODIFY `priceListID` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `reservationID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `reservationFK` FOREIGN KEY (`reservationID`) REFERENCES `reservation` (`reservationID`),
  ADD CONSTRAINT `userFK` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `ForeignKey` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
