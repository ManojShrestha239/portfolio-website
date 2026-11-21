import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectItem } from '@/types/portfolio';

interface HoverRevealRowProps {
    readonly project: ProjectItem;
    readonly index: number;
}

export function HoverRevealRow({ project, index }: HoverRevealRowProps) {
    const rowRef = useRef<HTMLDivElement | null>(null);
    const previewRef = useRef<HTMLDivElement | null>(null);
    const [hovered, setHovered] = useState<boolean>(false);
    const [canHoverFine, setCanHoverFine] = useState<boolean>(false);

    const targetPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const media = window.matchMedia('(hover: hover) and (pointer: fine)');
        const update = (): void => setCanHoverFine(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (!hovered || !canHoverFine) {
            return;
        }

        let rafId = 0;
        const animate = (): void => {
            const cur = currentPosRef.current;
            const tgt = targetPosRef.current;
            cur.x += (tgt.x - cur.x) * 0.18;
            cur.y += (tgt.y - cur.y) * 0.18;

            if (previewRef.current) {
                previewRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
            }
            rafId = window.requestAnimationFrame(animate);
        };

        rafId = window.requestAnimationFrame(animate);
        return () => window.cancelAnimationFrame(rafId);
    }, [hovered, canHoverFine]);

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>): void => {
        if (!canHoverFine || !rowRef.current) {
            return;
        }
        const rect = rowRef.current.getBoundingClientRect();
        targetPosRef.current = {
            x: Math.min(Math.max(event.clientX - rect.left + 24, 16), 760),
            y: event.clientY - rect.top - 90,
        };
    };

    const handleMouseEnter = (event: MouseEvent<HTMLDivElement>): void => {
        if (!canHoverFine || !rowRef.current) {
            return;
        }
        const rect = rowRef.current.getBoundingClientRect();
        const initial = {
            x: Math.min(Math.max(event.clientX - rect.left + 24, 16), 760),
            y: event.clientY - rect.top - 90,
        };
        targetPosRef.current = initial;
        currentPosRef.current = { ...initial };
        setHovered(true);
    };

    const marqueeText = project.techStack.join('  ·  ');

    return (
        <div
            ref={rowRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={handleMouseMove}
            className="group relative border-b border-hairline bg-canvas/80 transition-colors hover:bg-surface"
        >
            <Link
                href={`/work/${project.slug}`}
                className="block px-6 py-7 lg:px-10"
            >
                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                    <div className="md:col-span-1">
                        <span className="font-mono text-xs text-ink-muted">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>

                    <div className="md:col-span-5">
                        <h3 className="font-grotesk text-xl font-medium tracking-tight text-ink transition-colors group-hover:text-accent sm:text-2xl">
                            {project.title}
                        </h3>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
                            {project.category}
                        </p>
                    </div>

                    <div className="overflow-hidden md:col-span-5">
                        {hovered && canHoverFine ? (
                            <div className="overflow-hidden whitespace-nowrap font-mono text-xs uppercase tracking-[0.1em] text-accent">
                                <div className="animate-hover-marquee">
                                    <span className="pr-8">{marqueeText}  ·</span>
                                    <span className="pr-8">{marqueeText}  ·</span>
                                </div>
                            </div>
                        ) : (
                            <p className="line-clamp-2 text-sm text-ink-secondary">
                                {project.summary}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-2 md:col-span-1">
                        <ArrowUpRight
                            className="h-4 w-4 text-ink-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </Link>

            {canHoverFine && hovered && (
                <div
                    ref={previewRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 z-30 hidden w-72 overflow-hidden rounded-xs border border-hairline bg-surface shadow-2xl will-change-transform lg:block"
                >
                    {project.previewImagePath ? (
                        <img
                            src={`/storage/${project.previewImagePath}`}
                            alt=""
                            className="h-40 w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-40 flex-col justify-between bg-canvas p-4">
                            <div className="flex items-center justify-between border-b border-hairline pb-2">
                                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
                                    System Blueprint
                                </span>
                                <span className="font-mono text-[10px] text-ink-muted">
                                    /{project.slug.slice(0, 14)}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {project.metrics.slice(0, 2).map((metric) => (
                                    <div key={metric.label} className="border border-hairline bg-surface p-2.5">
                                        <p className="font-grotesk text-base font-semibold text-ink">
                                            {metric.value}
                                        </p>
                                        <p className="truncate font-mono text-[9px] uppercase text-ink-muted">
                                            {metric.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
