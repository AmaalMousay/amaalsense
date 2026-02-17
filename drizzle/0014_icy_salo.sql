CREATE TABLE `knowledge_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`query` varchar(500) NOT NULL,
	`knowledge` text NOT NULL,
	`sourceType` varchar(32) NOT NULL,
	`confidence` int DEFAULT 75,
	`hitCount` int DEFAULT 0,
	`lastAccessed` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `knowledge_cache_id` PRIMARY KEY(`id`),
	CONSTRAINT `knowledge_cache_query_unique` UNIQUE(`query`)
);
--> statement-breakpoint
CREATE TABLE `response_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questionHash` varchar(64) NOT NULL,
	`question` varchar(1000) NOT NULL,
	`response` text NOT NULL,
	`qualityScore` int DEFAULT 75,
	`hitCount` int DEFAULT 0,
	`lastAccessed` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `response_cache_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`question` text NOT NULL,
	`questionType` varchar(32) NOT NULL,
	`detectedTopics` text,
	`detectedCountries` text,
	`response` text NOT NULL,
	`emotionJoy` int DEFAULT 0,
	`emotionHope` int DEFAULT 0,
	`emotionSadness` int DEFAULT 0,
	`emotionAnger` int DEFAULT 0,
	`emotionFear` int DEFAULT 0,
	`emotionCuriosity` int DEFAULT 0,
	`language` varchar(10) NOT NULL DEFAULT 'ar',
	`confidence` int DEFAULT 75,
	`processingTimeMs` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `response_cache` ADD CONSTRAINT `response_cache_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_conversations` ADD CONSTRAINT `user_conversations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;