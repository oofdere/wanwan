// this is a ts interface to the wk api with validation via zod
// I have no idea how to wrap APIs, so this code will be messy, bear with me

import { z } from 'zod';
import { assignments } from './assignments';
import { user } from './user';
import { voice_actors } from './voice_actors';
import { summary } from './summary';
import { subjects } from './subjects';

/**
 * Returns an object that provides a fluent interface to the WaniKani API.
 *
 * @export
 * @param {string} token
 * @return {*}
 */
export function wkInit(t: string) {
	const init = {
		/** WaniKani API Token */
		token: t,
		/** Assignments contain information about a user's progress on a particular subject, including their current state and timestamps for various progress milestones. Assignments are created when a user has passed all the components of the given subject and the assignment is at or below their current level for the first time. */
		assignments: assignments.init(t),
		/** Level progressions contain information about a user's progress through the WaniKani levels.
		 *
		 * A level progression is created when a user has met the prerequisites for leveling up, which are:
		 * - Reach a 90% passing rate on assignments for a user's current level with a `subject_type` of `kanji`. Passed assignments have `data.passed` equal to `true` and a data.`passed_at` that's in the past.
		 * - Have access to the level. Under `/user`, the `data.level` must be less than or equal to `data.subscription.max_level_granted`.
		 */
		level_progressions: {},
		/** Users can reset their progress back to any level at or below their current level. When they reset to a particular level, all of the assignments and review_statistics at that level or higher are set back to their default state.
		 *
		 * Resets contain information about when those resets happen, the starting level, and the target level. */
		resets: {},
		/** Reviews log all the correct and incorrect answers provided through the 'Reviews' section of WaniKani. Review records are created when a user answers all the parts of a subject correctly once; some subjects have both meaning or reading parts, and some only have one or the other. Note that reviews are not created for the quizzes in lessons. */
		reviews: {},
		/** Review statistics summarize the activity recorded in reviews. They contain sum the number of correct and incorrect answers for both meaning and reading. They track current and maximum streaks of correct answers. They store the overall percentage of correct answers versus total answers.
		 *
		 * A review statistic is created when the user has done their first review on the related subject. */
		review_statistics: {},
		/** Available spaced repetition systems used for calculating srs_stage changes to Assignments and Reviews. Has relationship with Subjects. */
		spaced_repetition_systems: {},
		/** Study materials store user-specific notes and synonyms for a given subject. The records are created as soon as the user enters any study information. */
		study_materials: {},
		/** Subjects are the radicals, kanji, vocabulary, and kana_vocabulary that are learned through lessons and reviews. They contain basic dictionary information, such as meanings and/or readings, and information about their relationship to other items with WaniKani, like their level. */
		subjects: subjects.init(t),
		/** The summary report contains currently available lessons and reviews and the reviews that will become available in the next 24 hours, grouped by the hour. */
		summary: summary.init(t),
		/** The user summary returns basic information for the user making the API request, identified by their API key. */
		user: user.init(t),
		/** Available voice actors used for vocabulary reading pronunciation audio. */
		voice_actors: voice_actors.init(t)
	};

	return init;
}
