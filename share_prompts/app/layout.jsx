import "../styles/globals.css";
import Nav from "../components/Nav";
import Provider from "../components/Provider";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route"; // Import the authOptions

export const metadata = {
  title: "Promptopia",
  description: "Discover and Share AI Prompts",
};

const Layout = async ({ children }) => {
  // Fetch the session using the authOptions from your NextAuth setup
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        {/* Pass session to the Provider */}
        <Provider session={session}>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default Layout;
