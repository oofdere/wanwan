import { derived } from 'svelte/store';
import { settings } from '$lib/settings';
import { wkInit } from './wkapi';

export const wk = derived(settings, (s) => (s.wkToken ? wkInit(s.wkToken) : null));

export const user = derived(wk, (w) => (w ? w.user.get() : null));
