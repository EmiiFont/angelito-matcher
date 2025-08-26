CREATE TABLE `pre_registered_participants` (
	`id` text PRIMARY KEY NOT NULL,
	`link_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone_number` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`link_id`) REFERENCES `event_registration_links`(`link_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_email_per_link` ON `pre_registered_participants` (`link_id`,`email`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_event_registration_links` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text,
	`link_id` text NOT NULL,
	`event_name` text NOT NULL,
	`organizer_name` text NOT NULL,
	`notification_channels` text NOT NULL,
	`is_active` integer NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_event_registration_links`("id", "event_id", "link_id", "event_name", "organizer_name", "notification_channels", "is_active", "created_at", "expires_at") SELECT "id", "event_id", "link_id", "event_name", "organizer_name", "notification_channels", "is_active", "created_at", "expires_at" FROM `event_registration_links`;--> statement-breakpoint
DROP TABLE `event_registration_links`;--> statement-breakpoint
ALTER TABLE `__new_event_registration_links` RENAME TO `event_registration_links`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `event_registration_links_link_id_unique` ON `event_registration_links` (`link_id`);