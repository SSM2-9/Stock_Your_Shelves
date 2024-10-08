import { Inter } from "next/font/google";
import "./globals.css"; // Import your global CSS

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stock Your Shelves",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
