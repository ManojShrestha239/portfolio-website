import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
    useFieldConsole,
    type DitherMode,
    type QualityTier,
} from '@/context/FieldConsoleContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const KERNEL_OPTIONS: readonly { readonly value: DitherMode; readonly label: string }[] = [
    { value: 'bayer8', label: 'Bayer 8×8' },
    { value: 'diffusion', label: 'Diffusion' },
    { value: 'off', label: 'Continuous' },
];

export function FieldConsole() {
    const {
        settings,
        telemetry,
        updateSettings,
        resetSettings,
        randomizeSettings,
        exportPng,
    } = useFieldConsole();

    const [flash, setFlash] = useState<boolean>(false);
    const [exported, setExported] = useState<boolean>(false);

    const triggerFlash = (): void => {
        setFlash(true);
        window.setTimeout(() => setFlash(false), 320);
    };

    const handleReset = (): void => {
        resetSettings();
        triggerFlash();
    };

    const handleRandomize = (): void => {
        randomizeSettings();
        triggerFlash();
    };

    const handleExport = (): void => {
        if (!exportPng()) {
            return;
        }
        setExported(true);
        window.setTimeout(() => setExported(false), 1200);
    };

    const kernelLabel =
        settings.dither === 'bayer8'
            ? 'Bayer 8×8'
            : settings.dither === 'diffusion'
              ? 'FS diffusion'
              : 'Continuous';

    return (
        <section
            id="render-console"
            aria-label="Dithered field render console"
            className={cn(
                'relative border bg-surface p-5 transition-colors duration-300',
                flash ? 'border-accent' : 'border-hairline',
            )}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/75 via-accent/20 to-transparent"
            />

            <div className="flex items-center justify-between gap-4 border-b border-hairline pb-4">
                <div>
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.26em] text-ink">
                        Field console
                    </h2>
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                        Raymarch &rarr; threshold &rarr; grain
                    </p>
                </div>

                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-secondary">
                    <span
                        className={cn(
                            'h-1.5 w-1.5',
                            settings.motion ? 'bg-success' : 'bg-accent',
                        )}
                        aria-hidden="true"
                    />
                    <span>{settings.motion ? 'Animating' : 'Frozen'}</span>
                </span>
            </div>

            <div className="border-b border-hairline py-3.5">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                    Threshold kernel
                </span>
                <div
                    role="group"
                    aria-label="Dither kernel"
                    className="grid grid-cols-3 gap-px bg-hairline"
                >
                    {KERNEL_OPTIONS.map((option) => {
                        const active = settings.dither === option.value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                aria-pressed={active}
                                onClick={() => updateSettings({ dither: option.value })}
                                className={cn(
                                    'cursor-pointer px-2 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors',
                                    active
                                        ? 'bg-accent-subtle text-accent'
                                        : 'bg-canvas text-ink-muted hover:text-ink',
                                )}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="border-b border-hairline py-2.5">
                <div className="flex items-baseline justify-between">
                    <label
                        htmlFor="ctl-levels"
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted"
                    >
                        Quantisation bands
                    </label>
                    <output className="font-mono text-[11px] text-accent">
                        {settings.levels}
                    </output>
                </div>
                <input
                    id="ctl-levels"
                    type="range"
                    min={2}
                    max={8}
                    step={1}
                    value={settings.levels}
                    onChange={(e) => updateSettings({ levels: Number(e.target.value) })}
                    className="console-range mt-1"
                />
            </div>

            <div className="border-b border-hairline py-2.5">
                <div className="flex items-baseline justify-between">
                    <label
                        htmlFor="ctl-intensity"
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted"
                    >
                        Field intensity
                    </label>
                    <output className="font-mono text-[11px] text-accent">
                        {settings.intensity.toFixed(2)}
                    </output>
                </div>
                <input
                    id="ctl-intensity"
                    type="range"
                    min={0.35}
                    max={1.75}
                    step={0.01}
                    value={settings.intensity}
                    onChange={(e) => updateSettings({ intensity: Number(e.target.value) })}
                    className="console-range mt-1"
                />
            </div>

            <div className="border-b border-hairline py-2.5">
                <div className="flex items-baseline justify-between">
                    <label
                        htmlFor="ctl-grain"
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted"
                    >
                        Film grain
                    </label>
                    <output className="font-mono text-[11px] text-accent">
                        {settings.grain.toFixed(3)}
                    </output>
                </div>
                <input
                    id="ctl-grain"
                    type="range"
                    min={0}
                    max={0.16}
                    step={0.005}
                    value={settings.grain}
                    onChange={(e) => updateSettings({ grain: Number(e.target.value) })}
                    className="console-range mt-1"
                />
            </div>

            <div className="border-b border-hairline py-2.5">
                <div className="flex items-baseline justify-between">
                    <label
                        htmlFor="ctl-amber"
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted"
                    >
                        Amber accent
                    </label>
                    <output className="font-mono text-[11px] text-accent">
                        {settings.amber.toFixed(2)}
                    </output>
                </div>
                <input
                    id="ctl-amber"
                    type="range"
                    min={0}
                    max={0.5}
                    step={0.01}
                    value={settings.amber}
                    onChange={(e) => updateSettings({ amber: Number(e.target.value) })}
                    className="console-range mt-1"
                />
            </div>

            <div className="border-b border-hairline py-3">
                <label
                    htmlFor="ctl-quality"
                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted"
                >
                    Render budget
                </label>
                <div className="relative">
                    <select
                        id="ctl-quality"
                        value={settings.quality}
                        onChange={(e) =>
                            updateSettings({ quality: e.target.value as QualityTier })
                        }
                        className="w-full cursor-pointer appearance-none border border-hairline bg-canvas px-2.5 py-2 pr-8 font-mono text-[10px] uppercase tracking-[0.14em] text-ink focus:border-accent focus:outline-none"
                    >
                        <option value="low">Low · 0.38 MP · 40 steps</option>
                        <option value="balanced">Balanced · 0.85 MP · 62 steps</option>
                        <option value="high">High · 1.50 MP · 84 steps</option>
                    </select>
                    <ChevronDown
                        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted"
                        aria-hidden="true"
                    />
                </div>
            </div>

            <div className="py-2">
                <div className="flex items-center justify-between py-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                        Animation loop
                    </span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={settings.motion}
                        aria-label="Toggle field animation"
                        onClick={() => updateSettings({ motion: !settings.motion })}
                        className={cn(
                            'relative h-5 w-10 shrink-0 cursor-pointer border transition-colors',
                            settings.motion
                                ? 'border-accent bg-accent-subtle'
                                : 'border-hairline bg-canvas',
                        )}
                    >
                        <span
                            className={cn(
                                'absolute left-[3px] top-[3px] h-3 w-3 transition-transform duration-200',
                                settings.motion
                                    ? 'translate-x-5 bg-accent'
                                    : 'translate-x-0 bg-ink-muted',
                            )}
                        />
                    </button>
                </div>

                <div className="flex items-center justify-between py-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                        Pointer parallax
                    </span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={settings.parallax}
                        aria-label="Toggle pointer parallax"
                        onClick={() => updateSettings({ parallax: !settings.parallax })}
                        className={cn(
                            'relative h-5 w-10 shrink-0 cursor-pointer border transition-colors',
                            settings.parallax
                                ? 'border-accent bg-accent-subtle'
                                : 'border-hairline bg-canvas',
                        )}
                    >
                        <span
                            className={cn(
                                'absolute left-[3px] top-[3px] h-3 w-3 transition-transform duration-200',
                                settings.parallax
                                    ? 'translate-x-5 bg-accent'
                                    : 'translate-x-0 bg-ink-muted',
                            )}
                        />
                    </button>
                </div>
            </div>

            <div className="flex gap-2 border-t border-hairline pt-3.5">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={handleReset}
                >
                    Reset
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleRandomize}
                >
                    Randomize
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={!telemetry.supported}
                    onClick={handleExport}
                >
                    {exported ? 'Saved ✓' : 'Export PNG'}
                </Button>
            </div>

            <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-hairline pt-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                <span>
                    FPS
                    <b className="ml-1.5 font-normal text-ink-secondary">
                        {telemetry.supported && telemetry.running ? telemetry.fps : '—'}
                    </b>
                </span>
                <span>
                    Buffer
                    <b className="ml-1.5 font-normal text-ink-secondary">
                        {telemetry.width > 0 ? `${telemetry.width}×${telemetry.height}` : '—'}
                    </b>
                </span>
                <span>
                    Kernel
                    <b className="ml-1.5 font-normal text-ink-secondary">{kernelLabel}</b>
                </span>
            </div>
        </section>
    );
}
