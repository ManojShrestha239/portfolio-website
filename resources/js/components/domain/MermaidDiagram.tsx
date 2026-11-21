import { useMemo, useState } from 'react';
import { Code2, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MermaidDiagramProps {
    readonly definition: string;
    readonly title?: string;
}

interface ParsedNode {
    readonly id: string;
    readonly label: string;
}

interface ParsedEdge {
    readonly from: string;
    readonly to: string;
    readonly note?: string;
}

function parseMermaidGraph(source: string): {
    readonly kind: string;
    readonly nodes: readonly ParsedNode[];
    readonly edges: readonly ParsedEdge[];
} {
    const lines = source
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith('%%'));

    const header = lines[0] ?? 'flowchart LR';
    const nodeMap = new Map<string, string>();
    const edges: ParsedEdge[] = [];

    const registerNode = (raw: string): string => {
        const cleaned = raw.trim();
        const bracketMatch = cleaned.match(/^([A-Za-z0-9_*]+)\s*(?:\[\(|\(|\[)(.+?)(?:\)\]|\]|\))$/);
        if (bracketMatch && bracketMatch[1] && bracketMatch[2]) {
            const id = bracketMatch[1];
            const label = bracketMatch[2].replace(/\\n/g, ' · ').trim();
            nodeMap.set(id, label);
            return id;
        }
        const id = cleaned.replace(/[^A-Za-z0-9_*]/g, '') || cleaned;
        if (!nodeMap.has(id)) {
            nodeMap.set(id, cleaned === '[*]' ? 'Start' : cleaned);
        }
        return id;
    };

    for (const line of lines.slice(1)) {
        if (line.startsWith('participant ')) {
            const match = line.match(/^participant\s+(\S+)\s+as\s+(.+)$/);
            if (match && match[1] && match[2]) {
                nodeMap.set(match[1], match[2].trim());
            }
            continue;
        }

        const seqMatch = line.match(/^(\S+?)\s*(?:->>|-->>)\s*(\S+?)\s*:\s*(.+)$/);
        if (seqMatch && seqMatch[1] && seqMatch[2] && seqMatch[3]) {
            const from = registerNode(seqMatch[1]);
            const to = registerNode(seqMatch[2]);
            edges.push({ from, to, note: seqMatch[3].trim() });
            continue;
        }

        const flowMatch = line.match(/^(.+?)\s*-->\s*(.+)$/);
        if (flowMatch && flowMatch[1] && flowMatch[2]) {
            const left = flowMatch[1].trim();
            const rightPart = flowMatch[2].trim();
            const [targetRaw, noteRaw] = rightPart.split(':');
            const from = registerNode(left);
            const to = registerNode((targetRaw ?? rightPart).trim());
            edges.push({ from, to, note: noteRaw?.trim() });
        }
    }

    const nodes = Array.from(nodeMap.entries()).map(([id, label]) => ({ id, label }));
    return { kind: header, nodes, edges };
}

export function MermaidDiagram({ definition, title = 'System Architecture Diagram' }: MermaidDiagramProps) {
    const [showSource, setShowSource] = useState<boolean>(false);
    const parsed = useMemo(() => parseMermaidGraph(definition), [definition]);

    const nodeWidth = 220;
    const nodeHeight = 58;
    const gapY = 34;
    const padX = 28;
    const padY = 24;
    const svgWidth = 680;
    const svgHeight = Math.max(
        220,
        padY * 2 + parsed.nodes.length * (nodeHeight + gapY) - gapY,
    );

    const positions = useMemo(() => {
        const map = new Map<string, { x: number; y: number }>();
        parsed.nodes.forEach((node, idx) => {
            const colOffset = idx % 2 === 0 ? padX : svgWidth - padX - nodeWidth;
            const y = padY + idx * (nodeHeight + gapY);
            map.set(node.id, { x: colOffset, y });
        });
        return map;
    }, [parsed.nodes]);

    return (
        <div className="border border-hairline bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-3">
                <div className="flex items-center gap-2.5">
                    <Network className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    <span className="telemetry-label text-ink">{title}</span>
                    <span className="font-mono text-[10px] uppercase text-ink-muted">
                        ({parsed.kind})
                    </span>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSource((prev) => !prev)}
                >
                    <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{showSource ? 'View Diagram' : 'Mermaid Source'}</span>
                </Button>
            </div>

            {showSource ? (
                <pre className="overflow-x-auto bg-canvas p-5 font-mono text-xs leading-relaxed text-ink-secondary">
                    <code>{definition}</code>
                </pre>
            ) : (
                <div className="overflow-x-auto bg-canvas p-4">
                    <svg
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        role="img"
                        aria-label={title}
                        className="mx-auto h-auto w-full max-w-[680px]"
                    >
                        <defs>
                            <marker
                                id="arch-arrow"
                                viewBox="0 0 10 10"
                                refX="8"
                                refY="5"
                                markerWidth="6"
                                markerHeight="6"
                                orient="auto-start-reverse"
                            >
                                <path d="M 0 1 L 10 5 L 0 9 z" fill="#D97706" />
                            </marker>
                        </defs>

                        {parsed.edges.map((edge, idx) => {
                            const fromPos = positions.get(edge.from);
                            const toPos = positions.get(edge.to);
                            if (!fromPos || !toPos) {
                                return null;
                            }

                            const x1 = fromPos.x + nodeWidth / 2;
                            const y1 = fromPos.y + nodeHeight;
                            const x2 = toPos.x + nodeWidth / 2;
                            const y2 = toPos.y;
                            const midY = (y1 + y2) / 2;

                            return (
                                <g key={`${edge.from}-${edge.to}-${idx}`}>
                                    <path
                                        d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                                        fill="none"
                                        stroke="#23272F"
                                        strokeWidth="1.5"
                                        markerEnd="url(#arch-arrow)"
                                    />
                                    {edge.note && (
                                        <text
                                            x={(x1 + x2) / 2}
                                            y={midY - 6}
                                            textAnchor="middle"
                                            fill="#D97706"
                                            fontSize="10"
                                            fontFamily="JetBrains Mono, monospace"
                                        >
                                            {edge.note.slice(0, 44)}
                                        </text>
                                    )}
                                </g>
                            );
                        })}

                        {parsed.nodes.map((node, idx) => {
                            const pos = positions.get(node.id);
                            if (!pos) {
                                return null;
                            }

                            return (
                                <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                                    <rect
                                        width={nodeWidth}
                                        height={nodeHeight}
                                        rx="2"
                                        fill="#121417"
                                        stroke={idx === 0 ? '#D97706' : '#23272F'}
                                        strokeWidth="1"
                                    />
                                    <text
                                        x={12}
                                        y={18}
                                        fill="#D97706"
                                        fontSize="9"
                                        fontFamily="JetBrains Mono, monospace"
                                    >
                                        {String(idx + 1).padStart(2, '0')} · {node.id.toUpperCase()}
                                    </text>
                                    <text
                                        x={12}
                                        y={39}
                                        fill="#EDEDEF"
                                        fontSize="11"
                                        fontFamily="Plus Jakarta Sans, sans-serif"
                                    >
                                        {node.label.length > 30
                                            ? `${node.label.slice(0, 29)}…`
                                            : node.label}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            )}
        </div>
    );
}
