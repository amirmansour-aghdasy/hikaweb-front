import { Toaster } from "react-hot-toast";

const ModalsContainer = () => {
    return (
        <>
            <Toaster position="top-left" toastOptions={{ duration: 1500 }} reverseOrder={false} />
        </>
    );
};

export default ModalsContainer;
