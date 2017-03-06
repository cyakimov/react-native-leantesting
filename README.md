# Lean Testing - React-Native

In an effort to learn ES6/ES7 , Redux and React Native this is Lean Testing Native, a simple Lean Testing native client.

## iOS App Preview
![iOS Preview PNG 1](http://i.imgur.com/NTscJJn.png)

## Features/Components
- Uses React Native 0.41
- Uses Redux to manage state
- Authenticates with OAuth 2.0 using a WebView
- REST API calls
- Pull down to refresh ListView
- Pagination ListView
- Can take pictures / videos
- Can upload pictures / videos
- In-place edit forms
- Animations and transitions

## Conventions
### Folder Structure
All simple component files must be placed in src/components

All full screen component files must be placed in src/components/screens

### Props
Make sure to add `propTypes` for every component prop and `defaultProps` if such exist.