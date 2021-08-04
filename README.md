# Overview
Example of a simple React Native app on Android that uses Couchbase Lite as embedded datastore for offline data storage and Sync Gateway/Couchbase Server for remote data sync.
The app uses a reference implementation of React Native Module that exposes a subset of couchbase lite APIs.

# Folder Overview

# standalone
This version of app demonstrates basic Database and Document CRUD operations using Couhbase Lite as a standalone, embedded database within your mobile app. A document is created and stored in a "user" Couchbase Lite database.


# query
This version of app extends the "standalone" version of the app and demonstrates basic query and full-text-search operations against Couhbase Lite database. In addition to the "user" database, this version of the app is bundled with a second "university" database pre-seeded with documents against which queries are issued.

# sync
This version of app extends the "query" version of the app and demonstrates basic database sync functionality. The app supports bi-directional sync with a remote Couchbase Server database through a Sync Gateway.

# Build Instructions
A step by step build guide of React Native Application of User Profile using [Couchabse Lite Native Module] (https://github.com/rajagp/couchbase-lite-react-native-module/tree/Phase1 “Github”) in Android.


First you will need to download [Couchabse Lite Native Module] (https://github.com/rajagp/couchbase-lite-react-native-module/tree/Phase1 “Github”) 

## Setup
1. Open android project in android studio you will be needed to update sdk and jdk path to your current system.
2. Android Studio will automatically update those setting and will update the indexes.
3. Once done, **Clean Build**
4. Then in project directory open terminal and run `npm install`.
    * This will install node modules into the project folder.
5. Then run yarn install "\{Couchabse Lite Native Module Package Path\}"
6. Then clean android build by following commands in terminal `cd android` then `./gradlew clean`.
7. Now you can connect your phone or run an emulator and then run the project by follwoing command in terminal `react-native run-android`.

## Pre-requisites
* NPM and Yarn command line must be installed globally into the system.

##  Build & Run
TBD
