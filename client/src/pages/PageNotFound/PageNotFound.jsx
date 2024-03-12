import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import styles from "./PageNotFound.module.css";

const PageNotFound = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>404 Page Not Found | Scope</title>
        </Helmet>
      </HelmetProvider>
      <main className={styles.container}>
        <h1>Sorry, the page was not found.</h1>
        <p>Please check the link address.</p>
        <Link className={styles.returnBtn} to="/">
          Return Home
        </Link>
      </main>
    </>
  );
};

export default PageNotFound;
