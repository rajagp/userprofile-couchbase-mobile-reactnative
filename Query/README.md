# Overview
Example of a simple React Native app that uses Couchbase Lite as embedded datastore for offline data storage. 
The app uses a reference implementation of a React Native plugin that exports a subset of couchbase lite native APIs to Javascript.

**LICENSE**: The source code for the app and React Native plugin is Apache-licensed, as specified in LICENSE. However, the usage of Couchbase Lite will be guided by the terms and conditions specified in Couchbase's Enterprise or Community License agreements.

# App Functionality

This version of app extends the "standalone" version of the app and demonstrates basic database [query](https://docs.couchbase.com/couchbase-lite/3.0/android/query-n1ql-mobile.html) and [full-text-search](https://docs.couchbase.com/couchbase-lite/3.0/android/fts.html) operations against Couhbase Lite database. In addition to the "user" database, this version of the app is bundled with a second "university" database pre-seeded with documents against which queries are issued. You can learn more about [prebuilt database](https://docs.couchbase.com/couchbase-lite/3.0/android/prebuilt-database.html). 

This app does the following

* Allows users to log in and create or update his/her user profile information. You could do that in the "standalone" version of the app

* As part of profile information, users can now selecting a "university" from a list of possible options

The list of matching univerisities is queried (using the new Query API) from a local prebuilt "University" Couchbase Lite Database that is bundled in the app. The user profile information is persisted as a Document in the local Couchbase Lite Database. So subsquently, when the user logs out and logs back in again, the profile information is loaded from the Database.

# Data Model
Couchbase Lite is a JSON Document Store. A Document is a logical collection of named fields and values.The values are any valid JSON types. In addition to the standard JSON types, Couchbase Lite supports Date and Blob data types. While it is not required or enforced, it is a recommended practice to include a "type" property that can serve as a namespace for related documents.

##  The "User Profile" Document
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
The `profilePic` holds metadata of the binary image data associated with the document

## The "University" Document
The app comes bundled with a collection of Documents of type "university". Each Document represents a university.

```json
{
    "type":"university","web_pages": [
      "http://www.rpi.edu/"
    ],
    "name": "Rensselaer Polytechnic Institute",
    "alpha_two_code": "US",
    "state-province": null,
    "domains": [
      "rpi.edu"
    ],
    "country": "United States"
}
```
# Using a Prebuilt Database
There are several reasons why you may want to bundle your app with a prebuilt database. This would be suited for data that does not change or change that often, so you can avoid the bandwidth and latency involved in fetching/syncing this data from a remote server. This also improves the overall user experience by reducing the start-up time.

In our app, the instance of Couchbase Lite that holds the preloaded "university" data is separate from the Couchbase Lite instance that holds "user" data. A separate Couchbase Lite instance is not required. However, in our case, since there can be many users potentially using the app on a given device, it makes more sense to keep it separate. This is to avoid duplication of pre-loaded data for every user.

## Location of the prebuilt file
The pre-built database will be in the form of a cblite file. It should be be in your app project bundle

In the project explorer, locate the `universities.zip` file. The zip archive includes the "universities.cblite" database file.

![](https://blog.couchbase.com/wp-content/uploads/2021/11/prebuilt.png)

# Try it Out
* Launch the app
* Log into the app with any email Id and password. Use the values "demo@example.com" and "password" for user Id and password fields respectively. 
* If this is the first time that any user is signing in to the app, the pre-built database will be loaded from the App Bundle. In addition, new user-specific Database will be created/opened. On subsequent login, the user’s existing user database will be opened. The prebuilt database is shared across all users of the app. 
* Tap on "CHoose" option from profile screen
* You should see a screen show that allows you enter the search criteria for the university
* Enter "Harv" for name. You can optionally enter "united states" for location
* Confirm that you see a list of universities that match the criteria
* Select a university
* Press "Done" button
* Confirm that the university you selected shows up in the University entry
* You can optionally update the other entries in the User Profile screen
* Tap "Done" button
* Confirm that you see an alert message "Succesfully Updated Profile". The Document will be updated this time.
![](https://blog.couchbase.com/wp-content/uploads/2021/11/reactnative-query-1.gif)

* Tap "Log Off" icon  and log out of the app
* Log back into the app with the same user email Id and password that you used earlier. In my example, I used "demo@example.com" and "password". So I will log in with those credentials again.
* Confirm that you see the profile screen with the university value that you set earlier.

![](https://blog.couchbase.com/wp-content/uploads/2021/11/reactnative-query-2.gif)
