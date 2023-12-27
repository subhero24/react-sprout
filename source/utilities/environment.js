export const node = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
export const browser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const testing = process.env.NODE_ENV === 'testing';
export const production = process.env.NODE_ENV === 'production';
export const development = process.env.NODE_ENV === 'development' || process.env.NODE_ENV == undefined;
