import {useRouter} from "next/router";
import {Card, FooterHelp, Layout, Link, Page, Stack} from "@shopify/polaris";
import {useEffect, useState} from "react";
import {format} from "date-fns";
import PublicMovie from "../components/publicMovie";

export default function Public() {
    const router = useRouter();
    const [movieIDs, setMovieIDs] = useState<string[]>([]);
    const [date, setDate] = useState<string>(null);
    const [name, setName] = useState<string>(null);
    const [author, setAuthor] = useState<string>(null);

    useEffect(() => {
        if (router.query) {
            if (Array.isArray(router.query.movies)) setMovieIDs(router.query.movies);
            setDate(typeof router.query.date === "string" ? router.query.date : null);
            setName(typeof router.query.name === "string" ? router.query.name : null);
            setAuthor(typeof router.query.author === "string" ? router.query.author : null);
        }
    }, [router.query]);

    return (
        <Page
            title={((): string => {
                if (name) return name;
                if (author) return `${author}'s nomination list`;
                else return "Nomination list";
            })()}
            subtitle={`Created on ${format(new Date(date), "MMMM d, yyyy")}` + (author ? ` by ${author}` : "")}
        >
            <Layout>
                <Layout.Section>
                    <div className="public-grid">
                        {movieIDs.map(movieID => (
                            <PublicMovie imdbID={movieID}/>
                        ))}
                    </div>
                </Layout.Section>
                <Layout.Section>
                    <FooterHelp>
                        List created using the Shoppies Nomination Portal. <Link url="/">Create your own nomination list</Link>
                    </FooterHelp>
                </Layout.Section>
            </Layout>
        </Page>
    )
}
