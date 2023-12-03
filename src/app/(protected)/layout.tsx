import { ReactNode } from "react";
import "./_components/globals.scss";
import Header from "./_components/Header";
import { Toaster } from "react-hot-toast";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div className="xl:max-w-7xl w-full mx-auto max-w-[90%] py-8 px-4 md:px-0">
          <Header />
          <main>{children}</main>
        </div>
        <div id="modals">{/* Mount slot for modal windows */}</div>
        <Toaster />
      </body>
    </html>
  );
}
