import {useRouter} from "next/router";
import {Page} from "@shopify/polaris";
import {useEffect, useState} from "react";
import {Movie} from "../lib/types";

export default function Share(){
    const router = useRouter();
    const [movieIDs, setMovieIDs] = useState<string[]>([]);

    useEffect(() => {
        if (router.query && Array.isArray(router.query.movies)) setMovieIDs(router.query.movies);
    }, []);
    
    return (
        <Page
            title="Share your list"
            breadcrumbs={[
                {content: "Nomination portal", url: "/"}
            ]}
        >

        </Page>
    )
}
