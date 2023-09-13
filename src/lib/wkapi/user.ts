import { number, z } from 'zod';
import { ResourceSchema, CollectionSchema, type Token } from '.';

const Preferences = z.object({
	/** The voice actor to be used for lessons and reviews. The value is associated to `subject.pronunciation_audios.metadata.voice_actor_id`. */
	default_voice_actor_id: z.number(),
	/** Automatically play pronunciation audio for vocabulary during extra study. */
	extra_study_autoplay_audio: z.boolean(),
	/** Automatically play pronunciation audio for vocabulary during lessons. */
	lessons_autoplay_audio: z.boolean(),
	/** Number of subjects introduced to the user during lessons before quizzing. */
	lessons_batch_size: z.number(),
	/** The order in which lessons are presented. The options are `ascending_level_then_subject`, `shuffled`, and `ascending_level_then_shuffled`. The default (and best experience) is `ascending_level_then_subject`. */
	lessons_presentation_order: z.enum([
		'ascending_level_then_subject',
		'shuffled',
		'ascending_level_then_shuffled'
	]),
	/** Automatically play pronunciation audio for vocabulary during reviews. */
	reviews_autoplay_audio: z.boolean(),
	/** Toggle for display SRS change indicator after a subject has been completely answered during review. */
	reviews_display_srs_indicator: z.boolean(),
	/** The order in which reviews are presented. The options are `shuffled` and `lower_levels_first`. The default (and best experience) is shuffled. */
	reviews_presentation_order: z.enum(['shuffled', 'lower_levels_first'])
});

const Subscription = z.object({
	/** Whether or not the user currently has a paid subscription. */
	active: z.boolean(),
	/** The maximum level of content accessible to the user for lessons, reviews, and content review. For unsubscribed/free users, the maximum level is `3`. For subscribed users, this is `60`. **Any application that uses data from the WaniKani API must respect these access limits.** */
	max_level_granted: z.number(),
	/** The date when the user's subscription period ends. If the user has subscription type `lifetime` or `free` then the value is `null`. */
	period_ends_at: z.coerce.date().nullable(),
	/** The type of subscription the user has. Options are following: `free`, `recurring`, and `lifetime`. */
	type: z.enum(['free', 'recurring', 'lifetime'])
});

const BaseSchema = z.object({
	/** If the user is on vacation, this will be the timestamp of when that vacation started. If the user is not on vacation, this is `null`. */
	current_vacation_started_at: z.coerce.date().nullable(),
	/** The current level of the user. This ignores subscription status. */
	level: z.number(),
	/** User settings specific to the WaniKani application. See table below for the object structure. */
	preferences: Preferences,
	/** The URL to the user's public facing profile page. */
	profile_url: z.string().url(),
	/** The signup date for the user. */
	started_at: z.coerce.date(),
	/** Details about the user's subscription state. See table below for the object structure. */
	subscription: Subscription,
	/** The user's username. */
	username: z.string()
});

const Schema = ResourceSchema.extend({
	object: z.literal('assignment'),
	data: BaseSchema
});

async function get(t: Token) {
	const response = await fetch(`https://api.wanikani.com/v2/user`, {
		headers: {
			Authorization: `Bearer ${t}`
		}
	});

	return ResourceSchema.extend({ BaseSchema }).parse(await response.json());
}

export async function init(t: Token) {
	const user = await get(t);

	return {
		...user,
		...user.BaseSchema,
		/** Returns a summary of user information. Is built into the `init()` return since it rarely updates, reccomended way to update is to create a new instance of the API client. */
		getRaw: () => {
			return get(t);
		}
	};
}

export const user = {
	get,
	init
};
