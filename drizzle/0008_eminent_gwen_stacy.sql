CREATE TABLE `classified_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`headline` text NOT NULL,
	`domain` enum('politics','economy','mental_health','medical','education','society','entertainment','general') NOT NULL,
	`sensitivity` enum('low','medium','high','critical') NOT NULL,
	`emotionalRiskScore` int NOT NULL DEFAULT 50,
	`joy` int NOT NULL DEFAULT 0,
	`fear` int NOT NULL DEFAULT 0,
	`anger` int NOT NULL DEFAULT 0,
	`sadness` int NOT NULL DEFAULT 0,
	`hope` int NOT NULL DEFAULT 0,
	`curiosity` int NOT NULL DEFAULT 0,
	`dominantEmotion` varchar(32) NOT NULL,
	`confidence` int NOT NULL DEFAULT 75,
	`model` varchar(32) DEFAULT 'hybrid',
	`dcftWeight` int DEFAULT 70,
	`aiWeight` int DEFAULT 30,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classified_analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `followed_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`topic` varchar(500) NOT NULL,
	`domain` enum('politics','economy','mental_health','medical','education','society','entertainment','general'),
	`riskThreshold` int,
	`alertDirection` enum('increase','decrease','both') NOT NULL DEFAULT 'both',
	`isActive` int NOT NULL DEFAULT 1,
	`lastRiskScore` int,
	`lastAnalyzedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `followed_topics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `topic_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`followedTopicId` int NOT NULL,
	`alertType` enum('risk_increase','risk_decrease','threshold_exceeded','new_analysis') NOT NULL,
	`topic` varchar(500) NOT NULL,
	`previousRiskScore` int,
	`currentRiskScore` int NOT NULL,
	`changeAmount` int,
	`message` text,
	`isRead` int NOT NULL DEFAULT 0,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `topic_alerts_id` PRIMARY KEY(`id`)
);
