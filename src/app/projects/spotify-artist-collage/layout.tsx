import "@/app/projects/spotify-artist-collage/global.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function ArtistCollageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
