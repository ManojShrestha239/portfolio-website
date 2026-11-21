import { useEffect, useId, useMemo, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { getKathmanduTime, getTodayAd, getTodayBs } from '@/lib/bikramSambat';
import { cn } from '@/lib/utils';

export type CalendarSystem = 'bs' | 'ad';

const STORAGE_KEY = 'ms.calendar.system.v1';
const SYNC_EVENT = 'ms-calendar-system-change';

function loadCalendarSystem(): CalendarSystem {
    if (typeof window === 'undefined') {
        return 'bs';
    }
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved === 'ad' ? 'ad' : 'bs';
    } catch {
        return 'bs';
    }
}

interface DateCalendarSwitcherProps {
    readonly variant?: 'compact' | 'panel';
    readonly showTime?: boolean;
    readonly className?: string;
}

export function DateCalendarSwitcher({
    variant = 'compact',
    showTime,
    className,
}: DateCalendarSwitcherProps) {
    const groupId = useId();
    const [system, setSystem] = useState<CalendarSystem>(loadCalendarSystem);
    const [now, setNow] = useState<Date>(() => new Date());

    const shouldShowTime = showTime ?? variant === 'compact';

    useEffect(() => {
        const timerId = window.setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => window.clearInterval(timerId);
    }, []);

    const today = useMemo(
        () => ({
            bs: getTodayBs(now),
            ad: getTodayAd(now),
            time: getKathmanduTime(now),
        }),
        [now],
    );

    useEffect(() => {
        const handleSync = (event: Event): void => {
            const custom = event as CustomEvent<CalendarSystem>;
            if (custom.detail === 'bs' || custom.detail === 'ad') {
                setSystem(custom.detail);
            }
        };

        window.addEventListener(SYNC_EVENT, handleSync);
        return () => window.removeEventListener(SYNC_EVENT, handleSync);
    }, []);

    const selectSystem = (next: CalendarSystem): void => {
        setSystem(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Ignore storage errors
        }
        window.dispatchEvent(new CustomEvent<CalendarSystem>(SYNC_EVENT, { detail: next }));
    };

    const radioControls = (
        <div
            role="radiogroup"
            aria-label="Calendar system"
            className="inline-flex items-center gap-2.5"
        >
            <label className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-secondary">
                <input
                    type="radio"
                    name={`calendar-${groupId}`}
                    value="bs"
                    checked={system === 'bs'}
                    onChange={() => selectSystem('bs')}
                    className="h-3 w-3 cursor-pointer accent-accent"
                />
                <span className={system === 'bs' ? 'text-accent' : 'text-ink-muted'}>
                    BS
                </span>
            </label>

            <label className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-secondary">
                <input
                    type="radio"
                    name={`calendar-${groupId}`}
                    value="ad"
                    checked={system === 'ad'}
                    onChange={() => selectSystem('ad')}
                    className="h-3 w-3 cursor-pointer accent-accent"
                />
                <span className={system === 'ad' ? 'text-accent' : 'text-ink-muted'}>
                    AD
                </span>
            </label>
        </div>
    );

    if (variant === 'panel') {
        return (
            <div className={cn('border-t border-hairline pt-3', className)}>
                <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                        Today · {system === 'bs' ? 'Bikram Sambat' : 'Gregorian'}
                    </span>
                    {radioControls}
                </div>
                <div className="mt-1.5 flex items-center gap-2 font-mono text-xs text-ink lg:justify-end">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                    <span>
                        {system === 'bs' ? today.bs.formattedNp : today.ad.formatted}
                    </span>
                </div>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted lg:text-right">
                    {system === 'bs' ? today.bs.formattedEn : today.ad.iso}
                </p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'inline-flex flex-wrap items-center gap-3 border border-hairline bg-surface px-3 py-1.5',
                className,
            )}
        >
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-ink">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                <span>
                    {system === 'bs' ? today.bs.formattedNp : today.ad.formatted}
                </span>
            </span>

            {shouldShowTime && (
                <>
                    <span className="h-3 w-px bg-hairline" aria-hidden="true" />
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tabular-nums text-ink-secondary">
                        <Clock className="h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
                        <span>{system === 'bs' ? today.time.np : today.time.en}</span>
                    </span>
                </>
            )}

            <span className="h-3 w-px bg-hairline" aria-hidden="true" />
            {radioControls}
        </div>
    );
}
