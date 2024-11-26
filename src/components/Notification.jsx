
import { useState, useEffect } from 'react';

const NotificationButton = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [notificationScheduled, setNotificationScheduled] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    // Check if notification permission is granted when the component is mounted
    useEffect(() => {
        console.log("Notification permission on load:", Notification.permission); // Log permission status
        if (Notification.permission === 'granted') {
            setHasPermission(true);
        } else if (Notification.permission === 'denied') {
            setPermissionDenied(true); // Set the state if permission is denied
        } else {
            setHasPermission(false);
        }
    }, []);

    // Request notification permission from the user, triggered by a button click
    const requestNotificationPermission = () => {
        console.log("Requesting permission...");
        Notification.requestPermission().then(permission => {
            console.log("Permission status after request:", permission); // Log permission status after request
            if (permission === 'granted') {
                setHasPermission(true);
                setPermissionDenied(false); // Reset if permission granted
            } else {
                setHasPermission(false);
                setPermissionDenied(true); // Mark as denied
            }
        });
    };

    // Show notification when it's time
    const showReminderNotification = (title, options) => {
        if (Notification.permission === 'granted') {
            new Notification(title, options);  // Display the notification
        } else {
            console.error('Notification permission is denied.');
        }
    };

    // Schedule the reminder for 1 minute (60 seconds)
    const scheduleReminder = (timeInMillis, title, options) => {
        setTimeout(() => {
            showReminderNotification(title, options);
            setNotificationScheduled(true); // Set the state that the notification was triggered
        }, timeInMillis);
    };

    // Handle the reminder setting (set to 60 seconds)
    const handleSetReminder = () => {
        console.log('Reminder button clicked');
        const timeInMillis = 60 * 1000; // 1 minute = 60,000 milliseconds
        scheduleReminder(timeInMillis, 'Reminder: Time is up!', {
            body: 'Your 1-minute timer is up!',
        });
    };

    return (
        <div>
            {/* Request permission if not granted or denied */}
            {!hasPermission && !permissionDenied ? (
                <div>
                    <button
                        className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                        onClick={requestNotificationPermission}
                    >
                        Enable Notifications
                    </button>
                </div>
            ) : permissionDenied ? (
                <div>
                    <p>Notifications permission has been denied. You can enable it manually in your browser settings.</p>
                    {/* <p>
                        For Chrome, go to: <strong>Settings > Privacy and security > Site settings > Notifications</strong>
                    </p>
                    <p>
                        For Edge, go to: <strong>Settings > Cookies and site permissions > Notifications</strong>
                    </p> */}
                </div>
            ) : (
                <div>
                    <p>Notifications are enabled!</p>
                    <div>
                        <button onClick={handleSetReminder}>
                            {notificationScheduled ? 'Reminder Set' : 'Set Reminder for 1 Minute'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationButton;
