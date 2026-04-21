import { Head } from "@inertiajs/react";

interface SchemaOrgProps {
    schema: Record<string, any>;
}

export default function SchemaOrg({ schema }: SchemaOrgProps) {
    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </Head>
    );
}
