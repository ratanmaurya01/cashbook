import React, { useState, useEffect } from 'react';
import '../animate.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from "framer-motion";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

import TransactionModal from '../Model/TransactionModal';
import { Line } from 'react-chartjs-2'; // Import Line chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; // Import required chart.js components
import ApexCharts from 'react-apexcharts'; // Import ApexCharts
// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function Cashbook() {

    const [showGraphModal, setShowGraphModal] = useState(false);
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
    const [selectedFilter, setSelectedFilter] = useState("All");
    const AllTotalAmountCash = totalCashIn + totalCashOut;
    const [showTooltip, setShowTooltip] = useState(false);


    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

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
    
        const selectedDateFormatted = selectedDate.toISOString(); // Save as ISO string
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
        setSelectedDate(new Date(transactionToEdit.dateTime || ''));
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


    const handleClickCashIn = () => {
        setTransactionType("cashIn");
        setTitle('');
        setAmount('');
        setAmountError('');
        setTittleError('');
        setSelectedDate(new Date()); // Set to the current date
        setShowModal(true);

    }

    const handleClickCashOut = () => {
        setTransactionType("cashOut");
        setTitle('');
        setAmount('');
        setAmountError('');
        setTittleError('');
        setSelectedDate(new Date()); // Set to the current date
        setShowModal(true);
    }


    const handleCloseModal = () => {
        setAmountError('');
        setTittleError('');
        setShowModal(false)
    }

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };


    const filterTransactions = () => {
        const now = new Date();
        switch (selectedFilter) {
            case "Daily":
                return history.filter((transaction) => {
                    const transactionDate = new Date(transaction.dateTime);
                    return transactionDate.toDateString() === now.toDateString();
                });
            case "Weekly":
                const startOfWeek = now.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)
                return history.filter((transaction) => {
                    const transactionDate = new Date(transaction.dateTime);
                    return transactionDate >= startOfWeek && transactionDate <= now;
                });
            case "Monthly":
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return history.filter((transaction) => {
                    const transactionDate = new Date(transaction.dateTime);
                    return transactionDate >= startOfMonth && transactionDate <= now;
                });
            case "Yearly":
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                return history.filter((transaction) => {
                    const transactionDate = new Date(transaction.dateTime);
                    return transactionDate >= startOfYear && transactionDate <= now;
                });
            default:
                return history;
        }
    };


    const formatDateTime = (dateTimeString) => {
        const dateObj = new Date(dateTimeString);

        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = String(dateObj.getFullYear()).slice(-2);
        const formattedDate = `${day}/${month}/${year}`;

        let hours = dateObj.getHours();
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedTime = `${hours}:${minutes} ${ampm}`;

        return `${formattedDate} ${formattedTime}`;
    };



    const handlePrintReport = () => {
        console.log('data graph ', history);

        setShowGraphModal(true); // Show the graph when the button is clicked

    }


    const [selectedRange, setSelectedRange] = useState(6); // Default to 6 months




    const filterHistoryData = (history, range) => {
        const now = new Date();
        return history.filter(item => {
            const itemDate = new Date(item.dateTime);
            const diffMonths = (now.getFullYear() - itemDate.getFullYear()) * 12 + (now.getMonth() - itemDate.getMonth());
            return diffMonths < range;
        });
    };

    const processMonthlyData = (history) => {
        const monthlyTotals = {};

        history.forEach(item => {
            const month = new Date(item.dateTime).toLocaleString('default', { month: 'short' });
            if (!monthlyTotals[month]) {
                monthlyTotals[month] = { cashIn: 0, cashOut: 0 };
            }
            if (item.type === 'cashIn') {
                monthlyTotals[month].cashIn += item.amount;
            } else if (item.type === 'cashOut') {
                monthlyTotals[month].cashOut += item.amount;
            }
        });

        const allMonths = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return allMonths.map(month => ({
            month,
            cashIn: monthlyTotals[month]?.cashIn || 0,
            cashOut: monthlyTotals[month]?.cashOut || 0,
        }));
    };


    const graphData = (monthlyData) => ({
        series: [
            {
                name: "Cash In",
                color: "#31C48D",
                data: monthlyData.map(data => data.cashIn),
            },
            {
                name: "Cash Out",
                color: "#F05252",
                data: monthlyData.map(data => data.cashOut),
            },
        ],
        chart: {
            type: "bar",
            height: 400,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 5,
                barHeight: "60%",
            },
        },
        xaxis: {
            title: { text: "Amount", style: { fontWeight: "bold" } },
            labels: {
                formatter: value => `${value / 1000}K`, // Format numbers in K format
            },
        },
        yaxis: {
            title: { text: "Months", style: { fontWeight: "bold" } },
            categories: monthlyData.map(data => data.month),
            labels: {
                style: {
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                },
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            x: { formatter: value => `₹${value}` },
            y: {
                formatter: (value, { seriesIndex }) => {
                    const type = seriesIndex === 0 ? "Cash In" : "Cash Out";
                    return `${type}: ₹${value}`;
                },
            },
        },
        fill: { opacity: 1 },
        legend: { position: "bottom" },
    })

    const handleRangeChange = (range) => {
        setSelectedRange(range);
    };



    return (
        <>


            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 min-w-[300px] shadow-xl rounded-lg mx-auto p-2 w-full sm:max-w-md md:max-w-lg lg:w-1/2 xl:w-1/2"
            >
                <div className="mb-2 bg-white rounded-lg shadow-md p-1">
                    <p className="text-md text-center font-semibold text-gray-800">Enable Backup</p>
                    <div className="flex justify-around items-center mt-1 space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full w-full sm:w-auto lg:w-[200px]"
                        >
                            Skip
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full w-full sm:w-auto lg:w-[200px]"
                        >
                            Enable
                        </motion.button>
                    </div>
                </div>

                <div className="mb-2 mt-2">
                    <div className="mb-1 flex justify-around">
                        {["All", "Daily", "Weekly", "Monthly", "Yearly"].map((label, index) => (
                            <motion.span
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                onClick={() => handleFilterChange(label)}
                                className={`text-xs font-medium px-3 py-1 rounded-full border cursor-pointer 
                        ${label === selectedFilter
                                        ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                                        : "bg-blue-100 text-blue-800 border-blue-400"
                                    }`}
                            >
                                {label}
                            </motion.span>
                        ))}
                        <motion.span whileHover={{ scale: 1.1 }}>
                            <div>
                                <p className="text-xs font-medium px-3 py-1 rounded-full border bg-red-400 text-white border-white cursor-pointer"
                                  onClick={handlePrintReport} >
                                 GRAPH
                                </p>
                            </div>
                        </motion.span>


                    </div>
                    <div>
                        <div className=''>
                            <table className="min-w-full table-fixed border-separate border-spacing-0 rounded-lg shadow-lg">
                                <thead className="bg-gray-200 text-gray-900 ">
                                    <tr>
                                        <th className="sticky top-0 px-4 py-2 text-left bg-gray-200 z-10">Title</th>
                                        <th className="sticky top-0 px-4 py-2 text-center bg-gray-200 z-10">Cash In</th>
                                        <th className="sticky top-0 px-4 py-2 text-center bg-gray-200 z-10">Cash Out</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>

                    <div className="overflow-x-auto w-full shadow-sm rounded-lg bg-white p-1">
                        {filterTransactions().length > 0 ? (
                            <div className="max-h-[300px] overflow-y-auto">
                                <div className="flex flex-col gap-1">
                                    {filterTransactions().map((transaction, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center shadow-lg rounded-lg bg-white p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                            onClick={() => handleEdit(index)}
                                        >
                                            <div className="flex-1 text-wrap break-words">
                                                <div className="font-medium">{transaction.title}</div>
                                                <div className="text-xs text-gray-500">
                                                    {formatDateTime(transaction.dateTime)}
                                                </div>
                                            </div>

                                            <div className="flex-1 text-center text-green-600">
                                                {transaction.type === "cashIn" ? `+₹${transaction.amount}` : ""}
                                            </div>

                                            <div className="flex-1 text-center text-red-600">
                                                {transaction.type === "cashOut" ? `-₹${transaction.amount}` : ""}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-4 text-gray-500">No transactions available</div>
                        )}
                    </div>
                  

                </div>

                <div className="flex justify-between items-center">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full w-full sm:w-auto lg:w-[200px]"
                        onClick={handleClickCashIn}
                    >
                        Cash In
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 ml-2 rounded-full w-full sm:w-auto lg:w-[200px]"
                        onClick={handleClickCashOut}
                    >
                        Cash Out
                    </motion.button>
                </div>

                <div className="flex justify-evenly mt-1 text-gray-800">
                    <p>
                        Total Cash In: <span className="text-green-600">₹{totalCashIn}</span>
                    </p>
                    <p>
                        Total Cash Out: <span className="text-red-600">₹{totalCashOut}</span>
                    </p>
                </div>





                <div>
                    <div>
                        <div className='
                    shadow-lg rounded-lg bg-white p-1
                     hover:shadow-xl transition-shadow 
                     duration-300 cursor-pointer
                     '>
                            <p className='text-center text-violet-900' >Update your daily record</p>
                        </div>
                    </div>
                </div>

            </motion.div>



            {/* Show Graph Section ✔✔ */}
            {showGraphModal && (
                <div className="fixed inset-0 p-4  bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-2 w-full max-w-4xl rounded-lg ">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowGraphModal(false)}
                            className="absolute top-0 right-1 lg:right-2 md:right-2 sm:right-8 text-gray-600 hover:text-gray-800 text-5xl "
                        >
                            &times;
                        </button>

                        {/* Dashboard Card */}
                        <div className="mt-5 w-full bg-white  p-4 md:p-6">

                            <div className="grid grid-cols-2 gap-4 py-3 px-5 rounded-lg shadow">
                                <dl>
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">
                                        Cash In
                                    </dt>
                                    <dd className="text-xl font-bold text-green-500 dark:text-green-400">
                                        ₹{totalCashIn}
                                    </dd>
                                </dl>
                                <dl>
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">
                                        Cash Out
                                    </dt>
                                    <dd className="text-xl font-bold text-red-600 dark:text-red-500">
                                        ₹{totalCashOut}
                                    </dd>
                                </dl>
                            </div>

                            {/* Dropdown Menu */}
                            <div className="mt-2 flex justify-center rounded-lg shadow mb-2">
                                <div className="relative">
                                    <button
                                        id="dropdownDefaultButton"
                                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 flex items-center dark:hover:text-white"
                                        type="button"
                                        onClick={() => document.getElementById('dropdownMenu').classList.toggle('hidden')}
                                    >
                                        Last {selectedRange} months
                                        <svg
                                            className="w-2.5 m-2.5 ms-1.5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 10 6"
                                            aria-hidden="true"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 4 4 4-4"
                                            />
                                        </svg>
                                    </button>

                                    <div
                                        id="dropdownMenu"
                                        className="hidden absolute z-10 bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-lg shadow w-44"
                                    >
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                            {[1, 3, 6, 9, 12].map((range) => (
                                                <li key={range}>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        onClick={() => {
                                                            handleRangeChange(range);
                                                            document.getElementById('dropdownMenu').classList.add('hidden');
                                                        }}
                                                    >
                                                        Last {range} month{range > 1 && 's'}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* Chart */}
                            <div className="bg-white rounded-lg shadow-md w-full max-h-[400px] md:max-h-[500px]">
                                <ApexCharts
                                    options={graphData(processMonthlyData(filterHistoryData(history, selectedRange)))}
                                    series={graphData(processMonthlyData(filterHistoryData(history, selectedRange))).series}
                                    type="bar"
                                    height={300}

                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}



            <TransactionModal
                showModal={showModal}
                transactionType={transactionType}
                title={title}
                amount={amount}
                image={image}
                titleError={titleError}
                amountError={amountError}
                selectedDate={selectedDate}
                editTransactionIndex={editTransactionIndex}
                onClose={handleCloseModal}
                onTitleChange={(e) => setTitle(e.target.value)}
                onAmountChange={handleAmountInput}
                onImageChange={(e) => setImage(e.target.files[0])}
                // onDateChange={handleDateChange}
                onDateChange={(date) => setSelectedDate(date)}
                onSave={handleAddTransaction}
                onDelete={handleDelete}
            />

            <ToastContainer
                autoClose={3000}
                position="top-right"
            />
        </>
    );
}

export default Cashbook;
