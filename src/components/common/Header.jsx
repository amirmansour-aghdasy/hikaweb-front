import OffCanvas from "./OffCanvas";
import Navbar from "./Navbar";

const Header = () => {
    return ( 
        <header id="header" className="w-full flex flex-col">
            <Navbar />
            <OffCanvas />
        </header>
     );
}
 
export default Header;