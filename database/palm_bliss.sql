-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2023 at 01:07 PM
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
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `adminID` int(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`adminID`, `email`, `password`, `role`) VALUES
(1, 'palmbliss2023@gmail.com', '$2b$10$kbikczpfr.fh.36ReGnLqurr0nfcaJivoiPfmBjUh6U.tdbOpTBI2', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `contactus`
--

CREATE TABLE `contactus` (
  `contactID` int(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contactNumber` varchar(100) NOT NULL,
  `message` varchar(254) NOT NULL,
  `adminReply` varchar(254) NOT NULL,
  `messageSent` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `contactus`
--

INSERT INTO `contactus` (`contactID`, `firstName`, `lastName`, `email`, `contactNumber`, `message`, `adminReply`, `messageSent`) VALUES
(2, 'Mark ', 'boquiren', 'boqs12345678@gmail.com', '09582323123', 'Lorem ipsum dolor sit amet, praesent metus vestibulum, tempor sed luctus vestibulum mauris mi eros, sapien nunc nullam, vulputate a cras venenatis ante. Aliquam mollis a sem quis ligula viverra, sem non. Vestibulum nisl turpis vel commodo mattis, dui pel', 'So, bale ganto gawin mo par', '2023-05-01 19:05:52'),
(6, 'Mark ', 'boquiren', 'boquiren40@gmail.com', '11', 'Pano po mag book', 'Request ka lang ng ganto par tapos okay na yan', '2023-05-10 15:28:17'),
(7, 'Ako to', 'Si boq', 'boqs12345678@gmail.com', '123', 'Bakit ganon par', 'Kasi ganon', '2023-05-10 22:22:58');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `paymentID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `reservationID` int(11) NOT NULL,
  `guestPaid` int(11) NOT NULL,
  `totalGuestPaid` int(100) NOT NULL,
  `needToPay` int(11) NOT NULL,
  `paymentMethod` varchar(50) NOT NULL,
  `receipt` varchar(254) NOT NULL,
  `paymentCreated` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`paymentID`, `userID`, `reservationID`, `guestPaid`, `totalGuestPaid`, `needToPay`, `paymentMethod`, `receipt`, `paymentCreated`) VALUES
(12, 2, 5, 0, 855, 24000, 'Gcash', '/images/receipt/Gcash/boqsResort.jpg', '2023-05-09 11:01:42.991920'),
(13, 12, 21, 0, 200, 24000, 'Gcash', '/images/receipt/Gcash/receipt.jpg', '2023-05-09 14:21:58.044563'),
(14, 2, 5, 0, 12000, 24000, 'Gcash', '/images/receipt/Gcash/boqsResort.jpg', '2023-05-10 22:14:42.333828');

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
(5, 2, '2023-05-02', '2023-05-03', '12:00 PM', '12:00 PM', 22, '35', 24000, 'approved', '2023-04-22 17:54:26.033181'),
(21, 12, '2023-05-19', '2023-05-20', '10:00 PM', '12:00 PM', 22, '20', 24000, 'approved', '2023-05-09 14:09:10.648505'),
(22, 2, '2023-05-25', '2023-05-25', '10:00 PM', '10:12 PM', 12, '35', 16000, 'approved', '2023-05-10 22:12:50.008260');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `reviewsID` int(100) NOT NULL,
  `userID` int(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `stars` varchar(100) NOT NULL,
  `reviewsMessage` varchar(100) NOT NULL,
  `dateSubmitted` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`reviewsID`, `userID`, `name`, `stars`, `reviewsMessage`, `dateSubmitted`) VALUES
(6, 2, 'mark boquiren', '5', 'solid boss', '2023-05-05 08:32:18.309039'),
(7, 2, 'mark boquiren', '5', 'Sobrang sulit par', '2023-05-05 18:16:02.072925'),
(8, 2, 'mark boquiren', '1', 'asdasd', '2023-05-07 10:13:06.889142'),
(9, 2, 'mark boquiren', '2', 'asd', '2023-05-07 10:16:49.868793'),
(10, 2, 'mark boquiren', '3', 'SASXdawdoijawioudhaiopwudhiauwhdipuawhpdioajw', '2023-05-07 10:24:27.570502');

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
  `reset_password_token` varchar(100) NOT NULL,
  `token_expiration` varchar(100) NOT NULL,
  `dateRegistered` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `firstName`, `lastName`, `contactNumber`, `address`, `email`, `password`, `reset_password_token`, `token_expiration`, `dateRegistered`) VALUES
(2, 'mark', 'boquiren', '0958232333', 'asdasdasdasdawd', 'boqs12345678@gmail.com', '$2b$10$mQzsg0NYRpPNO5u4xBEQEu4uM0l3CQcR3D/2mvmcFeJYwbwMYcfw.', '', '', '2023-04-17'),
(12, 'Maria', 'Quijano', '0123123', 'Blk 56 Lot 2 Pasay Saints', 'maria@gmail.com', '$2b$10$INEwF4IysqKKuwRvs3V55OaRcWiYa.TdbWHuk6vj/pDlhthlcgC0u', '', '', '2023-05-08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`adminID`);

--
-- Indexes for table `contactus`
--
ALTER TABLE `contactus`
  ADD PRIMARY KEY (`contactID`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`paymentID`),
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
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`reviewsID`),
  ADD KEY `reviewsFK` (`userID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `adminID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contactus`
--
ALTER TABLE `contactus`
  MODIFY `contactID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `paymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `pricelist`
--
ALTER TABLE `pricelist`
  MODIFY `priceListID` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `reservationID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `reviewsID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviewsFK` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
