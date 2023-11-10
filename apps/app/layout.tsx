import "@glimpz-io/ui/styles.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font";

export const metadata: Metadata = {
    title: "Join The Wait List - Glimpz",
    description: "Say goodbye to awkward encounters with Glimpz! Streamline your social interactions and never miss a chance to connect. No more overthinking, just genuine face-to-face connections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <html lang="en" className="bg-gradient-to-r from-neutral-950 to-zinc-950 min-w-fit">
            <body className={GeistSans.className}>{children}</body>
        </html>
    );
}