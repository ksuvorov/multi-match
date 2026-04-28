import {DashboardMatch} from '@/lib/db/queries/match';

import {Card} from '../../../../../Card';

export function MatchCard({ match }: { match: DashboardMatch }) {
    const { counterpart } = match
    return (
        <Card
            title={counterpart.title}
            description={counterpart.description}
        />
    )
}