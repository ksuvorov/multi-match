import { format } from "date-fns";

import {Listing} from '@/lib/db/schemas/listing';

import {Card} from '../../../../../Card';

export function ListingCard({ listing }: { listing: Listing }) {
    return (
        <Card
            tags={
                <>
                    <span>{listing.status}</span>
                </>
            }
            title={listing.title}
            description={listing.description}
            footer={
                <>
                    <span>{format(new Date(listing.createdAt), "MMM d, yyyy")}</span>
                </>
            }
        />
    )
}