import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../animate.css';

function Home() {
  const [category, setCategory] = useState('cashIn');
  const [cashInTransactions, setCashInTransactions] = useState([]);
  const [cashOutTransactions, setCashOutTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null); // Store the uploaded image
  const [titleError, setTitleError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedCashInTransactions = JSON.parse(localStorage.getItem('cashInTransactions')) || [];
    const savedCashOutTransactions = JSON.parse(localStorage.getItem('cashOutTransactions')) || [];
    setCashInTransactions(savedCashInTransactions);
    setCashOutTransactions(savedCashOutTransactions);
  }, []);

  // Save data to localStorage whenever cashIn or cashOut transactions change
  useEffect(() => {
    localStorage.setItem('cashInTransactions', JSON.stringify(cashInTransactions));
    localStorage.setItem('cashOutTransactions', JSON.stringify(cashOutTransactions));
  }, [cashInTransactions, cashOutTransactions]);



  const handleTittleInput = (e) => {
    setAmountError('');
    setTitleError('');
    setTitle(e.target.value);  // Access the value of the input field
  };

  const handleAmountInput = (e) => {
    setAmountError('');
    setTitleError('');
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



  // Function to handle adding a transaction
  const addTransaction = () => {
    setTitleError('');
    setAmountError('');
    if (!title) {
      setTitleError("Enter title");
      return;
    }
    if (!amount) {
      setAmountError("Enter amount");
      return;
    }

    // Convert image to base64 if it's uploaded
    let imageURL = null;
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageURL = reader.result;
        const newTransaction = {
          title,
          amount: parseFloat(amount),
          date: new Date(),
          image: imageURL
        };
        if (category === 'cashIn') {
          setCashInTransactions((prev) => [...prev, newTransaction]);
        } else {
          setCashOutTransactions((prev) => [...prev, newTransaction]);
        }
        setTitle('');
        setAmount('');
        setImage(null);
        //  setSuccessMessage("Transaction added successfully!");
        toast.success("Transaction added successfully!");
        // Store the new transaction's image in localStorage
        const updatedTransactions = category === 'cashIn' ? [...cashInTransactions, newTransaction] : [...cashOutTransactions, newTransaction];
        localStorage.setItem(category === 'cashIn' ? 'cashInTransactions' : 'cashOutTransactions', JSON.stringify(updatedTransactions));
      };
      reader.readAsDataURL(image); // Convert image to base64
    } else {
      const newTransaction = {
        title,
        amount: parseFloat(amount),
        date: new Date(),
        image: null
      };

      if (category === 'cashIn') {
        setCashInTransactions((prev) => [...prev, newTransaction]);
      } else {
        setCashOutTransactions((prev) => [...prev, newTransaction]);
      }
      setTitle('');
      setAmount('');
      setImage(null);
      // Display the success message as a toast
      toast.success("Transaction added successfully!");
    }
  };

  // Function to calculate total amount
  const getTotalAmount = (transactions) => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2);
  };


  const handleOpenImage = (image) => {
    console.log("image click")
    // Redirect the current tab to the image URL
    window.location.href = image; // The URL of the image  
  }

  return (
    <>
      <div className="max-w-4xl mx-auto py-2 px-6">
        <div className="text-center">
          <div className="flex justify-center space-x-6">
            <motion.button
              className={`p-2 ${category === 'cashIn' ? 'bg-green-500 text-white' : 'bg-gray-300'} rounded-lg shadow-lg`}
              onClick={() => setCategory('cashIn')}
            >
              Cash In
            </motion.button>
            <motion.button
              className={`p-2 ${category === 'cashOut' ? 'bg-red-500 text-white' : 'bg-gray-300'} rounded-lg shadow-lg`}
              onClick={() => setCategory('cashOut')}
            >
              Cash Out
            </motion.button>
          </div>

          <div className="mt-4">

            {/* <h2 className="text-xl font-semibold">{category === 'cashIn' ? 'Add Cash In' : 'Add Cash Out'}</h2>
             */}

            <div className="mt-2">
              {/* Title Field */}
              <div className="mb-4">
                <label htmlFor="title" className="text-left block mb-2 font-medium text-gray-700">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={handleTittleInput}
                  placeholder="Title"
                  className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${titleError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {titleError && <p className="mt-2 text-left text-sm text-red-600"><span className="font-medium">Oh, snapp!</span> {titleError}</p>}
              </div>

              {/* Amount Field */}
              <div className="mb-4">
                <label htmlFor="amount" className="text-left block mb-2 font-medium text-gray-700">Amount</label>
                <input
                  id="amount"
                  type="text"
                  value={amount}
                  placeholder="123456"
                  onChange={handleAmountInput}
                  className={`bg-white border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${amountError ? 'border-red-500' : 'border-gray-300'}`}
                />
                {amountError && <p className="mt-2 text-left text-sm text-red-600"><span className="font-medium">Oh, snapp!</span> {amountError}</p>}
              </div>

              {/* File Upload (Image) Field */}
              <div className="mb-4">
                <label className="text-left block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">
                  Upload file
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-describedby="file_input_help"
                />
                <p className="text-left mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
                  SVG, PNG, JPG or GIF (MAX. 800x400px).
                </p>
              </div>

              {/* {successMessage && !titleError && <p className="mt-2 text-sm text-green-600"><span className="font-medium mb-10">Well done!</span> {successMessage}</p>} */}

              {/* Add Transaction Button */}
              <button
                onClick={addTransaction}
                className={`text-white p-2 rounded w-full ${category === 'cashIn' ? 'bg-blue-500' : 'bg-red-500'} shadow-2xl`}
              >
                Add {category === 'cashIn' ? 'Cash In' : 'Cash Out'}
              </button>
            </div>
          </div>

          <div className="mt-2">
            <div className="mt-2">
              {category === 'cashIn' ? (
                <div>
                  <div className="text-lg mb-2">
                    Total Cash In: ₹{getTotalAmount(cashInTransactions)}
                  </div>

                  <ul className="space-y-4 justify-evenly">
                    {cashInTransactions.map((transaction, index) => (
                      <li key={index} className="flex justify-between p-2 border border-gray-200 shadow-lg rounded-lg">
                        <div>
                          <p>{transaction.title}</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleString()}</p>
                        </div>
                        <div>
                          {transaction.image &&
                            <img src={transaction.image}
                              alt="Transaction"
                              className="w-16 h-16 object-cover 
                       mt-2 rounded cursor-pointer" />}
                        </div>
                        <div className="font-bold">₹{transaction.amount.toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>

                </div>
              ) : (
                <div>
                  <div className="text-lg mb-2">
                    Total Cash Out: ₹{getTotalAmount(cashOutTransactions)}
                  </div>

                  <ul className="space-y-4">
                    {cashOutTransactions.map((transaction, index) => (
                      <li key={index} className="flex justify-between p-2 border border-gray-200 shadow-lg rounded-lg">
                        <div>
                          <p>{transaction.title}</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleString()}</p>
                        </div>
                        <div>
                          {transaction.image && <img
                            src={transaction.image}
                            alt="Transaction"

                            className="w-16 h-16 object-cover 
                      mt-2 rounded cursor-pointer" />}
                        </div>
                        <div className="font-bold">₹{transaction.amount.toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        autoClose={3000}
        position="top-right"
      />
    </>
  );
}

export default Home;
