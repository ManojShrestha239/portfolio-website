import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type PropsWithChildren,
} from 'react';

export type DitherMode = 'bayer8' | 'diffusion' | 'off';
export type QualityTier = 'low' | 'balanced' | 'high';

export interface FieldConsoleSettings {
    readonly dither: DitherMode;
    readonly levels: number;
    readonly intensity: number;
    readonly grain: number;
    readonly amber: number;
    readonly quality: QualityTier;
    readonly motion: boolean;
    readonly parallax: boolean;
}

export interface FieldTelemetry {
    readonly supported: boolean;
    readonly running: boolean;
    readonly fps: number;
    readonly width: number;
    readonly height: number;
}

export const FIELD_DEFAULTS: FieldConsoleSettings = {
    dither: 'bayer8',
    levels: 5,
    intensity: 1.0,
    grain: 0.06,
    amber: 0.16,
    quality: 'balanced',
    motion: true,
    parallax: true,
};

export const QUALITY_BUDGETS: Record<QualityTier, { readonly pixels: number; readonly steps: number }> = {
    low: { pixels: 380000, steps: 40 },
    balanced: { pixels: 850000, steps: 62 },
    high: { pixels: 1500000, steps: 84 },
};

const STORAGE_KEY = 'ms.field.console.v1';

function clamp(v: number, min: number, max: number): number {
    return Math.min(Math.max(v, min), max);
}

function roundTo(v: number, digits: number): number {
    const f = 10 ** digits;
    return Math.round(v * f) / f;
}

function sanitizeSettings(raw: Partial<FieldConsoleSettings>): FieldConsoleSettings {
    const dither: DitherMode =
        raw.dither === 'off' || raw.dither === 'bayer8' || raw.dither === 'diffusion'
            ? raw.dither
            : FIELD_DEFAULTS.dither;

    const quality: QualityTier =
        raw.quality === 'low' || raw.quality === 'balanced' || raw.quality === 'high'
            ? raw.quality
            : FIELD_DEFAULTS.quality;

    return {
        dither,
        quality,
        levels: Math.round(clamp(Number(raw.levels ?? FIELD_DEFAULTS.levels), 2, 8)),
        intensity: roundTo(clamp(Number(raw.intensity ?? FIELD_DEFAULTS.intensity), 0.35, 1.75), 2),
        grain: roundTo(clamp(Number(raw.grain ?? FIELD_DEFAULTS.grain), 0, 0.16), 3),
        amber: roundTo(clamp(Number(raw.amber ?? FIELD_DEFAULTS.amber), 0, 0.5), 2),
        motion: Boolean(raw.motion ?? FIELD_DEFAULTS.motion),
        parallax: Boolean(raw.parallax ?? FIELD_DEFAULTS.parallax),
    };
}

function loadInitialSettings(): FieldConsoleSettings {
    if (typeof window === 'undefined') {
        return FIELD_DEFAULTS;
    }
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return FIELD_DEFAULTS;
        }
        return sanitizeSettings(JSON.parse(stored) as Partial<FieldConsoleSettings>);
    } catch {
        return FIELD_DEFAULTS;
    }
}

interface FieldConsoleContextValue {
    readonly settings: FieldConsoleSettings;
    readonly telemetry: FieldTelemetry;
    readonly updateSettings: (patch: Partial<FieldConsoleSettings>) => void;
    readonly resetSettings: () => void;
    readonly randomizeSettings: () => void;
    readonly updateTelemetry: (next: FieldTelemetry) => void;
    readonly registerExporter: (fn: ((filename: string) => void) | null) => void;
    readonly exportPng: () => boolean;
}

const FieldConsoleContext = createContext<FieldConsoleContextValue | null>(null);

export function FieldConsoleProvider({ children }: PropsWithChildren) {
    const [settings, setSettings] = useState<FieldConsoleSettings>(loadInitialSettings);
    const [telemetry, setTelemetry] = useState<FieldTelemetry>({
        supported: true,
        running: false,
        fps: 0,
        width: 0,
        height: 0,
    });
    const exporterRef = useRef<((filename: string) => void) | null>(null);

    const persist = useCallback((next: FieldConsoleSettings): void => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // Ignore storage quota errors
        }
    }, []);

    const updateSettings = useCallback(
        (patch: Partial<FieldConsoleSettings>): void => {
            setSettings((prev) => {
                const next = sanitizeSettings({ ...prev, ...patch });
                persist(next);
                return next;
            });
        },
        [persist],
    );

    const resetSettings = useCallback((): void => {
        setSettings(FIELD_DEFAULTS);
        persist(FIELD_DEFAULTS);
    }, [persist]);

    const randomizeSettings = useCallback((): void => {
        updateSettings({
            dither: Math.random() < 0.3 ? 'diffusion' : 'bayer8',
            levels: 3 + Math.floor(Math.random() * 4),
            intensity: roundTo(0.7 + Math.random() * 0.8, 2),
            grain: roundTo(0.02 + Math.random() * 0.1, 3),
            amber: roundTo(Math.random() * 0.34, 2),
        });
    }, [updateSettings]);

    const updateTelemetry = useCallback((next: FieldTelemetry): void => {
        setTelemetry(next);
    }, []);

    const registerExporter = useCallback((fn: ((filename: string) => void) | null): void => {
        exporterRef.current = fn;
    }, []);

    const exportPng = useCallback((): boolean => {
        if (!exporterRef.current) {
            return false;
        }
        exporterRef.current(
            `manoj-shrestha-field_${settings.dither}_${settings.levels}bands.png`,
        );
        return true;
    }, [settings.dither, settings.levels]);

    const value = useMemo<FieldConsoleContextValue>(
        () => ({
            settings,
            telemetry,
            updateSettings,
            resetSettings,
            randomizeSettings,
            updateTelemetry,
            registerExporter,
            exportPng,
        }),
        [
            settings,
            telemetry,
            updateSettings,
            resetSettings,
            randomizeSettings,
            updateTelemetry,
            registerExporter,
            exportPng,
        ],
    );

    return (
        <FieldConsoleContext.Provider value={value}>
            {children}
        </FieldConsoleContext.Provider>
    );
}

export function useFieldConsole(): FieldConsoleContextValue {
    const context = useContext(FieldConsoleContext);
    if (!context) {
        throw new Error('useFieldConsole must be used inside FieldConsoleProvider.');
    }
    return context;
}
