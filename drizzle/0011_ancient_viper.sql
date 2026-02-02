CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userLevel` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
	`conversationCount` int NOT NULL DEFAULT 0,
	`messageCount` int NOT NULL DEFAULT 0,
	`preferredTopics` text,
	`technicalTermsUsed` int NOT NULL DEFAULT 0,
	`preferredResponseLength` enum('short','medium','detailed') DEFAULT 'medium',
	`preferredLanguage` varchar(5) DEFAULT 'ar',
	`lastEmotionalState` varchar(32),
	`countriesOfInterest` text,
	`lastActiveTopic` varchar(255),
	`profileConfidence` int NOT NULL DEFAULT 50,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_userId_unique` UNIQUE(`userId`)
);
