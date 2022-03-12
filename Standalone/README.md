# Overview
Example of a simple React Native app that uses Couchbase Lite as the embedded datastore for offline data storage.
The app uses a reference implementation of a React Ntive plugin that exports a subset of couchbase lite native APIs to Javascript.


**LICENSE**: The source code for the app and React Native plugin is Apache-licensed, as specified in LICENSE. However, the usage of Couchbase Lite will be guided by the terms and conditions specified in Couchbase's Enterprise or Community License agreements.

# App Functionality

This app demonstrates basic Database and Document CRUD operations using Couchbase Lite as a standalone, embedded database within your mobile app. A document is created and stored in a "user" Couchbase Lite database.

# Data Model
Couchbase Lite is a JSON Document Store. A Document is a logical collection of named fields and values.The values are any valid JSON types. In addition to the standard JSON types, Couchbase Lite supports Date and Blob data types. While it is not required or enforced, it is a recommended practice to include a "type" property that can serve as a namespace for related documents.

## The "User Profile" Document
The app deals with a single document with a "type" property of "user". The document ID is of the form **"user::<email>"**. 

An example of a document would be
```json
{
    "type":"user",
    "name":"Jane Doe",
    "email":"jame.doe@earth.org",
    "address":"101 Main Street",
    "profilePic": << Blob Metadata >> 
}
```
The profilePic holds metadata of the binary image data associated with the document

# Try it Out
* Launch the app
* Log into the app with any email Id and password. Use the values "demo@example.com" and "password" for user Id and password fields respectively. 
* If this is the first time that the user is signing in, a new Couchbase Lite database will be created. On subsequent login, the user’s existing database will be opened.
* Enter a "name" for the user and address and select a profile image and Tap "Done"
* Confirm that you see an alert message "Succesfully Updated Profile". The first time, you update the profile screen, the userprofile document will be created in the database


![](https://blog.couchbase.com/wp-content/uploads/2021/11/reactnative-standalone-1.gif)

* Now tap on the profile image and select an image from the Photo Album. Tap "Done".
* Confirm that you see an alert message "Succesfully Updated Profile".

![](https://blog.couchbase.com/wp-content/uploads/2021/11/reactnative-standalone-2.gif)

* Log off from app by tapping "Log out" icon buttoin top navigation bar
* Log back into the app with the same user email Id and password that you used earlier. In my example, I used "demo@example.com" and "password". So I will log in with those credentials again.
* Confirm that you see the profile screen with the name and image values that you set earlier. The userprofile document that was created and saved earlier is loaded from the database.

![](https://blog.couchbase.com/wp-content/uploads/2021/11/reactnative-standalone-3.gif)
