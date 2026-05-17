import { DateTime } from 'luxon';

export type IntervalTuple = [DateTime | null, DateTime | null];
export const intersection = (
    [aStart, aEnd]: IntervalTuple,
    [bStart, bEnd]: IntervalTuple
): IntervalTuple | null => {
    const start =
        aStart && bStart
            ? aStart > bStart
                ? aStart
                : bStart
            : aStart ?? bStart;

    const end =
        aEnd && bEnd
            ? aEnd < bEnd
                ? aEnd
                : bEnd
            : aEnd ?? bEnd;

    if (start && end && start > end) {
        return null;
    }

    return [start, end];
};

export const toDTFromSQL = (value: string | null) =>
    value ? DateTime.fromSQL(value, { zone: "utc" }) : null;

export const toDTFromDate = (value: Date | null | undefined): DateTime | null =>
    value ? DateTime.fromJSDate(value, { zone: "utc" }) : null;