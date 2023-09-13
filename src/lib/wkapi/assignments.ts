import { z } from 'zod';
import { ResourceSchema, CollectionSchema, type Token } from '.';

const BaseSchema = z.object({
	/** Timestamp when the related subject will be available in the user's review queue. */
	available_at: z.coerce.date().nullable(),
	/** Timestamp when the user reaches SRS stage `9` the first time. */
	burned_at: z.coerce.date().nullable(),
	/** Timestamp when the assignment was created. */
	created_at: z.coerce.date(),
	/** Indicates if the associated subject has been hidden, preventing it from appearing in lessons or reviews. */
	hidden: z.boolean(),
	/** Timestamp when the user reaches SRS stage `5` for the first time. */
	passed_at: z.coerce.date().nullable(),
	/** Timestamp when the subject is resurrected and placed back in the user's review queue. */
	resurrected_at: z.coerce.date().nullable(),
	/** The current SRS stage interval. The interval range is determined by the related subject's spaced repetition system. */
	srs_stage: z.number(),
	/** Timestamp when the user completes the lesson for the related subject. */
	started_at: z.coerce.date().nullable(),
	/** Unique identifier of the associated subject. */
	subject_id: z.number(),
	/** The type of the associated subject, one of: `kana_vocabulary`, `kanji`, `radical`, or `vocabulary`. */
	subject_type: z.enum(['kana_vocabulary', 'kanji', 'radical', 'vocabulary']),
	/** The timestamp when the related subject has its prerequisites satisfied and is made available in lessons.
	 *
	 * Prerequisites are:
	 *  - The subject components have reached SRS stage `5` once (they have been “passed”).
	 *  - The user's level is equal to or greater than the level of the assignment’s subject. */
	unlocked_at: z.coerce.date().nullable()
});

const Schema = ResourceSchema.extend({
	object: z.literal('assignment'),
	data: BaseSchema
});

type getAllSettings = {
	/** Only assignments available at or after this time are returned. */
	available_after?: Date;
	/** Only assignments available at or before this time are returned. */
	available_before?: Date;
	/** When set to `true`, returns assignments that have a value in `data.burned_at`. Returns assignments with a null `data.burned_at` if `false`. */
	burned?: boolean;
	/** Return assignments with a matching value in the `hidden` attribute */
	hidden?: boolean;
	/** Only assignments where `data.id` matches one of the array values are returned. */
	ids?: number[];
	/** Returns assignments which are immediately available for lessons */
	immediately_available_for_lessons?: boolean;
	/** Returns assignments which are immediately available for review */
	immediately_available_for_review?: boolean;
	/** Returns assignments which are in the review state */
	in_review?: boolean;
	/** Only assignments where the associated subject level matches one of the array values are returned. Valid values range from `1` to `60`. */
	levels?: number[];
	/** Only assignments where `data.srs_stage` matches one of the array values are returned. Valid values range from `0` to `9` */
	srs_stages?: number[];
	/** When set to `true`, returns assignments that have a value in `data.started_at`. Returns assignments with a `null` `data.started_at` if `false`. */
	started?: boolean;
	/** Only assignments where `data.subject_id` matches one of the array values are returned. */
	subject_ids?: number[];
	/** Only assignments where `data.subject_type` matches one of the array values are returned. Valid values are: `kana_vocabulary`, `kanji`, `radical`, or `vocabulary`. */
	subject_types?: ('kana_vocabulary' | 'kanji' | 'radical' | 'vocabulary')[];
	/** When set to `true`, returns assignments that have a value in `data.unlocked_at`. Returns assignments with a `null` `data.unlocked_at` if `false`. */
	unlocked?: boolean;
	/** Only assignments updated after this time are returned.   */
	updated_after?: Date;
};

async function getAll(t: Token, s?: getAllSettings) {
	const p = new URLSearchParams();

	if (s) {
		for (const [k, v] of Object.entries(s)) {
			p.append(k, v);
		}
	}

	const response = await fetch(`https://api.wanikani.com/v2/assignments/?${p}`, {
		headers: {
			Authorization: `Bearer ${t}`
		}
	});

	return CollectionSchema.extend({ data: Schema }).parse(await response.json());
}

async function get(t: Token, id: number) {
	const response = await fetch(`https://api.wanikani.com/v2/assignments/${id}`, {
		headers: {
			Authorization: `Bearer ${t}`
		}
	});

	return ResourceSchema.extend({ BaseSchema }).parse(await response.json());
}

async function start(t: Token, id: number) {
	// add support for started_at parameter
	const response = await fetch(`https://api.wanikani.com/v2/assignments/${id}/start`, {
		headers: {
			Authorization: `Bearer ${t}`
		}
	});

	return ResourceSchema.extend({ BaseSchema }).parse(await response.json());
}

export function init(t: Token) {
	return {
		/** Returns a collection of all assignments, ordered by ascending `created_at`, 500 at a time. */
		getAll: (s?: getAllSettings) => {
			return getAll(t, s);
		},
		/** Retrieves a specific assignment by its id. */
		get: (id: number) => {
			return get(t, id);
		},
		/** Mark the assignment as started, moving the assignment from the lessons queue to the review queue. Returns the updated assignment. */
		start: (id: number) => {
			return start(t, id);
		}
	};
}

export const assignments = {
	getAll,
	get,
	start,
	init
};
