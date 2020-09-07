import '../styles/globals.css';
import '@shopify/polaris/dist/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Frame, TopBar} from "@shopify/polaris";

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
            <Frame topBar={(
                <TopBar/>
            )}>
                <Component {...pageProps} />
            </Frame>
        </AppProvider>
    );
}