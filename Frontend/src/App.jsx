import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/ui/AppLayout';
import ErrorPage from './components/pages/ErrorPage';
import HomePage from './components/pages/HomePage';
import UploadPage from './components/pages/UploadPage';
import { SignUp, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
         //index true means when this component is loaded when the parent is matched
      //and no other sub-route is specified
      { index: true, path: "", element: <HomePage /> },
      {
        path: "upload",
        // fix:applied route protection for this feature
        element: (
          <>
            <SignedIn>
              <UploadPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
      },
      { path: "sign-up", element: <SignUp /> }
    ]
  }
]);
//  6167eb
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;