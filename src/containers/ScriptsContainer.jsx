import { ClarityTracker } from "@/components/scripts"
import { Goftino } from "@/components/scripts";
import GlobalErrorHandler from "@/components/error/GlobalErrorHandler";


const ScriptsContainer = () => {
    return (
        <>
            <GlobalErrorHandler />
            {/* <Goftino /> */}
            <ClarityTracker />
        </>
    );
};

export default ScriptsContainer;
