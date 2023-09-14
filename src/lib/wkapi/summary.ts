import { z } from 'zod';
import { ResourceSchema, CollectionSchema, type Token } from './schemas';

const BaseSchema = z.object({
	/** Details about subjects available for lessons. See table below for object structure. */
	lessons: z.array(
		z.object({
			/** When the paired `subject_ids` are available for lessons. Always beginning of the current hour when the API endpoint is accessed. */
			available_at: z.coerce.date(),
			/** Collection of unique identifiers for subjects. */
			subject_ids: z.array(z.number())
		})
	),
	/** Earliest date when the reviews are available. Is `null` when the user has no reviews scheduled. */
	next_reviews_at: z.coerce.date().nullable(),
	/** Details about subjects available for reviews now and in the next 24 hours by the hour (total of 25 objects). See table below for object structure. */
	reviews: z.array(
		z.object({
			/** When the paired `subject_ids` are available for reviews. All timestamps are the top of an hour. */
			available_at: z.coerce.date(),
			/** Collection of unique identifiers for subjects. */
			subject_ids: z.array(z.number())
		})
	)
});

const Schema = ResourceSchema.extend({
	object: z.literal('report'),
	data: BaseSchema
});

async function get(t: Token) {
	const response = await fetch(`https://api.wanikani.com/v2/summary`, {
		headers: {
			Authorization: `Bearer ${t}`
		}
	});

	return Schema.parse(await response.json());
}

export function init(t: Token) {
	return {
		/** Retrieves a summary report. */
		get: () => {
			return get(t);
		}
	};
}

export const summary = {
	get,
	init
};
