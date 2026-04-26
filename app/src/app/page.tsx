import Link from 'next/link';
import Image from 'next/image';
import { Github } from 'lucide-react';
import { Bebas_Neue, Work_Sans } from 'next/font/google';

const displayFont = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-display',
});

const bodyFont = Work_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-body',
});

export default function LandingPage() {
    return (
        <div
            className={`${displayFont.variable} ${bodyFont.variable} bg-vex-bg text-vex-text antialiased selection:bg-vex-primary selection:text-black flex flex-col min-h-screen`}
            style={{ fontFamily: 'var(--font-body)' }}
        >
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-vex-border/50 bg-vex-bg/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo.jpg"
                            alt="VexTube Logo"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <span className="text-lg tracking-[0.2em] uppercase text-white font-semibold">VexTube</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <Link
                            href="https://github.com/sanjeevafk/VexTube"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-vex-border text-vex-muted hover:text-white hover:border-white/60 transition-colors"
                            aria-label="VexTube GitHub repository"
                        >
                            <Github className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-xs uppercase tracking-widest text-vex-muted hover:text-white transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/app"
                            className="h-9 px-4 rounded-full bg-vex-primary hover:bg-vex-primaryHover text-black text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-all"
                        >
                            Launch App
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(120deg, rgba(0,224,115,0.08), rgba(0,224,115,0) 50%), linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '1200px 1200px, 48px 48px',
                        backgroundPosition: 'top center, top left',
                    }}
                />
                <div className="absolute -top-40 right-0 w-[520px] h-[520px] bg-vex-primary/10 blur-[140px] rounded-full -z-10" />
                <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-white/5 blur-[160px] rounded-full -z-10" />

                <section className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-vex-border bg-vex-surface/80 text-xs uppercase tracking-[0.3em] text-vex-muted">
                        Local-first learning studio
                    </div>

                    <h1 className="mt-8 text-5xl sm:text-6xl lg:text-7xl leading-none text-white font-[var(--font-display)]">
                        Build your
                        <span className="block text-vex-primary">study flow.</span>
                    </h1>
                    <p className="mt-6 text-base sm:text-lg text-vex-muted max-w-2xl mx-auto leading-relaxed">
                        VexTube is a distraction-free YouTube workspace with structured notes, review mode,
                        and focus tools. Everything stays on your device.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/app"
                            className="h-12 px-8 rounded-full bg-vex-primary hover:bg-vex-primaryHover text-black font-semibold uppercase tracking-widest flex items-center justify-center transition-transform hover:scale-[1.03]"
                        >
                            Launch Player
                        </Link>
                        <Link
                            href="/privacy"
                            className="h-12 px-8 rounded-full border border-vex-border text-white font-semibold uppercase tracking-widest flex items-center justify-center hover:border-white/60 transition-colors"
                        >
                            Privacy First
                        </Link>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto mt-16 grid gap-6 lg:grid-cols-3">
                    {[
                        {
                            title: 'Review Mode',
                            body: 'Surface notes on schedule with spaced repetition ratings and due lists.',
                        },
                        {
                            title: 'Collections',
                            body: 'Organize playlists, mark favorites, and name study sets instantly.',
                        },
                        {
                            title: 'Focus Timer',
                            body: 'Pomodoro cycles with quick start, pause, and reset controls.',
                        },
                        {
                            title: 'Timestamp Notes',
                            body: 'Capture timestamps and jump back to the exact moment in a video.',
                        },
                        {
                            title: 'Note Search',
                            body: 'Live filters and sorting across your entire note library.',
                        },
                        {
                            title: 'Exportable',
                            body: 'Download notes as PDF, TXT, or Markdown whenever you need them.',
                        },
                    ].map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-2xl border border-vex-border/60 bg-vex-surface/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-1"
                        >
                            <p className="text-sm uppercase tracking-[0.2em] text-vex-muted">Feature</p>
                            <h3 className="mt-3 text-xl text-white font-semibold">{feature.title}</h3>
                            <p className="mt-2 text-sm text-vex-muted leading-relaxed">{feature.body}</p>
                        </div>
                    ))}
                </section>

                <section className="max-w-6xl mx-auto mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                    <div className="rounded-3xl border border-vex-border/60 bg-[#111111] p-8 shadow-2xl">
                        <h2 className="text-3xl text-white font-semibold">How it works</h2>
                        <div className="mt-6 space-y-5 text-sm text-vex-muted">
                            <div className="flex items-start gap-4">
                                <span className="text-vex-primary text-xs font-semibold">01</span>
                                <p>Paste a playlist URL and VexTube loads the playlist in a focused player.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-vex-primary text-xs font-semibold">02</span>
                                <p>Capture notes with timestamps, then search or export them anytime.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-vex-primary text-xs font-semibold">03</span>
                                <p>Review notes on schedule, track stats, and stay in flow with the focus timer.</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-vex-border/60 bg-vex-surface/90 p-8">
                        <h3 className="text-lg text-white font-semibold">Local-first by design</h3>
                        <p className="mt-3 text-sm text-vex-muted leading-relaxed">
                            Your notes, progress, and review data stay on your device. The only server calls are
                            for YouTube metadata, proxied securely through route handlers.
                        </p>
                        <div className="mt-6 rounded-2xl border border-vex-border/50 bg-[#0c0c0c] p-4 text-xs text-vex-muted">
                            No accounts. No ads. No tracking.
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-10 border-t border-vex-border/30">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-vex-muted">
                    <span>Focus. Review. Repeat.</span>
                    <div className="flex items-center gap-4">
                        <Link
                            href="https://github.com/sanjeevafk/VexTube"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-vex-muted hover:text-white transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </Link>
                        <Link href="/app" className="text-vex-primary hover:text-vex-primaryHover">Launch VexTube</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
