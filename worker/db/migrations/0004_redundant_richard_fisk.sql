DROP INDEX `participants_email_unique`;--> statement-breakpoint
ALTER TABLE `participants` ADD `event_id` text NOT NULL REFERENCES events(id);--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_participant_per_event` ON `participants` (`event_id`,`email`);