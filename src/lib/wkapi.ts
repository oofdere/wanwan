// this is a ts interface to the wk api with validation via zod
// I have no idea how to wrap APIs, so this code will be messy, bear with me

import { derived } from 'svelte/store';
import { z } from 'zod';
import { settings } from '$lib/settings';

// Base schemas

export const wkResourceSchema = z.object({
	id: z.number().optional(),
	url: z.string().url(),
	data_updated_at: z.coerce.date().nullable()
});

export type wkResource = typeof wkResourceSchema._type;

export const wkCollectionSchema = z.object({
	url: z.string().url(),
	pages: z.object({
		next_url: z.string().url().nullable(),
		previous_url: z.string().url().nullable(),
		per_page: z.number()
	}),
	total_count: z.number(),
	data_updated_at: z.date().nullable()
});

export type wkCollection = typeof wkCollectionSchema._type;

// Assignments

// Level Progressions

// Resets

// Reviews

// Review Statistics

// Spaced Repetition Systems

// Study Materials

// Subjects

// Summary

// User

export const wkUserPreferencesSchema = z.object({
	default_voice_actor_id: z.number(),
	extra_study_autoplay_audio: z.boolean(),
	lessons_autoplay_audio: z.boolean(),
	lessons_batch_size: z.number(),
	lessons_presentation_order: z.enum([
		'ascending_level_then_subject',
		'shuffled',
		'ascending_level_then_shuffled'
	]),
	reviews_autoplay_audio: z.boolean(),
	reviews_display_srs_indicator: z.boolean(),
	reviews_presentation_order: z.enum(['shuffled', 'lower_levels_first'])
});

export type wkUserPreferences = typeof wkUserPreferencesSchema._type;

export const wkUserSubscriptionSchema = z.object({
	active: z.boolean(),
	max_level_granted: z.number(),
	period_ends_at: z.coerce.date().nullable(),
	type: z.enum(['free', 'recurring', 'lifetime'])
});

export type wkUserSubscription = typeof wkUserSubscriptionSchema._type;

export const wkUserSchema = wkResourceSchema.extend({
	object: z.literal('user'),
	data: z.object({
		current_vacation_started_at: z.coerce.date().nullable(),
		level: z.number(),
		preferences: wkUserPreferencesSchema,
		profile_url: z.string().url(),
		started_at: z.coerce.date(),
		subscription: wkUserSubscriptionSchema,
		username: z.string()
	})
});

export type wkUser = typeof wkUserSchema._type;

async function getUser(token: string) {
	const response = await fetch('https://api.wanikani.com/v2/user', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return wkUserSchema.parse(await response.json());
}

// Voice Actors

// Wrapper
export function wkInit(token: string) {
	return {
		token,
		assignments: {},
		level_progressions: {},
		resets: {},
		reviews: {},
		review_statistics: {},
		spaced_repetition_systems: {},
		study_materials: {},
		subjects: {},
		summary: {},
		user: {
			get: () => {
				return getUser(token);
			}
		},
		voice_actors: {}
	};
}

export const wk = derived(settings, (s) => (s.wkToken ? wkInit(s.wkToken) : null));
