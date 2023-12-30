Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/firebase-messaging-sw.js', {scope: "/firebase-cloud-messaging-push-scope"})
            .then(registration => {
                setTimeout(function() {
                    console.log('Service Worker registered');
                    let messaging;
                    fetch('/get_firebase_conf')
                        .then(response => {
                            if (!response.ok) {
                            console.log("API no response");;
                            }
                            return response.json();
                        })
                        .then(data => {
                            firebase.initializeApp(data);
                            messaging = firebase.messaging()
                            vapidkey = data.vapidkey;
                            messaging.getToken({vapidkey: vapidkey})
                                .then( (currentToken) => {
                                    if (currentToken) {
                                        fetch_options = {
                                            method: "POST",
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({'fcm_token': currentToken})
                                        }
                                        fetch('/save_token', fetch_options)
                                            .then(response => {
                                                // popup success message
                                            })
                                            .catch(error => {
                                                // popup error message
                                            })
                                    } else {
                                        console.log("no token");
                                    }
                                });
                        })
                        .catch(error => {
                            console.error('Fetch error:', error);
                        });
                }, 500);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
        }
    } else {
    console.log('no permission')
    }
});