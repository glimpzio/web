import { AnalyticsProvider } from "@glimpz-io/hooks";
import "@glimpz-io/ui/styles.css";
import { GeistSans } from "geist/font";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Join The Wait List - Glimpz",
    description: "Say goodbye to awkward encounters with Glimpz! Streamline your social interactions and never miss a chance to connect. No more overthinking, just genuine face-to-face connections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    if (!MIXPANEL_TOKEN) throw Error("missing mixpanel token");

    return (
        <html lang="en" className="bg-gradient-to-r from-neutral-950 to-zinc-950 min-w-fit">
            <AnalyticsProvider mixpanelToken={MIXPANEL_TOKEN}>
                <body className={GeistSans.className}>{children}</body>
            </AnalyticsProvider>
        </html>
    );
}
