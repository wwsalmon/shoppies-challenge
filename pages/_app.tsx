import '../styles/globals.css';
import '@shopify/polaris/dist/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Frame, Stack, Link} from "@shopify/polaris";

export default function MyApp({Component, pageProps}) {
    const theme = {
        colors: {
            topBar: {
                background: '#fff'
            },
        },
        logo: {
            width: 124,
            topBarSource:
                '/logo-text.svg',
            url: '/',
            accessibilityLabel: 'The Shoppies',
        },
    };

    return (
        <AppProvider
            theme={theme}
            i18n={enTranslations}
        >
            <Frame>
                <div className="custom-navbar-outer">
                    <div className="Polaris-Page">
                        <div className="custom-navbar">
                            <img src="/logo-text.png"/>
                            <Stack>
                                <p className="hidden block-sm">Made by Samson Zhang</p>
                                <Link external={true} url="https://github.com/wwsalmon/shoppies-challenge">View on GitHub</Link>
                            </Stack>
                        </div>
                    </div>
                </div>
                <Component {...pageProps} />
            </Frame>
        </AppProvider>
    );
}