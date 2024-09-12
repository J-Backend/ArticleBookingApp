import { Customer } from "./customer";

export interface SearchResult<T> {
	entities: T[];
	total: number;
}