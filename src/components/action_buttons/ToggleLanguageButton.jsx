import { MdLanguage } from "react-icons/md";

const ToggleLanguageButton = () => {
    return (
        <button className="rounded-full p-2.5 sm:p-2.5 bg-teal-500 text-white outline-none" data-aos="fade-left">
            <MdLanguage className="text-xl md:text-2xl" />
        </button>
    );
};

export default ToggleLanguageButton;
