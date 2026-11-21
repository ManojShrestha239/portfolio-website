import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowUp,
    Cloud,
    CloudFog,
    CloudLightning,
    CloudRain,
    Moon,
    Sun,
} from 'lucide-react';
import { MagneticButton } from '@/motion/MagneticButton';
import { useSmoothScroll } from '@/motion/SmoothScrollProvider';
import { Button } from '@/components/ui/button';

const COLOPHON_STACK: readonly string[] = [
    'Laravel 13',
    'PHP 8.4',
    'Inertia.js',
    'React 19',
    'TypeScript',
    'Tailwind CSS v4',
    'MySQL 8.0',
    'Redis + Horizon',
    'Three.js / GLSL',
    'Docker',
];

type WeatherIconKey = 'sun' | 'moon' | 'cloud' | 'fog' | 'rain' | 'storm';

interface LocalWeatherState {
    readonly available: boolean;
    readonly location: string;
    readonly temperatureC: number | null;
    readonly condition: string;
    readonly icon: WeatherIconKey;
}

function formatNepalTime(): string {
    return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kathmandu',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(new Date());
}

function WeatherGlyph({ icon }: { readonly icon: WeatherIconKey }) {
    const className = 'h-3.5 w-3.5 text-accent shrink-0';
    switch (icon) {
        case 'sun':
            return <Sun className={className} aria-hidden="true" />;
        case 'moon':
            return <Moon className={className} aria-hidden="true" />;
        case 'fog':
            return <CloudFog className={className} aria-hidden="true" />;
        case 'rain':
            return <CloudRain className={className} aria-hidden="true" />;
        case 'storm':
            return <CloudLightning className={className} aria-hidden="true" />;
        default:
            return <Cloud className={className} aria-hidden="true" />;
    }
}

export function EditorialFooter() {
    const { scrollTo } = useSmoothScroll();
    const [clock, setClock] = useState<string>('—:—:—');
    const [weather, setWeather] = useState<LocalWeatherState | null>(null);

    useEffect(() => {
        setClock(formatNepalTime());
        const intervalId = window.setInterval(() => {
            setClock(formatNepalTime());
        }, 1000);
        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        fetch('/telemetry/weather', {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((envelope: { readonly ok?: boolean; readonly data?: LocalWeatherState } | null) => {
                const payload = envelope?.data;
                if (payload && typeof payload.available === 'boolean') {
                    setWeather(payload);
                }
            })
            .catch(() => {
                // Silent fallback if weather telemetry is unreachable
            });

        return () => controller.abort();
    }, []);

    const scrollToTop = (): void => {
        scrollTo(0);
    };

    return (
        <footer
            id="colophon"
            className="relative z-20 border-t border-hairline bg-canvas px-6 py-16 transition-colors duration-500 lg:px-10"
        >
            <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                    <div className="display-monumental text-[clamp(1.9rem,4vw,3.1rem)] text-ink">
                        Manoj
                        <br />
                        Shrestha
                    </div>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.24em] text-ink-muted">
                        Senior Full-Stack Software Engineer
                    </p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                        Enterprise SaaS &amp; Industrial Automation Architect
                    </p>
                </div>

                <div className="lg:col-span-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-ink-muted">
                        Colophon
                    </span>
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {COLOPHON_STACK.map((item) => (
                            <li
                                key={item}
                                className="border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-secondary"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-ink-muted">
                        WebGL · Raymarched SDF · Bayer 8×8
                        <br />
                        Dynamic Laravel 13 + Redis/Horizon CMS
                    </p>
                </div>

                <div className="flex flex-col items-start justify-between gap-6 lg:col-span-3 lg:items-end lg:text-right">
                    <div className="space-y-4">
                        <div>
                            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-ink-muted">
                                Nepal · local time
                            </span>
                            <div className="mt-2 font-mono text-2xl tabular-nums text-ink">
                                {clock}
                            </div>
                        </div>

                        <div className="border-t border-hairline pt-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                                {weather?.location ?? 'Bharatpur, NP'} · weather
                            </span>
                            <div className="mt-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink lg:justify-end">
                                <WeatherGlyph icon={weather?.icon ?? 'cloud'} />
                                <span className="tabular-nums">
                                    {weather?.available && weather.temperatureC !== null
                                        ? `${weather.temperatureC}°C`
                                        : '—°C'}
                                </span>
                                <span className="text-ink-muted">·</span>
                                <span className="text-ink-secondary">
                                    {weather?.available ? weather.condition : 'Syncing'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <MagneticButton>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={scrollToTop}
                        >
                            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Back to top</span>
                        </Button>
                    </MagneticButton>
                </div>
            </div>

            <div className="mx-auto mt-12 flex max-w-[1680px] flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                <span>
                    &copy; {new Date().getFullYear()} Manoj Shrestha — engineering record
                </span>
                <div className="flex flex-wrap items-center gap-6">
                    <Link href="/writing" className="transition-colors hover:text-ink">
                        Writing
                    </Link>
                    <Link href="/resume" className="transition-colors hover:text-ink">
                        Resume
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-ink">
                        Contact
                    </Link>
                    <span className="hidden sm:inline">
                        Set in Archivo Black, Plus Jakarta Sans &amp; JetBrains Mono
                    </span>
                </div>
            </div>
        </footer>
    );
}
