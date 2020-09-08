import {Movie} from "../lib/types";
import {useEffect, useState} from "react";
import {Button, FormLayout, Heading, Modal, Stack, TextField, TextStyle, Toast} from "@shopify/polaris";
import {stringify} from "querystring";
import copy from "copy-to-clipboard";

export default function ShareModal({savedMovies, open, setOpen}: { savedMovies: Movie[], open: boolean, setOpen: (boolean) => void }) {
    // shareable url to update and copy
    const [url, setUrl] = useState<string>("");

    // toast for url copy confirmation
    const [copyToast, setCopyToast] = useState<boolean>(false);

    // state variables for controlled text fields
    const [name, setName] = useState<string>("");
    const [author, setAuthor] = useState<string>("");

    function onNameChange(newValue: string) {
        setName(newValue);
        localStorage.setItem("shareName", newValue);
    }

    function onAuthorChange(newValue: string) {
        setAuthor(newValue);
        localStorage.setItem("shareAuthor", newValue);
    }

    // function to copy url into clipboard
    function copyUrl() {
        copy(url);
        setCopyToast(true);
    }

    const copyToastMarkup = copyToast ? (
        <Toast content="URL copied!" onDismiss={() => setCopyToast(false)}/>
    ) : null;

    // useEffect function to load localStorage info on component mount
    useEffect(() => {
        const localName = localStorage.getItem("shareName");
        if (localName) setName(localName);

        const localAuthor = localStorage.getItem("shareAuthor");
        if (localAuthor) setAuthor(localAuthor);
    }, []);

    // useEffect function to update url whenever relevant variables are changed
    useEffect(() => {
        const currDate = (new Date()).toISOString();
        let paramsObj = {
            movies: savedMovies.map(movie => movie.imdbID),
            date: currDate,
        };
        if (name) paramsObj["name"] = name;
        if (author) paramsObj["author"] = author;
        const paramsString = stringify(paramsObj);
        const newUrl = "http://localhost:3000/public?" + paramsString;
        setUrl(newUrl);
    }, [savedMovies, name, author]);

    return (
        <Modal title="Share list" open={open} onClose={() => setOpen(false)}>
            <Modal.Section>
                <FormLayout>
                    <Heading>Share link</Heading>
                    <TextField
                        label=""
                        value={url}
                        onChange={() => {}}
                        connectedRight={(
                            <>
                                <Button primary onClick={copyUrl}>Copy URL</Button>
                                <Button url={url} external={true}>Open link</Button>
                            </>
                        )}
                    />
                </FormLayout>
            </Modal.Section>
            <Modal.Section>
                <FormLayout>
                    <Heading>Give your list a name (optional)</Heading>
                    <p><TextStyle variation="subdued">The link above will update with any new details you enter.</TextStyle></p>
                    <Stack distribution="fillEvenly">
                        <TextField label="List name" value={name} onChange={onNameChange}/>
                        <TextField label="Author name" value={author} onChange={onAuthorChange}/>
                    </Stack>
                </FormLayout>
            </Modal.Section>
            {copyToastMarkup}
        </Modal>
    )
}