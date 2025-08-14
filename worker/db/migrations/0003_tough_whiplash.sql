CREATE TABLE `user_participants` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`participant_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_user_participant` ON `user_participants` (`user_id`,`participant_id`);