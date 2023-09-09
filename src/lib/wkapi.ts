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
	data_updated_at: z.coerce.date().nullable()
});

export type wkCollection = typeof wkCollectionSchema._type;

// Assignments

export const wkAssignmentBase = z.object({
	available_at: z.coerce.date().nullable(),
	burned_at: z.coerce.date().nullable(),
	created_at: z.coerce.date(),
	hidden: z.boolean(),
	passed_at: z.coerce.date().nullable(),
	resurrected_at: z.coerce.date().nullable(),
	srs_stage: z.number(),
	started_at: z.coerce.date().nullable(),
	subject_id: z.number(),
	unlocked_at: z.coerce.date().nullable()
});

export const wkAssignmentSchema = wkResourceSchema.extend({
	object: z.literal('assignment'),
	data: wkAssignmentBase
});

export type wkAssignment = typeof wkAssignmentSchema._type;

async function getAssignment(token: string, assignment: number) {
	const response = await fetch(`https://api.wanikani.com/v2/assignments/${assignment}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return wkAssignmentSchema.parse(await response.json());
}

export const wkAssignmentsSchema = wkCollectionSchema.extend({
	object: z.literal('collection'),
	data: z.array(wkAssignmentBase)
});

export type wkAssignments = typeof wkAssignmentsSchema._type;

export type wkAssignmentsFilters = {
	available_after?: Date;
	available_before?: Date;
	burned?: boolean;
	hidden?: boolean;
	ids?: Array<number>;
	immediately_available_for_lessons?: boolean;
	immediately_available_for_review?: boolean;
	in_review?: boolean;
	levels?: Array<number>;
	srs_stages?: Array<number>;
	started?: boolean;
	subject_ids?: Array<number>;
	subject_types?: Array<'kana_vocabulary' | 'kanji' | 'radical' | 'vocabulary'>;
	unlocked?: boolean;
	updated_after?: Date;
};

// add filters
async function getAssignments(token: string) {
	const response = await fetch(`https://api.wanikani.com/v2/assignments`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return wkAssignmentsSchema.parse(await response.json());
}

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

export const wkVoiceActorSchema = wkResourceSchema.extend({
	object: z.literal('voice_actor'),
	data: z.object({
		description: z.string(),
		gender: z.enum(['male', 'female']),
		name: z.string()
	})
});

async function getVoiceActor(token: string, id: number) {
	const response = await fetch(`https://api.wanikani.com/v2/voice_actors/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return wkUserSchema.parse(await response.json());
}

export const wkVoiceActorsSchema = wkCollectionSchema.extend({
	data: z.array(wkVoiceActorSchema)
});

async function getVoiceActors(token: string) {
	const response = await fetch('https://api.wanikani.com/v2/voice_actors', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return wkVoiceActorsSchema.parse(await response.json());
}

// Wrapper

export function wkInit(token: string) {
	return {
		token,
		assignments: {
			get: (id: number) => {
				return getAssignment(token, id);
			},
			getAll: () => {
				return getAssignments(token);
			}
		},
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
		voice_actors: {
			get: (id: number) => {
				return getVoiceActor(token, id);
			},
			getAll: () => {
				return getVoiceActors(token);
			}
		}
	};
}

export const wk = derived(settings, (s) => (s.wkToken ? wkInit(s.wkToken) : null));

export const user = derived(wk, (w) => (w ? w.user.get() : null));
