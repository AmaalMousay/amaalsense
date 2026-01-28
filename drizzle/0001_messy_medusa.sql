CREATE TABLE `emotion_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`headline` text NOT NULL,
	`joy` int NOT NULL DEFAULT 0,
	`fear` int NOT NULL DEFAULT 0,
	`anger` int NOT NULL DEFAULT 0,
	`sadness` int NOT NULL DEFAULT 0,
	`hope` int NOT NULL DEFAULT 0,
	`curiosity` int NOT NULL DEFAULT 0,
	`dominant_emotion` varchar(32) NOT NULL,
	`confidence` int NOT NULL DEFAULT 75,
	`model` varchar(32) DEFAULT 'transformer',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emotion_analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emotion_indices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gmi` int NOT NULL DEFAULT 0,
	`cfi` int NOT NULL DEFAULT 0,
	`hri` int NOT NULL DEFAULT 0,
	`confidence` int NOT NULL DEFAULT 75,
	`analyzedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emotion_indices_id` PRIMARY KEY(`id`)
);
