import { z } from 'zod';
import { ResourceSchema, CollectionSchema, type Token } from './schemas';

const BaseSchema = z.object({
	/** Details about the voice actor. */
	description: z.string(),
	/** `male` or `female */
	gender: z.enum(['male', 'female']),
	/** The voice actor's name */
	name: z.string()
});

const Schema = ResourceSchema.extend({
	object: z.literal('voice_actor'),
	data: BaseSchema
});

async function getAll(t: Token) {
	const response = await fetch('https://api.wanikani.com/v2/voice_actors', {
		headers: {
			Authorization: `Bearer ${t}`
		}
	});

	return CollectionSchema.extend({ data: z.array(Schema) }).parse(await response.json());
}

async function get(t: Token, id: number) {
	const response = await fetch(`https://api.wanikani.com/v2/voice_actors/${id}`, {
		headers: {
			Authorization: `Bearer ${t}`
		}
	});

	return Schema.parse(await response.json());
}

export function init(t: Token) {
	return {
		/** Returns a collection of all voice_actors, ordered by ascending created_at, 500 at a time. */
		getAll: () => {
			return getAll(t);
		},
		/** Retrieves a specific voice_actor by its `id`. */
		get: (id: number) => {
			return get(t, id);
		}
	};
}

export const voice_actors = {
	get,
	getAll,
	init
};
