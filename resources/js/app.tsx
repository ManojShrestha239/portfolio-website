import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import type { ComponentType, ReactNode } from 'react';

type InertiaPageModule = {
    default: ComponentType<Record<string, unknown>> & {
        layout?: (page: ReactNode) => ReactNode;
    };
};

const pages = import.meta.glob<InertiaPageModule>('./pages/**/*.tsx', {
    eager: true,
});

const appName = import.meta.env.VITE_APP_NAME || 'Manoj Shrestha';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: (name) => {
        const page = pages[`./pages/${name}.tsx`];
        if (!page) {
            throw new Error(`Inertia page not found: ./pages/${name}.tsx`);
        }
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#D97706',
        showSpinner: false,
    },
});
