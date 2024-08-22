import EList from "@/components/ofek/elist/elist";
import { auth } from "@/lib/auth";

const page = async () => {
    const session = await auth();
    return (
        <div >
            
        </div>
    );
};

export default page;




