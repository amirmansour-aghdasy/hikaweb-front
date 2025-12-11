import { ScrollTop } from "@/components/action_buttons";
import WhatsAppChatWidget from "@/components/action_buttons/WhatsAppChatWidget";

const ActionButtonsContainer = () => {
    return (
        <>
            <ScrollTop />
            {/* WhatsApp widget now automatically fetches from Settings API */}
            {/* Props are only used as fallback if Settings API is not available */}
            <WhatsAppChatWidget />
        </>
    );
};

export default ActionButtonsContainer;
