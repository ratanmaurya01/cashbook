import React, { useState, useEffect } from 'react';
import '../animate.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
function Cashbook() {
    const [showModal, setShowModal] = useState(false);
    const [transactionType, setTransactionType] = useState('cashIn'); // Either 'cashIn' or 'cashOut'
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [image, setImage] = useState(null);
    const [history, setHistory] = useState([]);
    const [totalCashIn, setTotalCashIn] = useState(0);
    const [totalCashOut, setTotalCashOut] = useState(0);
    const [titleError, setTittleError] = useState('');
    const [amountError, setAmountError] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editTransactionIndex, setEditTransactionIndex] = useState(null);

    // Load saved history and totals from localStorage on mount
    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('history')) || [];
        const savedTotalCashIn = parseFloat(localStorage.getItem('totalCashIn')) || 0;
        const savedTotalCashOut = parseFloat(localStorage.getItem('totalCashOut')) || 0;
        setHistory(savedHistory);
        setTotalCashIn(savedTotalCashIn);
        setTotalCashOut(savedTotalCashOut);
    }, []);

    // Save history and totals to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('history', JSON.stringify(history));
        localStorage.setItem('totalCashIn', totalCashIn.toString());
        localStorage.setItem('totalCashOut', totalCashOut.toString());
    }, [history, totalCashIn, totalCashOut]);



    const handleTitleInput = (e) => {
        setTittleError('');
        setTitle(e.target.value);
    }

    const handleAmountInput = (e) => {
        const value = e.target.value;
        // Allow only digits, and one decimal point, and limit the input to 6 characters
        const regex = /^(\d{0,9}(\.\d{0,4})?)?$/;
        // If the input matches the regex and is not longer than 6 characters, update state
        if (regex.test(value) && value.length <= 9) {
            setAmountError('');
            setAmount(value);
        } else {
            setAmountError('Max 9 digit');
        }
    }

    // const handleAddTransaction = () => {
    //     const currentDate = new Date();
    //     const dateTime = currentDate.toLocaleString();
    //     const newTransaction = {
    //         title,
    //         amount: parseFloat(amount),
    //         type: transactionType,
    //         dateTime: dateTime,
    //         image
    //     };
    //     setHistory([newTransaction, ...history]);
    //     if (transactionType === 'cashIn') {
    //         setTotalCashIn(totalCashIn + newTransaction.amount);
    //     } else {
    //         setTotalCashOut(totalCashOut + newTransaction.amount);
    //     }
    //     toast.success("Transaction added successfully!");
    //     setShowModal(false);
    //     setTitle('');
    //     setAmount('');
    //     setImage(null);
    // };


    const handleAddTransaction = () => {

        setTittleError('');
        setAmountError('');
        if (title === "") {
            setTittleError('Enter valid title.');
            return;
        }
        if (amount === "") {
            setAmountError('Enter valid amount.');
            return;
        }

        const currentDate = new Date();
        const dateTime = currentDate.toLocaleString();
        
        const selectedDateFormatted = new Date(selectedDate).toLocaleString();
        
        const newTransaction = {
            title,
            amount: parseFloat(amount),
            type: transactionType,
            dateTime: selectedDateFormatted,
            image,

        };
        if (editTransactionIndex !== null) {
            // Update the transaction in the history
            const updatedHistory = history.map((transaction, index) =>
                index === editTransactionIndex ? newTransaction : transaction
            );
            setHistory(updatedHistory);
            // Update totals
            const oldTransaction = history[editTransactionIndex];
            if (oldTransaction.type === 'cashIn') {
                setTotalCashIn(totalCashIn - oldTransaction.amount + newTransaction.amount);
            } else {
                setTotalCashOut(totalCashOut - oldTransaction.amount + newTransaction.amount);
            }
            toast.success("Transaction updated successfully!");
        } else {
            setHistory([newTransaction, ...history]);
            if (transactionType === 'cashIn') {
                setTotalCashIn(totalCashIn + newTransaction.amount);
            } else {
                setTotalCashOut(totalCashOut + newTransaction.amount);
            }
            toast.success("Transaction added successfully!");
        }
        setShowModal(false);
        setTitle('');
        setAmount('');
        setImage(null);
        setEditTransactionIndex(null);  // Reset the edit state
        setSelectedDate(new Date());
    };


    const handleEdit = (index) => {
        const transactionToEdit = history[index];
        setTitle(transactionToEdit.title);
        setAmount(transactionToEdit.amount.toString());
        setTransactionType(transactionToEdit.type);
        setImage(transactionToEdit.image);
        setEditTransactionIndex(index);  // Store the index of the transaction being edited
        setShowModal(true);  // Open the modal
    };

    const handleDelete = () => {
        if (editTransactionIndex !== null) {
            const updatedHistory = history.filter((_, index) => index !== editTransactionIndex);
            setHistory(updatedHistory);
            // Update totalCashIn and totalCashOut accordingly
            const deletedTransaction = history[editTransactionIndex];
            if (deletedTransaction.type === 'cashIn') {
                setTotalCashIn(totalCashIn - deletedTransaction.amount);
            } else {
                setTotalCashOut(totalCashOut - deletedTransaction.amount);
            }
            toast.success("Transaction deleted successfully!");
            setShowModal(false);  // Close the modal
        }
    };


    const handleCloseModel = () => {
        setAmountError('');
        setTittleError('');
        setShowModal(false)
    }

    return (
        <>
            <div className="mx-auto p-1 w-full sm:max-w-md md:max-w-lg lg:w-1/2 xl:w-1/2">
                <div className="mb-1 mt-1 bg-slate-50 rounded-lg shadow-md p-2">
                    <p className="text-md">Enable Backup</p>
                    <div className="flex items-center flex-row sm:flex-row space-x-2">
                        <button className="bg-gray-300 px-4 py-2 rounded sm:mb-0 w-full sm:w-auto">Skip</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto">Enable</button>
                    </div>
                </div>

                <div className="mb-2 mt-3 ">
                    <div className="mb-1 ml-5 mr-5 flex justify-between">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">All</span>
                        <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">Daily</span>
                        <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">Weekly</span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">Monthly </span>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-purple-400 border border-purple-400">Yearly</span>
                    </div>

                    <div className="mb-2 text-center mt-2">
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500 ">
                            <svg className=" w-6.5 h-3.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                            </svg>
                            <span className='ml-2 mr-5 text-md'>All</span>
                        </span>
                    </div>

                    <div className="mb-4">
                        <div className="overflow-x-auto w-full"> {/* Ensure the table container takes full width */}
                            <div className="m-2 text-center mb-2">
                                <div className="m-2 flex justify-evenly grid-cols-6 gap-6 text-center mb-2">
                                    <p className="ml-5">Title</p>
                                    <p className="ml-28">Cash In</p>
                                    <p>Cash Out</p>
                                </div>
                                <table className="min-w-full table-auto">

                                    {/* Table Header */}

                                    <thead className="bg-gray-100">
                                        {/* <tr>
                                            <th className="px-4 py-2 border-b">Title</th>
                                            <th className="px-4 py-2 border-b ">Cash In</th>
                                            <th className="px-4 py-2 border-b">Cash Out</th>
                                        </tr> */}
                                    </thead>
                                </table>

                                {/* Scrollable Table Body */}

                                <div className="max-h-72 sm:max-h-[250px] md:max-h-[300px] lg:max-h-[400px] overflow-y-auto">
                                    <table className="min-w-full table-auto">
                                        <tbody>
                                            {history.map((transaction, index) => (
                                                <tr key={index} className={`border-b ${index === 1 ? 'mt-4' : ''} shadow-lg`} onClick={() => handleEdit(index)}>
                                                    <td className="px-4 py-2 break-words whitespace-normal overflow-hidden text-ellipsis">
                                                        <span className="block">{transaction.title}</span>
                                                        <span className="block text-[12px]">{transaction.dateTime}</span>
                                                    </td>
                                                    <td className="px-2 py-2 text-center text-green-800 ">
                                                        {transaction.type === 'cashIn' ? `+${transaction.amount}` : ''}
                                                    </td>
                                                    <td className="px-2 py-2 text-center text-red-600">
                                                        {transaction.type === 'cashOut' ? `-${transaction.amount}` : ''}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center flex-row sm:flex-row space-x-2">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                        onClick={() => {
                            setTransactionType('cashIn');
                            setEditTransactionIndex(null);
                            setTitle('');
                            setAmount('');
                            setImage(null);
                            setShowModal(true);
                            setSelectedDate(new Date()); // Reset date to current date
                        }}
                    >
                        Cash In
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                        onClick={() => {
                            setTransactionType('cashOut');
                            setEditTransactionIndex(null);
                            setShowModal(true);
                            setSelectedDate(new Date()); // Reset date to current date
                            setTitle('');
                            setAmount('');
                            setImage(null);
                        }}
                    >
                        Cash Out
                    </button>
                </div>

                <div className="flex justify-evenly ml-2">
                    <p>Total Cash In: <span className='text-green-800'>₹{totalCashIn}</span> </p>
                    <p >Total Cash Out:<span className='text-red-600'>₹{totalCashOut}</span></p>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-11/12 sm:w-80 md:w-96 lg:w-1/2 xl:w-1/2">
                        <h2 className="text-xl mb-4">
                            {transactionType === 'cashIn' ? 'Edit Cash In' : 'Edit Cash Out'}
                        </h2>

                        {/* Title input */}

                        <div className='mb-4'>
                            <label htmlFor="username-error" className="block mb-2 text-sm font-medium text-white-700">Details</label>
                            <input
                                type="text"
                                id="username-error"
                                placeholder="Title"
                                className={`border text-sm rounded-lg focus:ring-500 block w-full p-2.5 dark:text-black dark:placeholder-gray-500 dark:border-gray-500 ${titleError
                                    ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                value={title}
                                onChange={handleTitleInput}
                            />
                            {titleError && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    <span className="font-medium ">Oops!</span> {titleError}
                                </p>
                            )}
                        </div>

                        {/* Amount input */}

                        <div className='mb-4'>
                            <label htmlFor="username-error" className="block mb-2 text-sm font-medium text-white-700">Amount</label>
                            <input
                                type="text"
                                placeholder="Amount"
                                className={`mb-1 p-2 border rounded w-full ${amountError
                                    ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                value={amount}
                                onChange={handleAmountInput}
                            />
                            {amountError && (
                                <p className="text-red-500 mb-3">
                                    {amountError}
                                </p>
                            )}
                        </div>

                        {/* File input */}

                        <input
                            type="file"
                            className="mb-4 p-2 border rounded w-full"
                            onChange={(e) => setImage(e.target.files[0])}
                        />

                        {/* Date picker */}

                        <div className="mb-4 w-full">
                            <label className="block text-sm font-semibold mb-2">Transaction Date</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}  // Update the selected date state
                                className="p-2 border rounded w-full"  // Tailwind styles for full width
                                dateFormat="dd/MM/yyyy"
                                wrapperClassName="w-full"  // Ensures the wrapper takes full width
                                calendarClassName="w-full" // Makes the calendar full width too
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded w-full sm:w-auto"
                                onClick={handleCloseModel}
                            >
                                Cancel
                            </button>
                            <button
                                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                                onClick={handleAddTransaction}
                            >
                                Save
                            </button>
                            {editTransactionIndex !== null && (
                                <button
                                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer
                autoClose={3000}
                position="top-right"
            />
        </>
    );
}

export default Cashbook;
