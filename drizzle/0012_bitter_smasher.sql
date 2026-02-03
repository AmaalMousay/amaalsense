CREATE TABLE `cognitive_learning_insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patternType` enum('weakness','strength','rule_adjustment') NOT NULL,
	`topic` varchar(100),
	`questionType` varchar(100),
	`description` text NOT NULL,
	`evidenceCount` int NOT NULL DEFAULT 1,
	`patternConfidence` int NOT NULL DEFAULT 50,
	`suggestedAction` text,
	`isActive` enum('yes','no') NOT NULL DEFAULT 'no',
	`lastValidated` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cognitive_learning_insights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reasoning_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ruleName` varchar(100) NOT NULL,
	`category` enum('decision','interpretation','response','query') NOT NULL,
	`description` text NOT NULL,
	`weight` int NOT NULL DEFAULT 50,
	`parameters` text,
	`isActive` enum('yes','no') NOT NULL DEFAULT 'yes',
	`timesApplied` int NOT NULL DEFAULT 0,
	`successRate` int DEFAULT 50,
	`lastModifiedBy` varchar(50) DEFAULT 'system',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reasoning_rules_id` PRIMARY KEY(`id`),
	CONSTRAINT `reasoning_rules_ruleName_unique` UNIQUE(`ruleName`)
);
--> statement-breakpoint
CREATE TABLE `response_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`question` text NOT NULL,
	`response` text NOT NULL,
	`rating` int NOT NULL,
	`wasHelpful` enum('yes','no','partial'),
	`wasAccurate` enum('yes','no','unsure'),
	`wasUnderstandable` enum('yes','no','partial'),
	`comment` text,
	`topic` varchar(100),
	`cognitivePattern` varchar(50),
	`dominantEmotion` varchar(32),
	`responseConfidence` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `response_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `self_evaluations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionHash` varchar(64) NOT NULL,
	`question` text NOT NULL,
	`confidenceScore` int NOT NULL,
	`dataSufficiencyScore` int NOT NULL,
	`causesFromDataScore` int NOT NULL,
	`analysisVsNarrationScore` int NOT NULL,
	`overallScore` int NOT NULL,
	`identifiedWeaknesses` text,
	`identifiedStrengths` text,
	`improvementSuggestions` text,
	`newsSourcesCount` int DEFAULT 0,
	`relevantHeadlinesCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `self_evaluations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weekly_self_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`periodStart` timestamp NOT NULL,
	`periodEnd` timestamp NOT NULL,
	`totalResponses` int NOT NULL DEFAULT 0,
	`averageRating` int,
	`averageSelfScore` int,
	`topFailures` text,
	`topSuccesses` text,
	`confusingQuestionTypes` text,
	`dataGapTopics` text,
	`weakInterpretationTopics` text,
	`keyInsights` text,
	`recommendedAdjustments` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `weekly_self_reports_id` PRIMARY KEY(`id`)
);
