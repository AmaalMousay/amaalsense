CREATE TABLE `payment_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`name` varchar(255) NOT NULL,
	`plan` varchar(32) NOT NULL,
	`amount` int NOT NULL,
	`billingPeriod` varchar(16) NOT NULL DEFAULT 'monthly',
	`paymentMethod` varchar(32) NOT NULL,
	`transactionRef` varchar(255),
	`paymentDetails` text,
	`status` enum('pending','confirmed','rejected','refunded') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`confirmedAt` timestamp,
	`confirmedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_records_id` PRIMARY KEY(`id`)
);
