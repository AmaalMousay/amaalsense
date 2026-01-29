CREATE TABLE `analysis_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionType` varchar(32) NOT NULL DEFAULT 'manual',
	`query` varchar(500),
	`countryCode` varchar(2),
	`gmi` int NOT NULL DEFAULT 0,
	`cfi` int NOT NULL DEFAULT 0,
	`hri` int NOT NULL DEFAULT 0,
	`sentimentScore` int NOT NULL DEFAULT 0,
	`dominantEmotion` varchar(32),
	`sourcesCount` int NOT NULL DEFAULT 0,
	`sourcesBreakdown` text,
	`confidence` int NOT NULL DEFAULT 75,
	`durationMs` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analysis_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_aggregates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`aggregateDate` timestamp NOT NULL,
	`countryCode` varchar(2),
	`avgGmi` int NOT NULL DEFAULT 0,
	`avgCfi` int NOT NULL DEFAULT 0,
	`avgHri` int NOT NULL DEFAULT 0,
	`avgSentiment` int NOT NULL DEFAULT 0,
	`topEmotion` varchar(32),
	`analysesCount` int NOT NULL DEFAULT 0,
	`sourcesCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_aggregates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `source_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`platform` varchar(32) NOT NULL,
	`content` text NOT NULL,
	`sourceUrl` varchar(1000),
	`author` varchar(255),
	`sentimentScore` int NOT NULL DEFAULT 0,
	`joy` int NOT NULL DEFAULT 0,
	`fear` int NOT NULL DEFAULT 0,
	`anger` int NOT NULL DEFAULT 0,
	`sadness` int NOT NULL DEFAULT 0,
	`hope` int NOT NULL DEFAULT 0,
	`curiosity` int NOT NULL DEFAULT 0,
	`dominantEmotion` varchar(32),
	`confidence` int NOT NULL DEFAULT 75,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `source_analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trend_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alertType` varchar(32) NOT NULL,
	`metric` varchar(32) NOT NULL,
	`countryCode` varchar(2),
	`previousValue` int NOT NULL,
	`currentValue` int NOT NULL,
	`changePercent` int NOT NULL,
	`severity` varchar(16) NOT NULL DEFAULT 'medium',
	`message` text,
	`acknowledged` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trend_alerts_id` PRIMARY KEY(`id`)
);
