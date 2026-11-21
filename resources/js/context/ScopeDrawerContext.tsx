import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

export const SCOPE_TAG_OPTIONS = [
    'Multi-Tenant SaaS',
    'Industrial Automation',
    'Security Audit',
    'Senior Engineering Role',
] as const;

export type ScopeTagOption = (typeof SCOPE_TAG_OPTIONS)[number];

interface ScopeDrawerContextValue {
    readonly isOpen: boolean;
    readonly preselectedTag: ScopeTagOption | null;
    readonly openDrawer: (tag?: ScopeTagOption) => void;
    readonly closeDrawer: () => void;
}

const ScopeDrawerContext = createContext<ScopeDrawerContextValue | null>(null);

export function ScopeDrawerProvider({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [preselectedTag, setPreselectedTag] = useState<ScopeTagOption | null>(null);

    const openDrawer = useCallback((tag?: ScopeTagOption): void => {
        if (tag) {
            setPreselectedTag(tag);
        }
        setIsOpen(true);
    }, []);

    const closeDrawer = useCallback((): void => {
        setIsOpen(false);
    }, []);

    const value = useMemo<ScopeDrawerContextValue>(
        () => ({ isOpen, preselectedTag, openDrawer, closeDrawer }),
        [isOpen, preselectedTag, openDrawer, closeDrawer],
    );

    return (
        <ScopeDrawerContext.Provider value={value}>
            {children}
        </ScopeDrawerContext.Provider>
    );
}

export function useScopeDrawer(): ScopeDrawerContextValue {
    const context = useContext(ScopeDrawerContext);
    if (!context) {
        throw new Error('useScopeDrawer must be used inside ScopeDrawerProvider.');
    }
    return context;
}
