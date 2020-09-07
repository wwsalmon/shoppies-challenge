import {useEffect, useState} from "react";
import {
    Banner,
    Button,
    Card,
    Icon,
    Layout,
    Page,
    ResourceItem,
    ResourceList,
    TextField,
    TextStyle, Toast
} from "@shopify/polaris";
import {SearchMinor} from "@shopify/polaris-icons";
import {useRouter} from "next/router";
import {Movie} from "../lib/types";

export default function Index() {
    const router = useRouter();

    // search query string
    const [searchQuery, setSearchQuery] = useState<string>("");

    // search loading status. If true, loading indicators are shown and interactions disabled where appropriate
    const [searchLoading, setSearchLoading] = useState<boolean>(false);

    // search results array, updated whenever the query string is changed
    const [searchResults, setSearchResults] = useState<Movie[]>([]);

    // array of nominated movies. Load from localStorage if possible
    const [savedMovies, setSavedMovies] = useState<Movie[]>([]);

    // error message to display to user  where appropriate
    const [errorMessage, setErrorMessage] = useState<string>(null);

    // states to control toasts
    const [addedToast, setAddedToast] = useState<boolean>(false);
    const [removedToast, setRemovedToast] = useState<boolean>(false);

    const addedToastMarkup = addedToast ? (
        <Toast content="Movie added" onDismiss={() => setAddedToast(false)}/>
    ) : null;

    const removedToastMarkup = removedToast ? (
        <Toast content="Movie removed" onDismiss={() => setRemovedToast(false)}/>
    ) : null;

    // on component mount (or static hydration, at which point localStorage becomes available), load localStorage
    // saved movies into savedMovies state var if possible
    useEffect(() => {
        const localSavedMovies = JSON.parse(localStorage.getItem("savedMovies"));
        if (localSavedMovies) setSavedMovies(localSavedMovies);

        const localSearchQuery = localStorage.getItem("searchQuery");
        if (localSearchQuery) searchQueryChange(localSearchQuery);
    }, []);

    function searchQueryChange(newSearchQuery: string): void {
        // clear error message
        setErrorMessage(null);

        // update controlled search field component
        setSearchQuery(newSearchQuery);

        // store search query in localStorage
        localStorage.setItem("searchQuery", newSearchQuery);

        // set searchLoading to true to show loading indicator next to search field and over search results list
        setSearchLoading(true);

        fetch(`http://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=${newSearchQuery}`)
            .then(res => res.json())
            .then(data => {
                // set search results to empty array if OMDb returns error, signaling no results
                // otherwise, set search results to returned search results
                setSearchResults(data.Error ? [] : data.Search);

                // if OMDb returns error, store it in state variable to display to user
                if (data.Error) setErrorMessage(data.Error);

                // data loaded, get rid of loading indicators
                setSearchLoading(false);
            })
            .catch(e => {
                // set search results to empty and store error in state variable as before
                setSearchResults([]);
                setErrorMessage(e);
                setSearchLoading(false);
            });
    }

    // add nomination from entire Movie object. Store in React state var and localStorage
    function addNomination(movie: Movie): void {
        const newSavedMovies = [...savedMovies, movie];
        setSavedMovies(newSavedMovies);

        // show confirmation toast
        setAddedToast(true);
        localStorage.setItem("savedMovies", JSON.stringify(newSavedMovies));
    }

    // delete nomination from list by unique imdbID
    function deleteNomination(imdbID: string): void {
        const newSavedMovies = savedMovies.slice(0).filter(movie => movie.imdbID !== imdbID);
        setSavedMovies(newSavedMovies);

        // show confirmation toast
        setRemovedToast(true);
        localStorage.setItem("savedMovies", JSON.stringify(newSavedMovies));
    }

    // check if movie is on nominations list by unique imdbID
    function isNominated(imdbID: string): boolean {
        return savedMovies.findIndex(movie => movie.imdbID === imdbID) > -1;
    }

    return (
        <Page
            title="Nomination Portal"
            subtitle="Browse movies and select five movies to nominate for The Shoppies"
        >
            <Layout>
                {savedMovies.length === 5 && (
                    <Layout.Section>
                        <Banner
                            status="success"
                            title="Nomination list complete"
                            action={
                                {
                                    content: "Share your list",
                                    onAction() {
                                        router.push({
                                            pathname: "/share",
                                            query: {
                                                movies: savedMovies.map(movie => movie.imdbID),
                                            }
                                        });
                                    }
                                }
                            }
                        >
                            <p>You've added five movies and completed your list. Press the button below to share it!</p>
                        </Banner>
                    </Layout.Section>
                )}
                <Layout.Section>
                    <Card title="Search for movies to nominate">
                        <Card.Section>
                            {savedMovies.length < 5 && (
                                <div className="mb-2">
                                    <Banner
                                        status="info"
                                        title={`Nominate ${5 - savedMovies.length} more movie${savedMovies.length < 4 ? "s" : ""}`}
                                    >
                                        <p>Add five movies to your list to complete your nomination</p>
                                    </Banner>
                                </div>
                            )}
                            <TextField
                                label=""
                                value={searchQuery}
                                onChange={searchQueryChange}
                                prefix={<Icon source={SearchMinor} color="inkLighter"/>}
                                placeholder="Search"
                            />
                        </Card.Section>
                        <ResourceList
                            items={searchResults}
                            loading={searchLoading}
                            renderItem={(movie: Movie) => {
                                const {Poster, Title, Type, Year, imdbID} = movie;

                                // if there's no poster, display a solid color rectangle. otherwise, display the poster
                                const media = (
                                    <div className="flex" style={{
                                        width: 80,
                                        height: 116,
                                        backgroundColor: "#212B36",
                                        alignItems: "center"
                                    }}>
                                        {Poster === "N/A" ? (
                                            <div style={{textAlign: "center", padding: "0.5rem", color: "white"}}>
                                                <TextStyle variation="subdued">No poster found</TextStyle>
                                            </div>
                                        ) : <img style={{width: 80}} src={Poster}
                                                 alt={`Poster for movie ${Title} (${Year})`}/>}
                                    </div>
                                );

                                return (
                                    <ResourceItem
                                        id={imdbID}
                                        onClick={() => {
                                        }}
                                        media={media}
                                    >
                                        <div style={{
                                            minHeight: 116
                                        }}>
                                            <h3>
                                                <TextStyle variation="strong">{Title}</TextStyle>
                                            </h3>
                                            <div><span>{Year}</span></div>
                                            <div style={{marginTop: "1rem"}}>
                                                {isNominated(imdbID) ? (
                                                    <>
                                                        <p>
                                                            <TextStyle variation="subdued">
                                                                This movie is in your nominations.
                                                            </TextStyle>
                                                        </p>
                                                        <Button
                                                            plain
                                                            destructive
                                                            onClick={() => deleteNomination(imdbID)}
                                                        >Remove from nominations</Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        size="slim"
                                                        onClick={() => addNomination({
                                                            Poster: Poster,
                                                            Title: Title,
                                                            Type: Type,
                                                            Year: Year,
                                                            imdbID: imdbID
                                                        })}
                                                        disabled={savedMovies.length >= 5}
                                                    >Add to nominations</Button>
                                                )}
                                            </div>
                                        </div>
                                    </ResourceItem>
                                );
                            }}
                        />
                        {addedToastMarkup}
                        {removedToastMarkup}
                        {searchQuery ? (errorMessage && (
                            <Card.Section>
                                <p><TextStyle variation="subdued">Error: {errorMessage}</TextStyle></p>
                            </Card.Section>
                        )) : (
                            <Card.Section>
                                <p><TextStyle variation="subdued">Enter a title in the search bar above to search for movies.</TextStyle></p>
                            </Card.Section>
                        )}
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card title={`My nominations (${savedMovies.length})`}>
                        {savedMovies.length > 0 ? (
                            <div className="mt-1">
                                <ResourceList
                                    items={savedMovies}
                                    loading={searchLoading}
                                    renderItem={(movie: Movie) => {
                                        const {Poster, Title, Type, Year, imdbID} = movie;

                                        // if there's no poster, display a solid color rectangle. otherwise, display the poster
                                        const media = (
                                            <div className="flex" style={{
                                                width: 60,
                                                height: 87,
                                                backgroundColor: "#212B36",
                                                alignItems: "center"
                                            }}>
                                                {Poster === "N/A" ? (
                                                    <div style={{textAlign: "center", padding: "0.5rem", color: "white"}}>
                                                        <TextStyle variation="subdued">No poster found</TextStyle>
                                                    </div>
                                                ) : <img style={{width: 60}} src={Poster}
                                                         alt={`Poster for movie ${Title} (${Year})`}/>}
                                            </div>
                                        );

                                        return (
                                            <ResourceItem
                                                id={imdbID}
                                                onClick={() => {
                                                }}
                                                media={media}
                                            >
                                                <h3>
                                                    <TextStyle variation="strong">{Title}</TextStyle>
                                                </h3>
                                                <div><span>{Year}</span></div>
                                                <div style={{marginTop: "1rem"}}>
                                                    <Button
                                                        plain
                                                        destructive
                                                        onClick={() => deleteNomination(imdbID)}
                                                    >Remove from nominations</Button>
                                                </div>
                                            </ResourceItem>
                                        )
                                    }}
                                />
                            </div>
                        ) : (
                            <Card.Section>
                                <p><TextStyle variation="subdued">You haven't nominated any movies yet.</TextStyle></p>
                            </Card.Section>
                        )}
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )
}
