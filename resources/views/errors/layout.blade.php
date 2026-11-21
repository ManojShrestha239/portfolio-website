<!DOCTYPE html>
<html lang="en" class="dark">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0C0D0F" />
        <title>@yield('code') — @yield('title') · Manoj Shrestha</title>
        <style>
            :root {
                --canvas: #0C0D0F;
                --surface: #121417;
                --hairline: #23272F;
                --ink: #EDEDEF;
                --secondary: #9CA3AF;
                --muted: #6B7280;
                --accent: #D97706;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                background-color: var(--canvas);
                color: var(--ink);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                -webkit-font-smoothing: antialiased;
                background-image:
                    linear-gradient(to right, rgba(35, 39, 47, 0.55) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(35, 39, 47, 0.35) 1px, transparent 1px);
                background-size: 96px 96px;
            }
            header, footer {
                border-color: var(--hairline);
                background: rgba(12, 13, 15, 0.94);
            }
            header {
                border-bottom: 1px solid var(--hairline);
                height: 68px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 2rem;
            }
            .brand {
                display: inline-flex;
                align-items: center;
                gap: 0.75rem;
                text-decoration: none;
                color: var(--ink);
            }
            .brand-box {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid var(--accent);
                color: var(--accent);
                font: 500 11px/1 ui-monospace, SFMono-Regular, monospace;
            }
            .mono {
                font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
                font-size: 11px;
                letter-spacing: 0.22em;
                text-transform: uppercase;
            }
            main {
                flex: 1;
                display: flex;
                align-items: center;
                padding: 3rem 2rem;
            }
            .frame {
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                border-top: 1px solid var(--hairline);
                border-bottom: 1px solid var(--hairline);
                padding: 3.5rem 0;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 3rem;
                align-items: end;
            }
            .code {
                font-family: "Arial Black", Impact, sans-serif;
                font-size: clamp(5rem, 16vw, 12rem);
                line-height: 0.85;
                letter-spacing: -0.045em;
                color: transparent;
                -webkit-text-stroke: 1.25px var(--ink);
                margin-top: 1rem;
            }
            .details {
                border-left: 1px solid var(--accent);
                padding-left: 1.25rem;
            }
            h1 {
                font-size: clamp(1.75rem, 3.5vw, 2.5rem);
                font-weight: 500;
                letter-spacing: -0.02em;
            }
            p.summary {
                margin-top: 0.85rem;
                color: var(--secondary);
                line-height: 1.65;
                font-size: 0.95rem;
                max-width: 52ch;
            }
            .diag {
                margin-top: 1.5rem;
                border: 1px solid var(--hairline);
                background: var(--surface);
                padding: 0.9rem 1rem;
                color: var(--accent);
            }
            .actions {
                margin-top: 1.75rem;
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem;
            }
            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 40px;
                padding: 0 1.25rem;
                border-radius: 2px;
                text-decoration: none;
                cursor: pointer;
                font-family: ui-monospace, SFMono-Regular, monospace;
                font-size: 11px;
                letter-spacing: 0.14em;
                text-transform: uppercase;
            }
            .btn-accent {
                background: var(--accent);
                color: var(--canvas);
                border: 1px solid var(--accent);
            }
            .btn-outline {
                background: var(--surface);
                color: var(--ink);
                border: 1px solid var(--hairline);
            }
            footer {
                border-top: 1px solid var(--hairline);
                padding: 1.25rem 2rem;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 1rem;
                color: var(--muted);
            }
        </style>
    </head>
    <body>
        <header>
            <a class="brand" href="/">
                <span class="brand-box">MS</span>
                <span class="mono" style="color: var(--secondary);">Manoj Shrestha</span>
            </a>
            <span class="mono" style="color: var(--accent);">HTTP @yield('code')</span>
        </header>

        <main>
            <div class="frame">
                <div>
                    <div class="mono" style="color: var(--accent);">Status Response · Edition 01</div>
                    <div class="code">@yield('code')</div>
                </div>
                <div>
                    <div class="details">
                        <h1>@yield('title')</h1>
                        <p class="summary">@yield('message')</p>
                    </div>
                    <div class="diag mono">@yield('diagnostic')</div>
                    <div class="actions">
                        <a class="btn btn-accent" href="/">&larr; Return to Index</a>
                        <button class="btn btn-outline" type="button" onclick="window.location.reload()">Retry Request</button>
                    </div>
                </div>
            </div>
        </main>

        <footer class="mono">
            <span>&copy; {{ date('Y') }} Manoj Shrestha</span>
            <span>Industrial Editorial Dark</span>
        </footer>
    </body>
</html>
