importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

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

        messaging.onBackgroundMessage(function(payload) {
            if (!payload.hasOwnProperty('notification')) {
                const notificationTitle = payload.data.title
                const notificationOptions = {
                    body: payload.data.body,
                    icon: payload.data.icon,
                    image: payload.data.image,
                    data: {
                        click_action: payload.data.click_action
                    }
                }
                self.registration.showNotification(notificationTitle, notificationOptions);
            }
        })
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });


self.addEventListener('notificationclick', function(event) {
    console.log("On notification clicked ")
    const clickedNotification = event.notification
    clickedNotification.close();
    event.waitUntil(
        clients.openWindow(clickedNotification.data.click_action)
    )
})

self.addEventListener('push', function(event) {
    console.log('push event');
})

self.addEventListener('pushsubscriptionchange', function(event) {
    console.log('pushsubscriptionchange event');
})