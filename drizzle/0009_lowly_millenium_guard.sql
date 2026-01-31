CREATE TABLE `emotion_trends` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topic` varchar(500) NOT NULL DEFAULT 'global',
	`period` enum('hourly','daily','weekly','monthly') NOT NULL,
	`periodStart` timestamp NOT NULL,
	`periodEnd` timestamp NOT NULL,
	`avgGmi` int NOT NULL,
	`avgCfi` int NOT NULL,
	`avgHri` int NOT NULL,
	`gmiChange` int DEFAULT 0,
	`cfiChange` int DEFAULT 0,
	`hriChange` int DEFAULT 0,
	`analysisCount` int NOT NULL DEFAULT 0,
	`dominantEmotion` varchar(32),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emotion_trends_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `keyword_learning` (
	`id` int AUTO_INCREMENT NOT NULL,
	`keyword` varchar(255) NOT NULL,
	`language` varchar(32) NOT NULL,
	`eventType` varchar(32) NOT NULL,
	`emotionalWeight` int NOT NULL,
	`primaryEmotion` varchar(32) NOT NULL,
	`confidence` int NOT NULL DEFAULT 50,
	`occurrenceCount` int NOT NULL DEFAULT 1,
	`source` varchar(32) NOT NULL DEFAULT 'learned',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `keyword_learning_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `language_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`languageCode` varchar(5) NOT NULL,
	`languageName` varchar(100) NOT NULL,
	`nativeName` varchar(100),
	`textDirection` enum('ltr','rtl') NOT NULL DEFAULT 'ltr',
	`culturalRegion` varchar(32) NOT NULL,
	`expressionStyle` enum('direct','indirect','reserved','expressive') NOT NULL DEFAULT 'direct',
	`sentimentAdjustment` int NOT NULL DEFAULT 0,
	`isFullySupported` int NOT NULL DEFAULT 0,
	`keywordCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `language_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `language_profiles_languageCode_unique` UNIQUE(`languageCode`)
);
--> statement-breakpoint
CREATE TABLE `learning_patterns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`originalText` text NOT NULL,
	`language` varchar(32) NOT NULL,
	`dialect` varchar(32),
	`eventType` varchar(32) NOT NULL,
	`region` varchar(32) NOT NULL,
	`contextConfidence` int NOT NULL,
	`finalJoy` int NOT NULL,
	`finalFear` int NOT NULL,
	`finalAnger` int NOT NULL,
	`finalSadness` int NOT NULL,
	`finalHope` int NOT NULL,
	`finalCuriosity` int NOT NULL,
	`userFeedback` enum('accurate','inaccurate','partially_accurate'),
	`feedbackAt` timestamp,
	`usageCount` int NOT NULL DEFAULT 0,
	`isVerified` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learning_patterns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `multilingual_keywords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`languageCode` varchar(5) NOT NULL,
	`keyword` varchar(255) NOT NULL,
	`englishTranslation` varchar(255),
	`category` varchar(32) NOT NULL,
	`primaryEmotion` varchar(32) NOT NULL,
	`intensity` enum('low','medium','high','extreme') NOT NULL DEFAULT 'medium',
	`emotionalWeight` int NOT NULL,
	`contextNotes` text,
	`source` varchar(32) NOT NULL DEFAULT 'manual',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `multilingual_keywords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `topic_emotion_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topic` varchar(500) NOT NULL,
	`normalizedTopic` varchar(500) NOT NULL,
	`gmi` int NOT NULL,
	`cfi` int NOT NULL,
	`hri` int NOT NULL,
	`joy` int NOT NULL,
	`fear` int NOT NULL,
	`anger` int NOT NULL,
	`sadness` int NOT NULL,
	`hope` int NOT NULL,
	`curiosity` int NOT NULL,
	`dominantEmotion` varchar(32) NOT NULL,
	`sourcesCount` int NOT NULL DEFAULT 0,
	`analyzedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `topic_emotion_history_id` PRIMARY KEY(`id`)
);
