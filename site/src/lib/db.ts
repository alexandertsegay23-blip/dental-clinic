// Legacy database module - replaced by storage.ts
// This file is kept for backward compatibility but should not be used

import { initDatabase, getAll, create, getById, update, remove } from './storage';

export { initDatabase, getAll, create, getById, update, remove };
