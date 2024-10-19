import HomePage from "../pages/HomePage";
import {Outlet} from 'react-router-dom';

const AppLayout = () => {
  return (
    <>
    {/* //This component will always render when AppLayout is displayed */}
    {/* WE can render nav/mainNavigation here,but this time I havent used it*/}
    {/* //we use <main> for semantic clarity, indicating that the 
    //child routes are part of the main content */}
    <main>
    {/* //This placeholder will render the child components based on the current route */}
      <Outlet/>
    </main>
   </>
  );
};

export default AppLayout;