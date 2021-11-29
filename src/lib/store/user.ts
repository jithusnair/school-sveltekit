import { writable } from "svelte/store";
import type { UserInfo } from '@firebase/auth-types'

export const user = writable<null|UserInfo>(null)