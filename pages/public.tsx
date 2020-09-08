import {useRouter} from "next/router";
import {
    Card,
    FooterHelp,
    Layout,
    Link,
    Page,
    SkeletonBodyText,
    SkeletonDisplayText,
    SkeletonPage,
    Stack, TextContainer, TextStyle
} from "@shopify/polaris";
import {useEffect, useState} from "react";
import {format} from "date-fns";
import PublicMovie from "../components/publicMovie";
import Head from "next/head";

export default function Public() {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [movieIDs, setMovieIDs] = useState<string[]>([]);
    const [date, setDate] = useState<Date>(null);
    const [name, setName] = useState<string>(null);
    const [author, setAuthor] = useState<string>(null);

    function getTitle(): string {
        if (name) return name;
        if (author) return `${author}'s nomination list`;
        else return "Nomination list";
    }

    function getDescription(): string {
        return `Nomination list ${name ? `"${name}" ` : ""}${author ? `by ${author}` : ""} for the first-ever Shoppies Movie Awards.`
        if (name) return name;
    }

    useEffect(() => {
        if (Object.keys(router.query).length > 0) {

            // movies and date params are mandatory, so if they aren't valid, display an error on the page
            if (!(Array.isArray(router.query.movies)
                && typeof router.query.date === "string")) {
                setIsError(true);
                setIsLoaded(true);
                return;
            }

            try {
                setMovieIDs(router.query.movies);
                const queryDate = new Date(router.query.date);
                setDate(queryDate);
            } catch (e) {
                console.log(e);
                setIsError(true);
                setIsLoaded(true);
                return;
            }

            // optional params
            setName(typeof router.query.name === "string" ? router.query.name : null);
            setAuthor(typeof router.query.author === "string" ? router.query.author : null);

            // loading complete
            setIsLoaded(true);
            setIsError(false);
        }
    }, [router.query]);

    return (isLoaded && !isError) ? (
        <Page
            title={getTitle()}
            subtitle={`Created on ${format(date, "MMMM d, yyyy")}` + (author ? ` by ${author}` : "")}
        >
            <Head>
                <title>{getTitle()} | The Shoppies</title>
                <meta name="description"
                      content={getDescription()}/>
            </Head>
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
                        List created using the Shoppies Nomination Portal. <Link url="/">Create your own nomination
                        list</Link>
                    </FooterHelp>
                </Layout.Section>
            </Layout>
        </Page>
    ) : isError ? (
        <Page
            title="Invalid link"
            subtitle="One or more of the link parameters are invalid"
            separator>
            <Layout>
                <Layout.Section>
                    <div className="polaris-padding">
                        <TextContainer>
                            <p><TextStyle variation="subdued">Please check that the link is correct and try again.</TextStyle></p>
                        </TextContainer>
                    </div>
                </Layout.Section>
            </Layout>
        </Page>
    ) :(
        <SkeletonPage primaryAction>
            <Layout>
                <Layout.Section oneThird>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small"/>
                            <SkeletonBodyText/>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section oneThird>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small"/>
                            <SkeletonBodyText/>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section oneThird>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small"/>
                            <SkeletonBodyText/>
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    )
}
