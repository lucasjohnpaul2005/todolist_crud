// Action Types
export const CREATE_TASK = 'tasks/create';
export const READ_TASKS = 'tasks/read';
export const UPDATE_TASK = 'tasks/update';
export const DELETE_TASK = 'tasks/delete';

// UI State
export const SET_LOADING = 'tasks/setLoading';
export const SET_ERROR = 'tasks/setError';
export const SET_ACTIVE_TAB = 'tasks/setTab';
export const SWITCH_REPOSITORY = 'tasks/switchRepository';

// Repository Types -'firebase'
export type RepositoryType = 'localStorage' | 'inMemory' | 'firebase';