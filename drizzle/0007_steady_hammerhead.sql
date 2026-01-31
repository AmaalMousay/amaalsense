CREATE TABLE `password_reset_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`token` varchar(64) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`isUsed` int NOT NULL DEFAULT 0,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `password_reset_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `password_reset_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`accountType` enum('individual','organization') NOT NULL DEFAULT 'individual',
	`organizationName` varchar(255),
	`organizationWebsite` varchar(500),
	`companySize` varchar(32),
	`jobTitle` varchar(255),
	`verificationToken` varchar(64),
	`tokenExpiresAt` timestamp,
	`isVerified` int NOT NULL DEFAULT 0,
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_registrations_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_registrations_email_unique` UNIQUE(`email`)
);
