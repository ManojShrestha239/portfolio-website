import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher?: typeof Pusher;
    }
}

let echoInstance: Echo<'reverb'> | null = null;

export function getEcho(): Echo<'reverb'> | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const appKey = import.meta.env.VITE_REVERB_APP_KEY;
    if (!appKey) {
        return null;
    }

    if (echoInstance) {
        return echoInstance;
    }

    window.Pusher = Pusher;

    const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http';
    const host = import.meta.env.VITE_REVERB_HOST || window.location.hostname;
    const port = Number(import.meta.env.VITE_REVERB_PORT || (scheme === 'https' ? 443 : 8080));

    echoInstance = new Echo({
        broadcaster: 'reverb',
        key: appKey,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: scheme === 'https',
        enabledTransports: ['ws', 'wss'],
    });

    return echoInstance;
}
