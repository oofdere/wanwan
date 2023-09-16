import type { PageLoad } from './$types';
import { get } from 'svelte/store';

export const load: PageLoad = ({ params }) => {
	return { id: params.id };
};
