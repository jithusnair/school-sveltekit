import { writable } from "svelte/store";

import type { ProjectDoc } from '$lib/apis/projects'
import type { TaskDoc } from '$lib/apis/tasks'

export const projects = writable<Array<ProjectDoc>>([]);

export const selectedProjectIndex = writable<number>(null)

export const tasks = writable<Array<TaskDoc>>([])

export const selectedTaskIndex = writable<number>(null)