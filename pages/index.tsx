import {useEffect, useState} from "react";
import {Button, Card, Icon, Layout, Page, ResourceItem, ResourceList, TextField, TextStyle} from "@shopify/polaris";
import {SearchMinor} from "@shopify/polaris-icons";

interface Movie {
    Poster: string,
    Title: string,
    Type: string,
    Year: string,
    imdbID: string
}

export default function Index() {
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

    // on component mount (or static hydration, at which point localStorage becomes available), load localStorage
    // saved movies into savedMovies state var if possible
    useEffect(() => {
        const localSavedMovies = JSON.parse(localStorage.getItem("savedMovies"));
        if (localSavedMovies) setSavedMovies(localSavedMovies);
    }, []);

    function searchQueryChange(newSearchQuery: string): void {
        // clear error message
        setErrorMessage(null);

        // update controlled search field component
        setSearchQuery(newSearchQuery);

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
        localStorage.setItem("savedMovies", JSON.stringify(newSavedMovies));
    }

    // delete nomination from list by unique imdbID
    function deleteNomination(imdbID: string): void {
        const newSavedMovies = savedMovies.slice(0).filter(movie => movie.imdbID !== imdbID);
        setSavedMovies(newSavedMovies);
        localStorage.setItem("savedMovies", JSON.stringify(newSavedMovies));
    }

    // check if movie is on nominations list by unique imdbID
    function isNominated(imdbID: string): boolean {
        return savedMovies.findIndex(movie => movie.imdbID === imdbID) > -1;
    }

    return (
        <Page
            title="Shoppies Nominations Portal"
            breadcrumbs={[{"content": "The Shoppies", "url": "/"}]}
        >
            <Layout>
                <Layout.Section>
                    <Card title="Search for movies to nominate" sectioned>
                        <TextField
                            label=""
                            value={searchQuery}
                            onChange={searchQueryChange}
                            prefix={<Icon source={SearchMinor} color="inkLighter"/>}
                            placeholder="Search"
                        />
                        {/*<div style={{marginTop: "1rem"}}>*/}
                        {/*    <ResourceList*/}
                        {/*        items={searchResults}*/}
                        {/*        loading={searchLoading}*/}
                        {/*        renderItem={(movie: Movie) => {*/}
                        {/*            const {Poster, Title, Type, Year, imdbID} = movie;*/}

                        {/*            // if there's no poster, display a solid color rectangle. otherwise, display the poster*/}
                        {/*            const media = Poster === "N/A" ?*/}
                        {/*                <div style={{width: 80, height: 120, backgroundColor: "rgba(0,0,0,0.1)"}}/> :*/}
                        {/*                <img style={{width: 80}} src={Poster}/>;*/}

                        {/*            return (*/}
                        {/*                <ResourceItem*/}
                        {/*                    id={imdbID}*/}
                        {/*                    onClick={() => {*/}
                        {/*                    }}*/}
                        {/*                    media={media}*/}
                        {/*                >*/}
                        {/*                    <h3>*/}
                        {/*                        <TextStyle variation="strong">{Title}</TextStyle>*/}
                        {/*                    </h3>*/}
                        {/*                    <div><span>{Year}</span></div>*/}
                        {/*                    <div style={{marginTop: "1rem"}}>*/}
                        {/*                        {isNominated(imdbID) ? (*/}
                        {/*                            <Button*/}
                        {/*                                size="slim"*/}
                        {/*                                onClick={() => deleteNomination(imdbID)}*/}
                        {/*                            >Remove from nominations</Button>*/}
                        {/*                        ) : (*/}
                        {/*                            <Button*/}
                        {/*                                size="slim"*/}
                        {/*                                onClick={() => addNomination({*/}
                        {/*                                    Poster: Poster,*/}
                        {/*                                    Title: Title,*/}
                        {/*                                    Type: Type,*/}
                        {/*                                    Year: Year,*/}
                        {/*                                    imdbID: imdbID*/}
                        {/*                                })}*/}
                        {/*                            >Nominate</Button>*/}
                        {/*                        )}*/}
                        {/*                    </div>*/}
                        {/*                </ResourceItem>*/}
                        {/*            );*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*    {searchQuery && errorMessage && <p>{errorMessage}</p>}*/}
                        {/*</div>*/}
                    </Card>
                    {searchResults.map(movie => {
                        const {Poster, Title, Type, Year, imdbID} = movie;

                        // if there's no poster, display a solid color rectangle. otherwise, display the poster
                        const media = Poster === "N/A" ?
                            <div style={{width: 80, height: 120, backgroundColor: "rgba(0,0,0,0.1)"}}/> :
                            <img style={{width: 80}} src={Poster}/>;

                        return (
                            <Card>
                                <Card.Section>
                                    {media}
                                    <h3>
                                        <TextStyle variation="strong">{Title}</TextStyle>
                                    </h3>
                                    <div><span>{Year}</span></div>
                                    <div style={{marginTop: "1rem"}}>
                                        {isNominated(imdbID) ? (
                                            <Button
                                                size="slim"
                                                onClick={() => deleteNomination(imdbID)}
                                            >Remove from nominations</Button>
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
                                            >Nominate</Button>
                                        )}
                                    </div>

                                </Card.Section>
                            </Card>);
                    })}
                    {searchQuery && errorMessage && <p>{errorMessage}</p>}
                </Layout.Section>
                <Layout.Section secondary>
                    <Card title="My nominations" sectioned>
                        <div style={{marginTop: "1rem"}}>
                            <ResourceList
                                items={savedMovies}
                                loading={searchLoading}
                                renderItem={(movie: Movie) => {
                                    const {Poster, Title, Type, Year, imdbID} = movie;

                                    // if there's no poster, display a solid color rectangle. otherwise, display the poster
                                    const media = Poster === "N/A" ?
                                        <div style={{width: 80, height: 120, backgroundColor: "rgba(0,0,0,0.1)"}}/> :
                                        <img style={{width: 80}} src={Poster}/>;

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
                                                    size="slim"
                                                    onClick={() => deleteNomination(imdbID)}
                                                >Remove</Button>
                                            </div>
                                        </ResourceItem>
                                    )
                                }}
                            />
                        </div>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )
}