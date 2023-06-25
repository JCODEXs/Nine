import "./globals.css";
import Header from "@/components/layout/header";

export const metadata = {
  title: "Nine",
  description: "Pasteleria",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
