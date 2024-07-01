# CRUD Template - Web Frontend - Redux Toolkit

This repository is an optional frontend starter for new DALI React projects. Installation and setup instructions are included below. You should eventually customize this README file with project-specific documentation.

## Designs

[Screenshot description]

[Link to the project Figma]()

[2-4 screenshots from the app]

## Architecture
### Tech Stack
- [React v18](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [axios](https://github.com/axios/axios)
- [React Router v6](https://reactrouter.com/en/main)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/)

#### External Packages
- [Description of any notable added services]

### Style
[Describe notable code style conventions]

We are using [typically a configuration like [CS52's React-Native ESLint Configuration](https://gist.github.com/timofei7/c8df5cc69f44127afb48f5d1dffb6c84) or [CS52's ES6 and Node ESLint Configuration](https://gist.github.com/timofei7/21ac43d41e506429495c7368f0b40cc7)]

### File Structure
    .
    ├── ...    
    ├── public
    ├── src                
    │   └── assets             # static assets   
    │   └── components         # reusable components across several screens
    │   └── hooks              # useAppDispatch, useAppSelector
    │   └── redux              # Redux store and setup
    │   └── screens            # individual pages
    │   └── utils              # utility folder containing helper files
    ├── tsconfig.json          # TypeScript configuration
    ├── package.json           # yarn config
    └── ...

For more detailed documentation on our file structure and specific functions in the code, feel free to check the project files themselves.

## Available Scripts

In the project directory, you can run:

### `yarn install`

Installs project dependencies.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `yarn run lint`

ESLint is set up in this project. To keep code clean, always remember to run `yarn run lint` and fix any lint problems before merging into master.

## Deployment
[Where is the app deployed? i.e. Expo, Surge, TestFlight etc.]

[What are the steps to re-deploy the project with any new changes?]

[How does one get access to the deployed project?]

## Authors
* Firstname Lastname 'YY, role

## Acknowledgments
We would like to thank [anyone you would like to acknowledge] for [what you would like to acknowledge them for].

---
Designed and developed by [@DALI Lab](https://github.com/dali-lab)

### Template

- Eric Lu '25

Additional credit goes to Adam McQuilkin '22,  Thomas Monfre '21, Tyler Vergho '23 for developing the original DALI [CRUD Template Frontend](https://github.com/dali-lab/crud-template-frontend), which this starter pack was evolved from.
