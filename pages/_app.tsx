import '../styles/globals.css';
import '@shopify/polaris/dist/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider} from "@shopify/polaris";

export default function MyApp({Component, pageProps}) {
    return (
        <AppProvider i18n={enTranslations}>
            <Component {...pageProps} />
        </AppProvider>
    );
}