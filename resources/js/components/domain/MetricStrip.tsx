import type { TelemetryMetric } from '@/types/portfolio';

interface MetricStripProps {
    readonly metrics: readonly TelemetryMetric[];
}

export function MetricStrip({ metrics }: MetricStripProps) {
    return (
        <div
            id="telemetry"
            className="grid grid-cols-2 border-b border-hairline lg:grid-cols-4"
        >
            {metrics.map((metric, idx) => (
                <div
                    key={metric.label}
                    className={`flex flex-col justify-between gap-4 py-8 pr-6 ${
                        idx > 0 ? 'lg:border-l lg:border-hairline lg:pl-6' : ''
                    } ${idx % 2 === 1 ? 'border-l border-hairline pl-6 lg:border-l' : ''}`}
                >
                    <span className="telemetry-label text-ink-muted">
                        {String(idx + 1).padStart(2, '0')} · {metric.label}
                    </span>
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="font-grotesk text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                            {metric.value}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-accent">
                            {metric.unit}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
