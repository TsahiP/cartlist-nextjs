import { getCarts } from "@/lib/actions";
import ListComp from "../listComp/listComp";
import { auth } from "@/lib/auth";
import { getSharedCarts } from "@/lib/actions";
import { FaShoppingCart, FaUsers } from "react-icons/fa";

const MyCarts = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  // FETCH DATA WITH AN API
  const lists = await getCarts(userId ?? undefined, userEmail ?? undefined);
  const sharedCarts = await getSharedCarts(session?.user?.email);

  return (
    <div dir="rtl" className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-purple-500 rounded-full mb-6 shadow-lg">
            <FaShoppingCart className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent mb-4">
            הרשימות שלי
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            נהל את רשימות הקניות שלך בקלות ובנוחות
          </p>
        </div>

        {/* My Lists Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-red-500 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              הרשימות שלי
            </h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {lists.length} רשימות
            </span>
          </div>
          
          {lists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lists.map((list: any, index: any) => (
                <ListComp key={index} index={index} list={list} sharedFlag={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">אין רשימות עדיין</h3>
              <p className="text-gray-500">צור את הרשימה הראשונה שלך כדי להתחיל</p>
            </div>
          )}
        </div>

        {/* Shared Lists Section */}
        {sharedCarts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                רשימות משותפות
              </h2>
              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-500" />
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {sharedCarts.length} משותפות
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sharedCarts.map((list: any, index: any) => (
                <ListComp key={index} index={index} list={list} sharedFlag={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCarts;
