CREATE TABLE `event_registration_links` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`link_id` text NOT NULL,
	`event_name` text NOT NULL,
	`organizer_name` text NOT NULL,
	`notification_channels` text NOT NULL,
	`is_active` integer NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_registration_links_link_id_unique` ON `event_registration_links` (`link_id`);