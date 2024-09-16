'use client'

import React, { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa6'
import { isMobile } from 'react-device-detect'

interface IWhatsappBtnProps {
    items: {
        name: string;
        amount: string;
    }[];
}

const WhatsappBtn = ({ items }: IWhatsappBtnProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleClick = () => {
    setIsModalOpen(true);
  }

  const handleSend = () => {
    // Format the items into a string
    const message = items.map(item => `מוצר: ${item.name}, כמות: ${item.amount}`).join('\n');
    const formattedPhoneNumber = phoneNumber.substring(1);
    // Create a WhatsApp URL with the formatted string
    const whatsappLink = isMobile
      ? `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
      : `https://web.whatsapp.com/send?phone=${formattedPhoneNumber}&text=${encodeURIComponent(message)}`;

    // Redirect the user to the WhatsApp URL
    window.open(whatsappLink, '_blank');
    setIsModalOpen(false);
  }

  return (
    <>
      <div className='bg-green-600 w-min p-2 rounded-full  
           cursor-pointer md:right-8' onClick={handleClick}>
        <FaWhatsapp color='white' className='w-7 h-7 md:w-10 md:h-10' />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
          <div className="flex flex-col items-center bg-white p-4 rounded-md shadow-lg ">
            <h2 className="text-lg font-bold mb-4 " >הכנס מספר טלפון</h2>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border p-2 mb-4 w-full"
              placeholder="05X-XXXXXXX"
            />
            <button
              onClick={handleSend}
              className="bg-green-600 text-white p-2 rounded-md w-36"
            >
              שלח
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-black text-white rounded-md mt-2  w-36"
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default WhatsappBtn








































// 'use client'

// import React from 'react'
// import { useRouter } from 'next/navigation'
// import { FaWhatsapp } from 'react-icons/fa6'
// interface IWhatsappBtnProps {
//     items: {
//         name: string;
//         amount: string;
//     }[];
// }
// const WhatsappBtn = ({ items }: IWhatsappBtnProps) => {

//   const router = useRouter();

//   const handleClick = async () => {
//     console.log(items);
    
//   }

//   return (
//     <>
//       <div className='bg-green-600 w-min p-2 rounded-full  
//            cursor-pointer md:right-8' onClick={handleClick}>
//         <FaWhatsapp color='white' className='w-7 h-7 md:w-10 md:h-10' />
//       </div>
//     </>
//   )
// }

// export default WhatsappBtn