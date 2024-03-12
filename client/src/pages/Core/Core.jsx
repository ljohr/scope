import "./Core.css";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Core = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>All Core Courses | Scope</title>
        </Helmet>
      </HelmetProvider>
      <main className="core-main">
        <h1>Core</h1>
      </main>
    </>
  );
};

export default Core;
