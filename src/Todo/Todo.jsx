import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';  // Use the correct import for v2



function Todo() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [formData, setFormData] = useState([]);
    const [bgColor, setBgColor] = useState('bg-white');  // State for background color

    useEffect(() => {
        // Retrieve data from localStorage on component mount
        const storedData = JSON.parse(localStorage.getItem("formData")) || [];
        setFormData(storedData);
    }, []);

    const onTitleChange = (e) => setTitle(e.target.value);
    const handleTextChange = (e) => setDescription(e.target.value);

    const handleUpdateButton = () => {
        if (title.trim() === "") {
            console.log("Enter title");
            return;
        }
        if (description.trim() === "") {
            console.log("Enter Description");
            return;
        }

        const newEntry = { title, description };
        const updatedData = [...formData, newEntry]; // Append new data
        setFormData(updatedData); // Update state
        localStorage.setItem("formData", JSON.stringify(updatedData)); // Save to localStorage
        console.log("Data saved to localStorage:", updatedData);

        setTitle('');
        setDescription('');
    };


    const handleCancelButton = () => {
        setTitle("");
        setDescription('');
    }


    const handleEdit = (index) => {
        const itemToEdit = formData[index];
        setTitle(itemToEdit.title);
        setDescription(itemToEdit.description);
        // You can also modify the formData to replace the edited item when submitting
    };

    const handleDelete = (index) => {
        const updatedData = formData.filter((_, i) => i !== index);
        setFormData(updatedData);
        localStorage.setItem("formData", JSON.stringify(updatedData)); // Update localStorage
    };



    const handleColorClick = (color) => {
        setBgColor(color);  // Set the background color based on the clicked color
    };

    // Determine if the background color requires light text
    const textColor = bgColor.includes('gray') || bgColor.includes('blue') || bgColor.includes('indigo') || bgColor.includes('purple')
        || bgColor.includes('red') || bgColor.includes('green') || bgColor.includes('pink') || bgColor.includes('teal')
        ? 'text-white' : 'text-gray-600';

    return (

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 min-w-[300px] shadow-xl rounded-lg mx-auto p-2 w-full sm:max-w-md md:max-w-lg lg:w-1/2 xl:w-1/2 !important"
        >


            <div

            >
                <div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Title</label>
                        <input
                            type="text"
                            placeholder="Title"
                            className="border text-sm rounded-lg block w-full p-2.5 border-gray-300"
                            value={title}
                            onChange={onTitleChange}
                        />
                    </div>

                    <div className='mb-5'>
                        <label htmlFor="message" className="block mb-2 text-sm font-medium">Your message</label>
                        <textarea
                            id="message"
                            rows="4"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Write your thoughts here..."
                            onChange={handleTextChange}
                            value={description}
                        ></textarea>
                    </div>

                    <div className="mt-5 mb-5 flex justify-around items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full w-full sm:w-auto lg:w-[200px]"
                            onClick={handleCancelButton}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={handleUpdateButton}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full w-full sm:w-auto lg:w-[200px]"
                        >
                            Update
                        </motion.button>
                    </div>

                    <div className="overflow-x-auto whitespace-nowrap mt-5 mb-5">
                    </div>
                    <div className="overflow-x-auto w-full shadow-sm rounded-lg p-1">
                        {formData.length > 0 && (
                            <div className="max-h-[300px] overflow-y-auto">
                                <div className="flex flex-col gap-1">
                                    {formData.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`text-wrap break-words mb-1 p-2 border-b  bg-white hover:shadow-xl transition-shadow duration-300 border-gray-300 ${bgColor} rounded-lg relative`}  // Add 'relative' to position icons
                                        >
                                            <p className={`mb-3 mr-28 font-semibold ${textColor}`}>{item.title}</p>
                                            <p className={`mb-2 text-gray-600 ${textColor}`}>{item.description}</p>
                                            <div className="absolute top-2 right-2 flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(index)} 
                                                    className={` flex justify-center items-center bg-blue-500 rounded-full p-2 shadow-lg ${textColor}`}  // Add background color and rounded shape
                                                >
                                                    <PencilIcon className={`h-5 w-5 ${textColor}`} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(index)}
                                                    className={`flex justify-center items-center bg-blue-500 rounded-full p-2 shadow-lg ${textColor}`}  // Add background color and rounded shape
                                                >
                                                    <TrashIcon className={`h-5 w-5 shadow-lg rounded-lg  ${textColor}`} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </motion.div>

    );
}

export default Todo;
