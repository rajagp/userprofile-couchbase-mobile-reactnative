# Overview
Example of a simple React Native app on Android that uses Couchbase Lite as embedded datastore for offline data storage and Sync Gateway/Couchbase Server for remote data sync.
The app uses a [reference implementation of React Native Module](https://github.com/rajagp/couchbase-lite-react-native-module) that exposes a subset of couchbase lite APIs.

LICENSE: The source code for the app is Apache-licensed, as specified in LICENSE. However, the usage of Couchbase Lite will be guided by the terms and conditions specified in Couchbase's Enterprise or Community License agreements.

# Folder Overview

# standalone
This version of app demonstrates basic Database and Document CRUD operations using Couhbase Lite as a standalone, embedded database within your mobile app. A document is created and stored in a "user" Couchbase Lite database.

For details, refer to the README in the "standalone" folder of the repo.

# query
This version of app extends the "standalone" version of the app and demonstrates basic query and full-text-search operations against Couhbase Lite database. In addition to the "user" database, this version of the app is bundled with a second "university" database pre-seeded with documents against which queries are issued.

For details, refer to the README in the "query" folder of the repo.

# sync
This version of app extends the "query" version of the app and demonstrates basic database sync functionality. The app supports bi-directional sync with a remote Couchbase Server database through a Sync Gateway.

For details, refer to the README in the "sync" folder of the repo.

# Getting Started

## Pre-requisites
* [React Native Development Tools](https://reactnative.dev/docs/environment-setup). 
    * Install Node v12 or newer. This includes npx.
* npm v6.14+ (installed globally)
* yarn version 1.22+ (installed globally)
* [Android Studio 4.1 or above](https://developer.android.com/studio)
* Android device or emulator running API level 29 or above
* Android SDK 29
* Android Build Tools 29
* [JDK 8 (min)](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 


## Build Instructions

* clone repository
```
git clone https://github.com/rajagp/userprofile-couchbase-mobile-reactnative-android
```
* Go to the directory containing the appropriate version of app. For example, for the "standalone" version of app, switch to standalone folder, for the "query" version o app, switch to "query" folder and so on.
```
cd  /path/to/cloned-repo/standalone

```
* Install dependencies 
 
 ```
 npm install
 ```
 
* Install couchbase lite react native plugin. For this, follow [instructions](https://github.com/rajagp/couchbase-lite-react-native-module/) to add the module to the project. Instructions are repeated here for convenience. In case of discrepencies, refer to the module repo.
 
 ```bash
 yarn add https://github.com/rajagp/couchbase-lite-react-native-module
 
 ```
 
* Add native couchbase lite framework as a dependency

The module does not come bundled with the couchbase lite framework. You will have to include the appropriately licensed Couchbase Lite Android library as dependency within your app.
 
The React native reference module requires minimal version of **Couchbase Lite v3.0.0**. 

Couchbase Lite can be downloaded from Couchbase [downloads](https://www.couchbase.com/downloads) page or can be pulled in via maven as described in [Couchbase Lite Android Getting Started Guides](https://docs.couchbase.com/couchbase-lite/current/android/gs-install.html).

We discuss the steps to add the Couchbase Lite framework dependency depending on how you downloaded the framework. 

* Open the Android project located inside your React Native project under directory: `/path/to/userprofile-couchbase-mobile-reactnative-android/android` using Android Studio.


**Option1: Include couchbase-lite-android sdk from maven**

Follow the instructions in [Couchbase Lite Android Getting Started Guides](https://docs.couchbase.com/couchbase-lite/current/android/gs-install.html) for URL to maven repository.

- In your 'app' level `build.gradle` file, add your library file path. 
 ```
 dependencies {
    implementation 'com.couchbase.lite:couchbase-lite-android:${version}'
 }
```


- In your 'project' level `build.gradle` file, add your library file path. 

```
 buildscript {
    ...
    ext {
        ...
        // Add this line
        cblVersion = 'com.couchbase.lite:couchbase-lite-android:${version}'
        ...
        }
    ...
}
```

**Option2: To add couchbase-lite-android as an .aar file**

* Create a a new directory called 'libs' under your "**/path/to/userprofile-couchbase-mobile-reactnative-android/android/app**" folder
* Copy the .aar files from within your downloaded Couchbase Lite package into the newly created'libs' folder
```bash
cd /path/to/userprofile-couchbase-mobile-reactnative-android/android/app

mkdir libs

cp ~/path/to/couchbase-lite-android-ee-3.0.0.aar libs/ 
```


* In Android Studio, navigate to the "project structure" in order to add  couchbase lite library as a dependency.

![](https://blog.couchbase.com/wp-content/uploads/2021/09/project-structure.png)

* Add "lib/couchbase-lite-android-ee-3.0.0.aar" as dependency to the couchbase lite React native module

![](https://blog.couchbase.com/wp-content/uploads/2021/09/adding-library-react-native.png)

* Your dependency tree would look something like this

![](https://blog.couchbase.com/wp-content/uploads/2021/09/dependency-tree.png)

* In your 'Project' level `build.gradle` file, add the "libs" directory path using "flatDir"
```
allprojects {
    repositories {
        mavenLocal()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url("$rootDir/../node_modules/react-native/android")
        }
        maven {
            // Android JSC is installed from npm
            url("$rootDir/../node_modules/jsc-android/dist")
        }

        google()
        jcenter()
        maven { url 'https://www.jitpack.io' }
        flatDir {
            dirs 'libs'
        }
    }
}
```

* In your 'app' level `build.gradle` file, add Couchbase Lite library under dependencies. 
```bash
dependencies {
    implementation fileTree(dir: "libs", include: ["*.jar"])
    implementation files('com.couchbase.couchbase-lite-android-ee-3.0.0')

}
```
##  Running the App
Build and run the app per instructions in [Getting Started Guide]("https://reactnative.dev/docs/environment-setup"). You can run the app direcly from Android Studio or from command line.

Don't forget to start the Metro bundler before running your app!

```bash
npx react-native start
```



## Updates to Native Module

If you update the plugin such as adding a new API, don't forget to  remove the plugin and re-add it to the app. 

* Removing the module
```bash
yarn remove react-native-cblite
```

* Adding the module
```bash
yarn add https://github.com/rajagp/couchbase-lite-react-native-module
```
**Troubleshooting Tip**:

 On occasion.  if the app isn't recognizing the latest plugin changes it may help to do a complete clean
  - remove the root level `node_modules` folder
  - Run "npm install"
  - Repeat the steps to add the module and couchbase lite package.




