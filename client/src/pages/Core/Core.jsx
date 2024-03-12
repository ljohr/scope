import { useContext, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { UserContext } from "../../providers/UserContext";
import "./Core.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Core = () => {
  const { currentUser, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please login to view the page.");
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

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
