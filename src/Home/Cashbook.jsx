import React, { useState, useEffect } from 'react';
import '../animate.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cashbook() {
    const [showModal, setShowModal] = useState(false);
    const [transactionType, setTransactionType] = useState('cashIn'); // Either 'cashIn' or 'cashOut'
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [image, setImage] = useState(null);
    const [history, setHistory] = useState([]);
    const [totalCashIn, setTotalCashIn] = useState(0);
    const [totalCashOut, setTotalCashOut] = useState(0);
    const [amountError, setAmountError] = useState('');

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

    const handleAddTransaction = () => {
        const currentDate = new Date();
        const dateTime = currentDate.toLocaleString();
        const newTransaction = {
            title,
            amount: parseFloat(amount),
            type: transactionType,
            dateTime: dateTime,
            image
        };
        setHistory([newTransaction, ...history]);
        if (transactionType === 'cashIn') {
            setTotalCashIn(totalCashIn + newTransaction.amount);
        } else {
            setTotalCashOut(totalCashOut + newTransaction.amount);
        }
        toast.success("Transaction added successfully!");
        setShowModal(false);
        setTitle('');
        setAmount('');
        setImage(null);
    };

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

                <div className="mb-2 ">
                    <div className="mb-1 flex justify-between">
                        <p>All</p>
                        <p>Daily</p>
                        <p>Weekly</p>
                        <p>Monthly</p>
                        <p>Yearly</p>
                    </div>

                    <div className="mb-2 text-center mt-1">
                        <p className="text-lg">All</p>
                    </div>

                    <div className="mb-4">


                        <div className="overflow-x-auto w-full"> {/* Ensure the table container takes full width */}
                            <div className="m-2 text-center mb-2">

                                <div className="m-2 flex justify-evenly grid-cols-6 gap-6 text-center mb-2">
                                    <p className="">Title</p>
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
                                <div className="max-h-60 sm:max-h-[250px] md:max-h-[300px] lg:max-h-[400px] overflow-y-auto">
                                    <table className="min-w-full table-auto">
                                        <tbody>
                                            {history.map((transaction, index) => (
                                                <tr key={index} className={`border-b ${index === 1 ? 'mt-4' : ''} shadow-lg`}>
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
                        onClick={() => { setTransactionType('cashIn'); setShowModal(true); }}
                    >
                        Cash In
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                        onClick={() => { setTransactionType('cashOut'); setShowModal(true); }}
                    >
                        Cash Out
                    </button>
                </div>

                <div className="flex justify-evenly ml-5">
                    <p>Total Cash In: <span className='text-green-800'>₹{totalCashIn}</span> </p>
                    <p >Total Cash Out:<span className='text-red-600'>₹{totalCashOut}</span></p>
                </div>
                
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-11/12 sm:w-80 md:w-96 lg:w-1/2 xl:w-1/2">
                        <h2 className="text-xl mb-4">{transactionType === 'cashIn' ? 'Add Cash In' : 'Add Cash Out'}</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            className="mb-4 p-2 border rounded w-full"
                            value={title}
                            onChange={handleTitleInput}
                        />
                        <input
                            type="text"
                            placeholder="Amount"
                            className="mb-4 p-2 border rounded w-full"
                            value={amount}
                            onChange={handleAmountInput}
                        />
                        <p>{setAmountError}</p>
                        <input
                            type="file"
                            className="mb-4 p-2 border rounded w-full"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded w-full sm:w-auto"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                                onClick={handleAddTransaction}
                            >
                                Save
                            </button>
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
