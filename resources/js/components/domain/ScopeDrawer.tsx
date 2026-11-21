import { useEffect, useState, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Send, X } from 'lucide-react';
import {
    SCOPE_TAG_OPTIONS,
    useScopeDrawer,
    type ScopeTagOption,
} from '@/context/ScopeDrawerContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ScopeDrawer() {
    const { isOpen, preselectedTag, closeDrawer } = useScopeDrawer();
    const prefersReducedMotion = useReducedMotion();
    const [submitted, setSubmitted] = useState<boolean>(false);

    const form = useForm<{
        name: string;
        email: string;
        company: string;
        scope_tags: ScopeTagOption[];
        message: string;
        website: string;
    }>({
        name: '',
        email: '',
        company: '',
        scope_tags: ['Multi-Tenant SaaS'],
        message: '',
        website: '',
    });

    useEffect(() => {
        if (preselectedTag && !form.data.scope_tags.includes(preselectedTag)) {
            form.setData('scope_tags', [...form.data.scope_tags, preselectedTag]);
        }
    }, [preselectedTag]);

    const toggleTag = (tag: ScopeTagOption): void => {
        const exists = form.data.scope_tags.includes(tag);
        if (exists) {
            if (form.data.scope_tags.length === 1) {
                return;
            }
            form.setData(
                'scope_tags',
                form.data.scope_tags.filter((item) => item !== tag),
            );
        } else {
            form.setData('scope_tags', [...form.data.scope_tags, tag]);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.post('/inquiries', {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                form.reset('name', 'email', 'company', 'message', 'website');
            },
        });
    };

    const handleOpenChange = (nextOpen: boolean): void => {
        if (!nextOpen) {
            closeDrawer();
            window.setTimeout(() => setSubmitted(false), 260);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
            <AnimatePresence>
                {isOpen && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild forceMount>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: prefersReducedMotion ? 0.08 : 0.24 }}
                                className="fixed inset-0 z-50 bg-canvas/80"
                            />
                        </Dialog.Overlay>

                        <Dialog.Content asChild forceMount>
                            <motion.div
                                initial={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
                                animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
                                exit={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
                                transition={{
                                    duration: prefersReducedMotion ? 0.1 : 0.34,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-hairline bg-surface text-ink shadow-2xl focus:outline-none"
                            >
                                <div className="flex items-start justify-between border-b border-hairline px-6 py-5">
                                    <div>
                                        <p className="telemetry-label text-accent">
                                            Direct Engineering Brief
                                        </p>
                                        <Dialog.Title className="mt-1 font-grotesk text-2xl font-medium tracking-tight text-ink">
                                            Scope a Project or Role
                                        </Dialog.Title>
                                        <Dialog.Description className="mt-1 text-xs text-ink-secondary">
                                            Submissions persist to MySQL and dispatch async notifications via Redis &amp; Horizon.
                                        </Dialog.Description>
                                    </div>

                                    <Dialog.Close asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Close Scope Drawer"
                                        >
                                            <X className="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                    </Dialog.Close>
                                </div>

                                <div className="flex-1 overflow-y-auto px-6 py-6">
                                    {submitted ? (
                                        <div className="border border-success/40 bg-canvas p-6">
                                            <div className="flex items-center gap-2.5 text-success">
                                                <Check className="h-4 w-4" aria-hidden="true" />
                                                <span className="telemetry-label">Brief Dispatched</span>
                                            </div>
                                            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                                                Your project scope has been recorded and queued for review. Manoj will respond directly to your email.
                                            </p>
                                            <div className="mt-5">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenChange(false)}
                                                >
                                                    Close Drawer
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div>
                                                <span className="telemetry-label mb-2.5 block text-ink-secondary">
                                                    Engagement Scope
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {SCOPE_TAG_OPTIONS.map((tag) => {
                                                        const active = form.data.scope_tags.includes(tag);
                                                        return (
                                                            <button
                                                                key={tag}
                                                                type="button"
                                                                onClick={() => toggleTag(tag)}
                                                                className={cn(
                                                                    'cursor-pointer rounded-xs border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors',
                                                                    active
                                                                        ? 'border-accent bg-accent text-canvas'
                                                                        : 'border-hairline bg-canvas text-ink-secondary hover:border-ink-muted hover:text-ink',
                                                                )}
                                                            >
                                                                {tag}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {form.errors.scope_tags && (
                                                    <p className="mt-1.5 font-mono text-xs text-danger">
                                                        {form.errors.scope_tags}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label
                                                        htmlFor="drawer-name"
                                                        className="telemetry-label mb-1.5 block text-ink-secondary"
                                                    >
                                                        Your Name
                                                    </label>
                                                    <input
                                                        id="drawer-name"
                                                        type="text"
                                                        required
                                                        value={form.data.name}
                                                        onChange={(e) => form.setData('name', e.target.value)}
                                                        className="h-10 w-full rounded-xs border border-hairline bg-canvas px-3 text-sm text-ink focus:border-accent focus:outline-none"
                                                    />
                                                    {form.errors.name && (
                                                        <p className="mt-1 font-mono text-xs text-danger">
                                                            {form.errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="drawer-email"
                                                        className="telemetry-label mb-1.5 block text-ink-secondary"
                                                    >
                                                        Work Email
                                                    </label>
                                                    <input
                                                        id="drawer-email"
                                                        type="email"
                                                        required
                                                        value={form.data.email}
                                                        onChange={(e) => form.setData('email', e.target.value)}
                                                        className="h-10 w-full rounded-xs border border-hairline bg-canvas px-3 text-sm text-ink focus:border-accent focus:outline-none"
                                                    />
                                                    {form.errors.email && (
                                                        <p className="mt-1 font-mono text-xs text-danger">
                                                            {form.errors.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="drawer-company"
                                                    className="telemetry-label mb-1.5 block text-ink-secondary"
                                                >
                                                    Company / Organization (Optional)
                                                </label>
                                                <input
                                                    id="drawer-company"
                                                    type="text"
                                                    value={form.data.company}
                                                    onChange={(e) => form.setData('company', e.target.value)}
                                                    className="h-10 w-full rounded-xs border border-hairline bg-canvas px-3 text-sm text-ink focus:border-accent focus:outline-none"
                                                />
                                            </div>

                                            {/* Honeypot anti-spam trap (hidden from autofill extensions) */}
                                            <div
                                                aria-hidden="true"
                                                style={{
                                                    position: 'absolute',
                                                    left: '-9999px',
                                                    width: '1px',
                                                    height: '1px',
                                                    overflow: 'hidden',
                                                    opacity: 0,
                                                    pointerEvents: 'none',
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    name="hp_check"
                                                    tabIndex={-1}
                                                    autoComplete="new-password"
                                                    data-lpignore="true"
                                                    data-1p-ignore="true"
                                                    value={form.data.website}
                                                    onChange={(e) => form.setData('website', e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="drawer-message"
                                                    className="telemetry-label mb-1.5 block text-ink-secondary"
                                                >
                                                    Technical Requirements &amp; Timeline
                                                </label>
                                                <textarea
                                                    id="drawer-message"
                                                    rows={5}
                                                    required
                                                    minLength={15}
                                                    placeholder="Describe your system architecture, tenancy requirements, hardware bridge scope, or engineering role..."
                                                    value={form.data.message}
                                                    onChange={(e) => form.setData('message', e.target.value)}
                                                    className="w-full rounded-xs border border-hairline bg-canvas p-3 text-sm text-ink focus:border-accent focus:outline-none"
                                                />
                                                {form.errors.message && (
                                                    <p className="mt-1 font-mono text-xs text-danger">
                                                        {form.errors.message}
                                                    </p>
                                                )}
                                            </div>

                                            {Object.keys(form.errors).length > 0 && (
                                                <div
                                                    role="alert"
                                                    className="border border-danger/50 bg-canvas px-4 py-3 font-mono text-xs text-danger"
                                                >
                                                    {Object.values(form.errors)[0]}
                                                </div>
                                            )}

                                            <Button
                                                type="submit"
                                                variant="accent"
                                                size="lg"
                                                className="w-full"
                                                disabled={form.processing}
                                            >
                                                <Send className="h-4 w-4" aria-hidden="true" />
                                                <span>
                                                    {form.processing ? 'Dispatching...' : 'Submit Scope Brief'}
                                                </span>
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}
