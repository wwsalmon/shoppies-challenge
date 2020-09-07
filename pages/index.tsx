import {Card, Icon, Layout, Page, ResourceItem, ResourceList, TextField, TextStyle} from "@shopify/polaris";
import {useState} from "react";
import {SearchMinor} from "@shopify/polaris-icons";

export default function Index(){
    const [searchQuery, setSearchQuery] = useState<string>("");

    function searchQueryChange(newSearchQuery: string): void {
        setSearchQuery(newSearchQuery);
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
                            prefix={<Icon source={SearchMinor} color="inkLighter" />}
                            placeholder="Search"
                        />
                        <ResourceList
                            resourceName={{singular: 'customer', plural: 'customers'}}
                            items={[
                                {
                                    id: 341,
                                    url: 'customers/341',
                                    name: 'Mae Jemison',
                                    location: 'Decatur, USA',
                                },
                                {
                                    id: 256,
                                    url: 'customers/256',
                                    name: 'Ellen Ochoa',
                                    location: 'Los Angeles, USA',
                                },
                            ]}
                            renderItem={(item) => {
                                const {id, url, name, location} = item;
                                const media = <div style={{width: 100, height: 150, backgroundColor: "red"}}/>;

                                return (
                                    <ResourceItem
                                        id={id.toString()}
                                        url={url}
                                        media={media}
                                        shortcutActions={[{content: "Nominate movie", url: "testing"}]}
                                        accessibilityLabel={`View details for ${name}`}
                                    >
                                        <h3>
                                            <TextStyle variation="strong">{name}</TextStyle>
                                        </h3>
                                        <div><span>{location}</span></div>
                                    </ResourceItem>
                                );
                            }}
                        />
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card title="Your nominations" sectioned>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )
}