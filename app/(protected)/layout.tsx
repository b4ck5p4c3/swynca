import { ReactNode } from "react";
import GlobalHeader from "../../shared/components/GlobalHeader/GlobalHeader";

import '../../styles/globals.scss';

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div className="xl:max-w-7xl w-full mx-auto max-w-[90%] py-8 px-4 md:px-0">
          <GlobalHeader />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
