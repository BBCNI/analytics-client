 ## Rewind Analytics
 Rewind Analytics is a user tracking tool used to provide business insights into how audiences are using our products.

 ### Minimum Setup
 The following 3 steps are the minimal setup for analytics, and will enable tracking of:
 - Visit count
 - Engagement time
 - Browser breakdown
 - Referrer breakdown
 - Country breakdown

 #### 1. Install
 Install the package using NPM:
 ```
 npm install --save git+ssh://git@github.com/BBCNI/analytics-client.git
 ```
 #### 2. Import
 Import the module to your application:
 ```javascript
 import analytics from 'rewind-analytics';
 ```
 #### 3. Initialise
 Call `analytics.init()` to initialise stat tracking, passing a unique `projectName` to identify your project.
 ```javascript
 analytics.init({
     projectName: 'canvas'
 });
 ```

 ### API
 #### `analytics.init()`
 `analytics.init` should be the first method called.  It initialses the analytics module, which will set up values that will be used for all future calls.  The object passed to `init` can have the following properties:
 - `projectName` (required) - the unique name of your project
 - `pageName` (optional) - when your project has multiple pages, this will enable analytics to differentiate between them
 - *other arbitrary data* - `init` will save any other arbitrary data that is passed to it.  This could be data relevent to your application, for use in future reporting - eg, the name of the currently logged in user

 ```javascript
 analytics.init({
     projectName: 'canvas',
     pageName: 'The Art of War',

     // Other arbitrary data
     user: currentUser.name,
     somethingElse: 'blah'
 });
 ```

 `init` can be called multiple times in a single session.  An example where this could be useful would be to change the `pageName` in a single page application.

 #### `analytics.count()`
 `analytics.count` allows the tracking of custom events, specific to your application.  `count` is used to track stats based on the amount of times a specific user action is completed, and it supports the following properties:
 - `eventName` (required) - the unique name of the event you want to track
 - `unique` (optional - default: `false`) - whether this event should only be counted once per session
 - *other arbitrary data* - `count` will save any other keys / values that are passed to it.  This could be data relevent to your application or the specific event being tracked, for use in future reporting - eg, the name of the currently logged in user

 ```javascript
 analytics.count({
     eventName: 'Rated a post',

     // Other arbitrary data
     user: currentUser.name,
     postRated: currentPost.title,
     rating: 5
 });
 ```