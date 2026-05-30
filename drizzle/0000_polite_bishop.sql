CREATE TABLE `analysis_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`session_type` text DEFAULT 'manual' NOT NULL,
	`query` text,
	`country_code` text,
	`gmi` real DEFAULT 0 NOT NULL,
	`cfi` real DEFAULT 0 NOT NULL,
	`hri` real DEFAULT 0 NOT NULL,
	`sentiment_score` real DEFAULT 0 NOT NULL,
	`dominant_emotion` text,
	`sources_count` integer DEFAULT 0,
	`sources_breakdown` text,
	`confidence` real DEFAULT 0 NOT NULL,
	`duration_ms` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `api_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`key_hash` text NOT NULL,
	`partial_key` text NOT NULL,
	`tier` text DEFAULT 'professional' NOT NULL,
	`usage` integer DEFAULT 0 NOT NULL,
	`limit` integer DEFAULT 1000 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`last_used_at` integer
);
--> statement-breakpoint
CREATE TABLE `case_studies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`country_code` text,
	`title` text NOT NULL,
	`description` text,
	`data` text,
	`topic` text,
	`event_date` integer,
	`prediction_accuracy` real,
	`impact_level` text,
	`data_snapshot` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `classified_analyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`headline` text NOT NULL,
	`content` text,
	`domain` text NOT NULL,
	`sensitivity` text DEFAULT 'medium' NOT NULL,
	`dominant_emotion` text,
	`confidence` real,
	`emotional_risk_score` real,
	`classification_data` text,
	`source_url` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cognitive_learning_insights` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pattern_type` text,
	`topic` text,
	`question_type` text,
	`description` text,
	`evidence_count` integer DEFAULT 0,
	`pattern_confidence` real DEFAULT 0,
	`suggested_action` text,
	`is_active` text DEFAULT 'no' NOT NULL,
	`last_validated` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `country_emotion_analyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`country_code` text NOT NULL,
	`country_name` text,
	`headline` text,
	`content` text,
	`source` text,
	`url` text,
	`sentiment_score` real,
	`dominant_emotion` text,
	`confidence` real,
	`raw_data` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `country_emotion_indices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`country_code` text NOT NULL,
	`country_name` text DEFAULT 'Unknown' NOT NULL,
	`gmi` real DEFAULT 0 NOT NULL,
	`cfi` real DEFAULT 0 NOT NULL,
	`hri` real DEFAULT 0 NOT NULL,
	`confidence` real DEFAULT 0,
	`dominant_emotion` text,
	`analyzed_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_country_emotion_country_code` ON `country_emotion_indices` (`country_code`);--> statement-breakpoint
CREATE TABLE `custom_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`metric` text NOT NULL,
	`condition` text NOT NULL,
	`threshold` real NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`notification_channels` text,
	`last_triggered` integer,
	`trigger_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `daily_aggregates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aggregate_date` integer NOT NULL,
	`country_code` text,
	`avg_gmi` real DEFAULT 0,
	`avg_cfi` real DEFAULT 0,
	`avg_hri` real DEFAULT 0,
	`avg_sentiment` real DEFAULT 0,
	`top_emotion` text,
	`analyses_count` integer DEFAULT 0,
	`sources_count` integer DEFAULT 0,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `emotion_analyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`headline` text NOT NULL,
	`content` text,
	`source` text,
	`url` text,
	`language` text,
	`sentiment_score` real,
	`dominant_emotion` text,
	`confidence` real DEFAULT 0,
	`raw_data` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `emotion_indices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`gmi` real DEFAULT 0 NOT NULL,
	`cfi` real DEFAULT 0 NOT NULL,
	`hri` real DEFAULT 0 NOT NULL,
	`confidence` real DEFAULT 0,
	`dominant_emotion` text,
	`analyzed_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `enterprise_inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`email` text,
	`company` text,
	`message` text,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `followed_topics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`topic` text NOT NULL,
	`keywords` text,
	`domains` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `keyword_learning` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`keyword` text NOT NULL,
	`language` text NOT NULL,
	`event_type` text NOT NULL,
	`emotional_weight` real DEFAULT 0 NOT NULL,
	`primary_emotion` text DEFAULT 'neutral' NOT NULL,
	`confidence` real DEFAULT 50 NOT NULL,
	`source` text,
	`occurrence_count` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_keyword_language_unique` ON `keyword_learning` (`keyword`,`language`);--> statement-breakpoint
CREATE TABLE `learning_patterns` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`original_text` text,
	`language` text NOT NULL,
	`dialect` text,
	`event_type` text NOT NULL,
	`region` text,
	`context_confidence` real DEFAULT 0 NOT NULL,
	`final_joy` real DEFAULT 0 NOT NULL,
	`final_fear` real DEFAULT 0 NOT NULL,
	`final_anger` real DEFAULT 0 NOT NULL,
	`final_sadness` real DEFAULT 0 NOT NULL,
	`final_hope` real DEFAULT 0 NOT NULL,
	`final_curiosity` real DEFAULT 0 NOT NULL,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`is_verified` integer DEFAULT false NOT NULL,
	`user_feedback` text,
	`feedback_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`is_used` integer DEFAULT false NOT NULL,
	`used_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_reset_tokens_token_unique` ON `password_reset_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `payment_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`email` text NOT NULL,
	`stripe_session_id` text,
	`stripe_payment_intent_id` text,
	`amount` integer,
	`currency` text DEFAULT 'usd',
	`status` text DEFAULT 'pending' NOT NULL,
	`plan` text,
	`admin_notes` text,
	`confirmed_at` integer,
	`confirmed_by` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prediction_snapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`country_code` text NOT NULL,
	`gmi` real NOT NULL,
	`cfi` real NOT NULL,
	`hri` real NOT NULL,
	`risk_score` real,
	`trend_direction` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `predictions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`country_code` text NOT NULL,
	`country_name` text,
	`timeframe` text NOT NULL,
	`predicted_gmi` real NOT NULL,
	`predicted_cfi` real NOT NULL,
	`predicted_hri` real NOT NULL,
	`predicted_emotion` text,
	`confidence` real DEFAULT 0,
	`scenario_name` text,
	`risk_score` real,
	`risk_level` text,
	`prediction_data` text,
	`ai_interpretation` text,
	`ai_interpretation_ar` text,
	`predicted_for` integer NOT NULL,
	`actual_gmi` real,
	`actual_cfi` real,
	`actual_hri` real,
	`accuracy_score` real,
	`verified` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reasoning_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rule_name` text NOT NULL,
	`category` text,
	`description` text,
	`weight` real DEFAULT 1 NOT NULL,
	`times_applied` integer DEFAULT 0 NOT NULL,
	`success_rate` real DEFAULT 0 NOT NULL,
	`parameters` text,
	`is_active` text DEFAULT 'yes' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `response_feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`question` text,
	`response` text,
	`rating` integer,
	`was_helpful` text,
	`was_accurate` text,
	`was_understandable` text,
	`comment` text,
	`topic` text,
	`cognitive_pattern` text,
	`dominant_emotion` text,
	`response_confidence` real,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `self_evaluations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_hash` text,
	`question` text,
	`confidence_score` integer DEFAULT 0,
	`data_sufficiency_score` integer DEFAULT 0,
	`causes_from_data_score` integer DEFAULT 0,
	`analysis_vs_narration_score` integer DEFAULT 0,
	`overall_score` integer DEFAULT 0,
	`identified_weaknesses` text,
	`identified_strengths` text,
	`improvement_suggestions` text,
	`news_sources_count` integer DEFAULT 0,
	`relevant_headlines_count` integer DEFAULT 0,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `source_analyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`platform` text NOT NULL,
	`content` text,
	`source_url` text,
	`author` text,
	`sentiment_score` real DEFAULT 0,
	`joy` real DEFAULT 0,
	`fear` real DEFAULT 0,
	`anger` real DEFAULT 0,
	`sadness` real DEFAULT 0,
	`hope` real DEFAULT 0,
	`curiosity` real DEFAULT 0,
	`dominant_emotion` text,
	`confidence` real,
	`published_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `topic_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`topic_id` integer,
	`title` text NOT NULL,
	`message` text,
	`severity` text DEFAULT 'medium',
	`is_read` integer DEFAULT false NOT NULL,
	`read_at` integer,
	`metadata` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trend_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`alert_type` text,
	`metric` text,
	`country_code` text,
	`previous_value` real,
	`current_value` real,
	`change_percent` real,
	`severity` text DEFAULT 'low' NOT NULL,
	`message` text,
	`acknowledged` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `usage_tracking` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`usage_type` text NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	`usage_date` integer NOT NULL,
	`metadata` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`user_level` text DEFAULT 'beginner' NOT NULL,
	`conversation_count` integer DEFAULT 0 NOT NULL,
	`message_count` integer DEFAULT 0 NOT NULL,
	`preferred_topics` text DEFAULT '[]' NOT NULL,
	`technical_terms_used` integer DEFAULT 0 NOT NULL,
	`preferred_response_length` text DEFAULT 'medium' NOT NULL,
	`preferred_language` text DEFAULT 'ar' NOT NULL,
	`last_emotional_state` text,
	`countries_of_interest` text DEFAULT '[]' NOT NULL,
	`last_active_topic` text,
	`profile_confidence` integer DEFAULT 50 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_profiles_user_id_unique` ON `user_profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `user_registrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`password_hash` text NOT NULL,
	`verification_token` text,
	`token_expires_at` integer,
	`is_verified` integer DEFAULT false NOT NULL,
	`verified_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_registrations_email_unique` ON `user_registrations` (`email`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`open_id` text NOT NULL,
	`name` text,
	`email` text,
	`login_method` text,
	`role` text DEFAULT 'user' NOT NULL,
	`subscription_tier` text DEFAULT 'free' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`last_signed_in` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_open_id_unique` ON `users` (`open_id`);--> statement-breakpoint
CREATE TABLE `weekly_self_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`period_start` integer,
	`period_end` integer,
	`total_responses` integer DEFAULT 0,
	`average_rating` integer DEFAULT 0,
	`average_self_score` integer DEFAULT 0,
	`top_failures` text,
	`top_successes` text,
	`confusing_question_types` text,
	`data_gap_topics` text,
	`weak_interpretation_topics` text,
	`key_insights` text,
	`recommended_adjustments` text,
	`created_at` integer NOT NULL
);
