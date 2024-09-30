import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes, adminRoutes } from './routes/routes';
import './App.css';
import { ToastContainer } from 'react-toastify';

import DefaultLayout from './layout/DefaultLayout';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Puclic routes */}
          <Route>
            {publicRoutes.map((item, index) => {
              const Layout = item.layout || DefaultLayout;
              const Page = item.component;
              return (
                <Route
                  key={index}
                  path={item.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Route>

          {/* Admin routes */}
          <Route>
            {adminRoutes.map((item, index) => {
              const Layout = item.layout || DefaultLayout;
              const Page = item.component;
              return (
                <Route
                  key={index}
                  path={item.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose="3000" />
    </div>
  );
}

export default App;
