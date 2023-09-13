import { z } from 'zod';
import { ResourceSchema, CollectionSchema, type Token } from '.';

const BaseSchema = z.object({});

async function get(token: Token) {
	const response = await fetch('https://api.wanikani.com/v2/<endpoint>', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return ResourceSchema.extend({ BaseSchema }).parse(await response.json());
}

export function init(token: Token) {
	return {
		get: () => {
			get(token);
		}
	};
}
