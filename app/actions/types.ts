import { type PlatformMembership } from '@/lib/db/schemas/platformMembership';
import { type Listing } from '@/lib/db/schemas/listing';
import { type Match } from '@/lib/db/schemas/match';

export type ActionSuccess<T = void> = T extends void ? { ok: true } : { ok: true; data: T };
export type ActionError = { ok: false; error: string; status: number };
export type ActionResult<T = void> = ActionSuccess<T> | ActionError;

export type MatchParticipantContext = {
    match: Match;
    membership: PlatformMembership;
    listing: { id: Listing['id'] };
};