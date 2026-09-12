import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "@scaffold-ui/components/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--fuente-display",
  axes: ["SOFT"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--fuente-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--fuente-mono",
  display: "swap",
});

export const metadata = getMetadata({
  title: "Qupuy — Cursos con acceso transferible",
  description: "Compra el curso, apréndelo y pásale el acceso a alguien más.",
});

const QupuyApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <ThemeProvider enableSystem defaultTheme="qupuy" themes={["qupuy", "qupuyclaro"]}>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default QupuyApp;
