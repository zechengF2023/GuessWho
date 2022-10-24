The content below is an example project proposal / requirements document. Replace the text below the lines marked "__TODO__" with details specific to your project. Remove the "TODO" lines.

(__TODO__: your project name)

# Guess Who 

## Overview

This project is an online multiplayer game suitable for party. A group of players will be prompted with questions about themselves. Their answers will then be gathered and displayed back on the screen for others to guess. Those successfully figure out the writer will score, and after several rounds, the player with the highest score wins!

## Data Model

The application will store Questions and Users. 
* questions will have fields "content"
* users will have fields "username", "hash", "wins", and "friends"(a list of users)

An Example Question: 

```javascript
{
  content: "How old are you"
}
```

An Example User:

```javascript
{
  username: "Guo",
  hash: // a password hash,
  wins: //number of wins,
  friends: // an array of ObjectIds of other Users
}
```

## [Link to Commented First Draft Schema](db.mjs) 

(__TODO__: create a first draft of your Schemas in db.mjs and link to it)

## Wireframes

/home - home page
![list home](wireframes/home.png)

/login - page for login
![list login](wireframes/login.png)

/profile - page for user profile
![list profile](wireframes/profile.png)

/about - page for About
![list about](wireframes/about.png)

/help - page for Help
![list help](wireframes/help.png)

/waitingroom - page when user is waiting
![list waitingroom](wireframes/waitingroom.png)

/room - pages for different stages of a game
![list room1](wireframes/room1.png)
![list room2](wireframes/room2.png)
![list room3](wireframes/room3.png)

## Site map

![sitemap](wireframes/site_map.png)

## User Stories or Use Cases

(__TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://en.wikipedia.org/wiki/Use_case))

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new grocery list
4. as a user, I can view all of the grocery lists I've created in a single list
5. as a user, I can add items to an existing grocery list
6. as a user, I can cross off items in an existing grocery list

## Research Topics

(__TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed)

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
    * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (4 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom
* (5 points) vue.js
    * used vue.js as the frontend framework; it's a challenging library to learn, so I've assigned it 5 points

10 points total out of 8 required points (___TODO__: addtional points will __not__ count for extra credit)


## [Link to Initial Main Project File](app.mjs) 

(__TODO__: create a skeleton Express application with a package.json, app.mjs, views folder, etc. ... and link to your initial app.mjs)

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)

