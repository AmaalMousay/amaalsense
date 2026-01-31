CREATE TABLE `custom_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`countryCode` varchar(2),
	`countryName` varchar(100),
	`metric` enum('gmi','cfi','hri') NOT NULL,
	`condition` enum('above','below','change') NOT NULL,
	`threshold` int NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`notifyMethod` enum('email','telegram','both') NOT NULL DEFAULT 'email',
	`lastTriggered` timestamp,
	`triggerCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custom_alerts_id` PRIMARY KEY(`id`)
);
