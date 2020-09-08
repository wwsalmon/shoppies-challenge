import {Movie} from "../lib/types";
import {useEffect, useState} from "react";
import {TextStyle, Card} from "@shopify/polaris";

export default function PublicMovie({imdbID}: {imdbID: string}){
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [info, setInfo] = useState<Movie>(null);
    const [errorMessage, setErrorMessage] = useState<string>(null);

    useEffect(() => {
        fetch(`http://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&i=${imdbID}`)
            .then(res => res.json())
            .then(data => {
                // set search results to empty array if OMDb returns error, signaling no results
                // otherwise, set search results to returned search results
                setInfo(data.Error ? null : data);

                // if OMDb returns error, store it in state variable to display to user
                if (data.Error) setErrorMessage(data.Error);

                // data loaded, get rid of loading indicators
                setIsLoaded(true);
            })
            .catch(e => {
                // set search results to empty and store error in state variable as before
                setErrorMessage(e);
                setIsLoaded(true);
            });

    }, []);

    return (isLoaded && !errorMessage) ? (
        <div>
            <Card>
                <img src={info.Poster} style={{width: "100%"}}/>
                <Card.Section>
                    <h3>
                        <TextStyle variation="strong">{info.Title}</TextStyle>
                    </h3>
                    <div><span>{info.Year}</span></div>
                </Card.Section>
            </Card>
        </div>
    ) : (
        <h1>Loading...</h1>
    )
}