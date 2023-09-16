import { z } from 'zod';
import { ResourceSchema, CollectionSchema, type Token } from './schemas';

const Meaning = z.object({
	/** A singular subject meaning. */
	meaning: z.string(),
	/** Indicates priority in the WaniKani system. */
	primary: z.boolean(),
	/** Indicates if the meaning is used to evaluate user input for correctness. */
	accepted_answer: z.boolean()
});

const AuxillaryMeaning = z.object({
	/** A singular subject meaning. */
	meaning: z.string(),
	/** Either `whitelist` or `blacklist`. When evaluating user input, whitelisted meanings are used to match for correctness. Blacklisted meanings are used to match for incorrectness. */
	type: z.enum(['whitelist', 'blacklist'])
});

const BaseSchema = z.object({
	/** Collection of auxiliary meanings. See table below for the object structure. */
	auxillary_meanings: z.array(AuxillaryMeaning).optional(),
	/** The UTF-8 characters for the subject, including kanji and hiragana. */
	characters: z.string(),
	/** Timestamp when the subject was created. */
	created_at: z.coerce.date(),
	/** A URL pointing to the page on wanikani.com that provides detailed information about this subject. */
	document_url: z.string().url(),
	/** Timestamp when the subject was hidden, indicating associated assignments will no longer appear in lessons or reviews and that the subject page is no longer visible on wanikani.com. */
	hidden_at: z.coerce.date().nullable(),
	/** The position that the subject appears in lessons. Note that the value is scoped to the level of the subject, so there are duplicate values across levels. */
	lesson_position: z.number(),
	/** The level of the subject, from `1` to `60`. */
	level: z.number(),
	/** The subject's meaning mnemonic. */
	meaning_mnemonic: z.string(),
	/** The subject meanings. See table below for the object structure. */
	meanings: z.array(Meaning),
	/** The string that is used when generating the document URL for the subject. Radicals use their meaning, downcased. Kanji and vocabulary use their characters. */
	slug: z.string(),
	/** Unique identifier of the associated spaced_repetition_system. */
	spaced_repetition_system_id: z.number()
});

const Radical = BaseSchema.extend({
	/** An array of numeric identifiers for the kanji that have the radical as a component. */
	amalgamation_subject_ids: z.array(z.number()),
	/** Unlike kanji and vocabulary, radicals can have a null value for `characters`. Not all radicals have a UTF entry, so the radical must be visually represented with an image instead. */
	characters: z.string().nullable(),
	/** A collection of images of the radical. See table below for the object structure. */
	character_images: z.array(
		z.union([
			z.object({
				/** The location of the image. */
				url: z.string(),
				/** The content type of the image. Currently the API delivers `image/png` and `image/svg+xml`. */
				content_type: z.literal('image/png'),
				/** Details about the image. Each `content_type` returns a uniquely structured object. */
				metadata: z.object({
					/** Color of the asset in hexadecimal */
					color: z.string(),
					/** Dimension of the asset in pixels */
					dimensions: z.string(),
					/** A name descriptor */
					style_name: z.string()
				})
			}),
			z.object({
				/** The location of the image. */
				url: z.string(),
				/** The content type of the image. Currently the API delivers `image/png` and `image/svg+xml`. */
				content_type: z.literal('image/svg+xml'),
				/** Details about the image. Each `content_type` returns a uniquely structured object. */
				metadata: z.object({
					/** The SVG asset contains built-in CSS styling */
					inline_styles: z.boolean()
				})
			})
		])
	)
});

const Kanji = BaseSchema.extend({
	/** An array of numeric identifiers for the vocabulary that have the kanji as a component. */
	amalgamation_subject_ids: z.array(z.number()),
	/** An array of numeric identifiers for the radicals that make up this kanji. Note that these are the subjects that must have passed assignments in order to unlock this subject's assignment. */
	component_subject_ids: z.array(z.number()),
	/** Meaning hint for the kanji. */
	meaning_hint: z.string().nullable(),
	/** Reading hint for the kanji. */
	reading_hint: z.string().nullable(),
	/** The kanji's reading mnemonic. */
	reading_mnemonic: z.string(),
	/** Selected readings for the kanji. See table below for the object structure. */
	readings: z.array(
		z.object({
			/** A singular subject reading. */
			reading: z.string(),
			/** Indicates priority in the WaniKani system. */
			primary: z.boolean(),
			/** Indicates if the reading is used to evaluate user input for correctness. */
			accepted_answer: z.boolean(),
			/** The kanji reading's classfication: `kunyomi`, `nanori`, or `onyomi`. */
			type: z.enum(['kunyomi', 'nanori', 'onyomi'])
		})
	),
	/** An array of numeric identifiers for kanji which are visually similar to the kanji in question. */
	visually_similar_object_ids: z.array(z.number()).optional()
});

const PronunciationAudio = z.object({
	/** The location of the audio. */
	url: z.string().url(),
	/** The content type of the audio. Currently the API delivers `audio/mpeg` and `audio/ogg`.
	 *
	 * *The official docs are out of date, and also deliver `audio/webm`, which is included in the type.*
	 */
	content_type: z.enum(['audio/mpeg', 'audio/ogg', 'audio/webm']),
	/** Details about the pronunciation audio. See table below for details. */
	metadata: z.object({
		/** The gender of the voice actor. */
		gender: z.string(),
		/** A unique ID shared between same source pronunciation audio. */
		source_id: z.number(),
		/** Vocabulary being pronounced in kana. */
		pronunciation: z.string(),
		/** A unique ID belonging to the voice actor. */
		voice_actor_id: z.number(),
		/** Humanized name of the voice actor. */
		voice_actor_name: z.string(),
		/** Description of the voice. */
		voice_description: z.string()
	})
});

const KanaVocabulary = BaseSchema.extend({
	/** A collection of context sentences. See table below for the object structure. */
	context_sentences: z.array(
		z.object({
			/** English translation of the sentence */
			en: z.string(),
			/** Japanese context sentence */
			ja: z.string()
		})
	),
	/** The subject's meaning mnemonic. */
	meaning_mnemonic: z.string(),
	/** Parts of speech. */
	parts_of_speech: z.array(z.string()),
	/** A collection of pronunciation audio. See table below for the object structure. */
	pronunciation_audios: z.array(PronunciationAudio)
});

const Vocabulary = KanaVocabulary.extend({
	/** An array of numeric identifiers for the kanji that make up this vocabulary. Note that these are the subjects that must be have passed assignments in order to unlock this subject's assignment. */
	component_subject_ids: z.array(z.number()),
	/** Selected readings for the vocabulary. See table below for the object structure. */
	readings: z.array(
		z.object({
			/** A singular subject reading. */
			reading: z.string(),
			/** Indicates priority in the WaniKani system. */
			primary: z.boolean(),
			/** Indicates if the reading is used to evaluate user input for correctness. */
			accepted_answer: z.boolean()
		})
	),
	/** The subject's reading mnemonic. */
	reading_mnemonic: z.string()
});

const Schema = ResourceSchema.extend({
	object: z.enum(['radical', 'kanji', 'vocabulary', 'kana_vocabulary']),
	data: z.any()
});

type getAllSettings = {
	/** Only subjects where `data.id` matches one of the array values are returned. */
	ids?: number[];
	/** Return subjects of the specified types. */
	types?: string[];
	/** Return subjects of the specified slug. */
	slugs?: string[];
	/** Return subjects at the specified levels. */
	levels?: number[];
	/** Return subjects which are or are not hidden from the user-facing application. */
	hidden?: boolean;
	/** Only subjects updated after this time are returned. */
	updated_after?: Date;
};

async function getAll(t: Token) {
	const response = await fetch(`https://api.wanikani.com/v2/subjects`, {
		headers: {
			Authorization: `Bearer ${t}`
		}
	});

	return CollectionSchema.extend({ data: Schema }).parse(await response.json());
}

type DataTypes =
	| z.infer<typeof Radical>
	| z.infer<typeof Kanji>
	| z.infer<typeof Vocabulary>
	| z.infer<typeof KanaVocabulary>;

type Kind =
	| { kind: 'radical'; data: z.infer<typeof Radical> }
	| { kind: 'kanji'; data: z.infer<typeof Kanji> }
	| { kind: 'vocabulary'; data: z.infer<typeof Vocabulary> }
	| { kind: 'kana_vocabulary'; data: z.infer<typeof KanaVocabulary> };

async function get(t: Token, id: number) {
	const response = await fetch(`https://api.wanikani.com/v2/subjects/${id}`, {
		headers: {
			Authorization: `Bearer ${t}`
		}
	});

	const base = Schema.parse(await response.json());

	let kind;
	let data: Kind;
	switch (base.object) {
		case 'radical':
			data = {
				kind: 'radical',
				data: Radical.parse(base.data)
			};
			break;
		case 'kanji':
			data = {
				kind: 'kanji',
				data: Kanji.parse(base.data)
			};
			break;
		case 'vocabulary':
			data = {
				kind: 'vocabulary',
				data: Vocabulary.parse(base.data)
			};
			break;
		case 'kana_vocabulary':
			data = {
				kind: 'kana_vocabulary',
				data: KanaVocabulary.parse(base.data)
			};
			break;
	}

	return {
		...base,
		data
	};
}

enum SubjectType {
	Radical,
	Kanji,
	Vocabulary,
	KanaVocabulary
}

export function init(t: Token) {
	return {
		/** Returns a collection of all subjects, ordered by ascending created_at, `1000` at a time. */
		getAll: (s?: getAllSettings) => {
			return getAll(t);
		},
		/** Retrieves a specific subject by its `id`. The structure of the response depends on the subject type. See the section on subject data structure for details. */
		get: (id: number) => {
			return get(t, id);
		}
	};
}

export const subjects = {
	getAll,
	get,
	init
};
