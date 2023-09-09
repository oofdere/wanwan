import { writable, type Writable, derived } from 'svelte/store';

export type settingsSchema = {
	wkToken: string | null;
};

const init = () => {
	return {
		wkToken: localStorage.getItem('wkToken')
	};
};

const { subscribe, set, update } = writable(init());

function setToken(token: string) {
	localStorage.setItem('wkToken', token);
	set(init());
}

function deleteToken() {
	localStorage.removeItem('wkToken');
	set(init());
}

export const settings = {
	subscribe,
	setToken,
	deleteToken,
	reset: set(init())
};
