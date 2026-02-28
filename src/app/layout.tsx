import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MultiTenantProvider } from "@/lib/tenant-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "myERP | Sveobuhvatno ERP rješenje",
    description: "Moderno i globalno ERP rješenje za male tvrtke integrirano s Fiskalizacijom 2.0",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="hr" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen bg-background text-foreground tracking-tight`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <MultiTenantProvider>
                        {children}
                    </MultiTenantProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
