import {DateTime} from 'luxon';
import {memo} from 'react';

import {IntervalTuple} from '@/lib/date';

type Props = {
    interval: IntervalTuple;
}

export default memo(function Period({interval}: Props) {
    return <div>{formatInterval(interval)}</div>;
})

const toLocal = (dt: DateTime) => dt.setZone("local");

const formatDay = (dt: DateTime) =>
    toLocal(dt).toLocaleString(DateTime.DATE_MED);

const formatInterval = ([start, end]: IntervalTuple): string => {
    if (!start && !end) return "Any time";

    if (start && end) {
        const s = toLocal(start);
        const e = toLocal(end);

        if (s.hasSame(e, "day")) {
            return formatDay(s);
        }

        if (s.year === e.year) {
            return `${s.toFormat("LLL d")} – ${e.toFormat("LLL d, yyyy")}`;
        }

        return `${formatDay(s)} – ${formatDay(e)}`;
    }

    if (start) {
        return `From ${formatDay(start)}`;
    }

    if (end) {
        return `Until ${formatDay(end)}`;
    }

    return "Any time";
};