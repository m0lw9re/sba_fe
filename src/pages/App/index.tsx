import { IPublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, UnauthenticatedTemplate } from "@azure/msal-react";
import Loading from "components/common/Loading";
import { RootState } from "configs/configureStore";
import { startApp } from "configs/globalSlice";
import { useAppDispatch } from "configs/hooks";
import NotFoundPage from "pages/404";
import ErrorBoundary from "pages/App/subcomponents/ErrorBoundary";
import MainLayout from "pages/App/subcomponents/MainLayout";
import { FC, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import authRoutes from "routes/route.auth";
import {
  APPRAISAL_FILES,
  AZURE_REDIRECT,
  NOT_FOUND,
} from "routes/route.constant";
import publicRoutes from "routes/route.public";

type AppProps = {
  pca: IPublicClientApplication;
};

const App = ({ pca }: AppProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const appState = useSelector((state: RootState) => state.appSlice);
  const { isLoading } = useSelector((state: RootState) => state.globalSlice);
  const homeRoute = process.env.REACT_APP_HOME_PAGE_ROUTE || APPRAISAL_FILES;
  useEffect(() => {
    if (location.pathname === AZURE_REDIRECT) {
      navigate("/", { replace: true });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (appState.isLogged) {
      appDispatch(startApp());
    }
  }, [appState.isLogged]);

  if (isLoading && appState.isLogged) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <MsalProvider instance={pca}>
        <Routes>
          {publicRoutes.map(({ path, element }) => {
            const Element: FC = element;
            return (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense fallback={<Loading />}>
                    {/* <UnauthenticatedTemplate> */}
                    <Element />
                    {/* </UnauthenticatedTemplate> */}
                  </Suspense>
                }
              />
            );
          })}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to={homeRoute} />} />
            {authRoutes.map(({ path, element }) => {
              const Element: FC = element;
              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Suspense fallback={<Loading />}>
                      <Element />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
          <Route
            key={NOT_FOUND}
            path={NOT_FOUND}
            element={
              <Suspense fallback={<Loading />}>
                <UnauthenticatedTemplate>
                  <NotFoundPage />
                </UnauthenticatedTemplate>
              </Suspense>
            }
          />
        </Routes>
      </MsalProvider>
    </ErrorBoundary>
  );
};

export default App;
