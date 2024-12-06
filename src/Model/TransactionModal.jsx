import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TransactionModal = ({
    showModal,
    transactionType,
    title,
    amount,
    image,
    titleError,
    amountError,
    selectedDate,
    editTransactionIndex,
    onClose,
    onTitleChange,
    onAmountChange,
    handleAmountInput,
    onDateChange,
    onSave,
    onDelete,
}) => {

    if (!showModal) return null;
    return (
        <div className="fixed inset-0  z-50   bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg  shadow-lg w-11/12 sm:w-80 md:w-96 lg:w-1/2 xl:w-1/2">
                <h2 className="text-xl mb-4">
                    {transactionType === 'cashIn' ? 'Edit Cash In' : 'Edit Cash Out'}
                </h2>
                {/* Title input */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Details</label>
                    <input
                        type="text"
                        placeholder="Title"
                        className={`border text-sm rounded-lg block w-full p-2.5 ${
                            titleError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={title}
                        onChange={onTitleChange}
                    />
                    {titleError && <p className="text-red-500">{titleError}</p>}
                </div>
                {/* Amount input */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Amount</label>
                    <input
                        type="text"
                        placeholder="Amount"
                        className={`border text-sm rounded-lg block w-full p-2.5 ${
                            amountError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={amount}
                        onChange={onAmountChange}
                    />
                    {amountError && <p className="text-red-500">{amountError}</p>}
                </div>
                {/* File input */}
                <input
                    type="file"
                    className="mb-4 p-2 border rounded w-full"
                    onChange={handleAmountInput}
                />
                {/* Date picker */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Transaction Date</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={onDateChange}
                        className="p-2 border rounded w-full"
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
                {/* Buttons */}
                <div className="flex justify-between">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded w-full sm:w-auto"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                        onClick={onSave}
                    >
                        Save
                    </button>
                    {editTransactionIndex !== null && (
                        <button
                            className="ml-4 bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                            onClick={onDelete}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
