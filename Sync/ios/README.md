# App Functionality

This version of app extends the "query" version of the app and demonstrates basic database sync functionality. The app supports bi-directional sync with a remote Couchbase Server database through a [Sync Gateway](https://docs.couchbase.com/couchbase-lite/3.0/android/replication.html).

Couchbase Sync Gateway is a key component of the Couchbase Mobile stack. It is an Internet-facing synchronization mechanism that securely syncs data across devices as well as between devices and the cloud. 

The core functions of the Sync Gateway include

* Data Synchronization across devices and the cloud
* Authorization & Access Control
* Data Validation

This app does the following

* Allows users to log in and create or update his/her user profile information. The user profile view is automatically updated everytime the profile information changes in the underlying database

* The user profile information is synced with a remote Sync Gateway which then syncs it to other devices (subject to access control and routing configurations specified in the sync function)

# Try It Out #1

* Launch the app on two simulators (or devices)
* Log into both the app with same userId and password. Use the values "demo3@example.com" and "password" for user Id and password fields respectively
* On one device, update profile values
* Confirm that changes show up in the app on the other simulator.


![](https://blog.couchbase.com/wp-content/uploads/2022/03/ios-sync.gif)

# Try It Out #2

The follow steps must follow the steps in the previous "Try It Out" section

* Log into Couchbase Server by accessing the admin UI at `http://localhost:8091`
* Search for document with ID `"user::demo3@example.com"`. 
* Edit the document
* Confirm that the changes show up on the clients

![](https://blog.couchbase.com/wp-content/uploads/2022/03/reactnative-ios-sync-2.gif)

