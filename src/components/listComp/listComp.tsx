import Link from "next/link";
import {  FaShoppingCart, FaUsers, FaCalendarAlt } from "react-icons/fa";
import DeleteListBtn from "./deleteListBtn/deleteListBtn";

interface List {
  createdAt: Date;
  creatorId: string;
  items: string[];
  sharedWith: string[];
  title: string;
  _id: string;
}

interface Props {
  index: number;
  list: List;
  sharedFlag: boolean | false;
}

const ListComp = async (props: Props) => {
  const listIdPlainObject = JSON.parse(JSON.stringify(props.list._id));
  
  // Format creation date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get item count
  const itemCount = props.list.items?.length || 0;
  
  return (
    <div className="group">
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Shared indicator */}
        {props.sharedFlag && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <FaUsers className="text-xs" />
              משותף
            </div>
          </div>
        )}
        
        {/* Card content */}
        <Link
          href={{ pathname: `/cart`, query: { listId: listIdPlainObject, shared: props.sharedFlag } }}
          className="block p-6"
        >
          {/* Icon and title */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                props.sharedFlag 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                  : 'bg-gradient-to-br from-primary to-red-500'
              }`}>
                <FaShoppingCart className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors">
                  {props.list.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendarAlt className="text-gray-400" />
                <span>נוצר ב-{formatDate(props.list.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {itemCount} פריט{itemCount !== 1 ? 'ים' : ''}
                </span>
              </div>
              
              {props.sharedFlag && props.list.sharedWith && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <FaUsers className="text-gray-400" />
                  <span>{props.list.sharedWith.length} משתמש{props.list.sharedWith.length !== 1 ? 'ים' : ''}</span>
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Delete button for personal lists */}
        {!props.sharedFlag && (
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg w-8 h-8 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
              <DeleteListBtn listId={props.list._id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListComp;
