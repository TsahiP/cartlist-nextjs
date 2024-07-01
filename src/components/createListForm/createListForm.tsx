"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createList } from "@/lib/actions";
import { useFormState } from "react-dom";

const CreateListForm = () => {
  const [state, formAction] = useFormState(createList, undefined);
  const router = useRouter();

  // const [error, setError] = useState('');
  useEffect(() => {
   if (state?.status === "success") {  
    router.push("/lists");
   }
  }, [state,router])
  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">Create New List</h2>
      {/* {state?.error && <p className="text-red-500 mb-4">{state?.error}</p>} */}
      <form action={formAction}>
        {/* {state?.error} */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="creatorId"
          >
            Creator ID
          </label>
          <input
            name="creatorId"
            id="creatorId"
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
          Create List
        </button>
      </form>
    </div>
  );
};

export default CreateListForm;
