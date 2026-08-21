import { OptionTick } from '../providers/IOptionsDataProvider';

// Global In-Memory Cache for Flow Data
// This guarantees the UI functions flawlessly in local/development environments
// when Redis is disconnected or offline.
export const inMemoryChainCache: Map<string, Record<string, OptionTick>> = new Map();
