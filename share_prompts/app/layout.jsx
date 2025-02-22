import "../styles/globals.css";
import Nav from "../components/Nav";
import Provider from "../components/Provider";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Promptopia",
  description: "Discover and Share AI Prompts",
};

const Layout = async ({ children }) => {
  // Fetch the session using the authOptions from your NextAuth setup

  return (
    <html lang="en">
      <body>
        {/* Pass session to the Provider */}
        
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
     
      </body>
    </html>
  );
};

export default Layout;
