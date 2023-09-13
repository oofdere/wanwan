// Base schemas

import { z } from 'zod';

/** WaniKani v2 API key */
export type Token = string;

/** Zod schema for WaniKani Resources */
export const ResourceSchema = z.object({
	id: z.number().optional(),
	url: z.string().url(),
	data_updated_at: z.coerce.date().nullable()
});

/** Type for WaniKani Resources */
export type Resource = typeof ResourceSchema._type;

/** Zod schema for WaniKani Collections */
export const CollectionSchema = z.object({
	object: z.literal('collection'),
	url: z.string().url(),
	pages: z.object({
		next_url: z.string().url().nullable(),
		previous_url: z.string().url().nullable(),
		per_page: z.number()
	}),
	total_count: z.number(),
	data_updated_at: z.coerce.date().nullable()
});

/** Type for WaniKani Collections */
export type Collection = typeof CollectionSchema._type;
