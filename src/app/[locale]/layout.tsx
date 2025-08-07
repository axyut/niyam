import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/contexts/theme-provider";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import "@/styles/globals.css";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { BottomNavbar } from "@/components/layout/bottom-navbar";
import { LogoutConfirmation } from "../../components/ui/logout-confirmation";
import { Toaster } from "@/components/ui/sonner";
import { SettingsModal } from "@/components/ui/settings-modal";
import { SearchModal } from "@/components/search/search-modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Niyam - Legal Accessibility Platform",
  description:
    "Making Nepali laws accessible, navigable, and understandable for everyone.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  console.log(`Locale: ${locale}`);
  // Providing all messages to the client
  // is the easiest way to get started
  const messages = await getMessages();
  //   console.log(`Messages: ${messages}`);
  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    console.log(`Invalid locale: ${locale}`);
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex h-screen bg-background">
              <LeftSidebar />
              <main className="flex-1 flex flex-col overflow-hidden">
                <TopNavbar />
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
              </main>
            </div>
            <BottomNavbar />
            <SettingsModal />
            <LogoutConfirmation />
            <Toaster />
            <SearchModal />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
