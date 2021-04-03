

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url] -->



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://easybase.io">
    <img src="https://easybase.io/assets/images/logo_black.png" alt="Logo" width="80" height="80" href="easybase logo black">
  </a>
</p>

<br />

<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/dw/easybasejs">
  <img alt="GitHub" src="https://img.shields.io/github/license/easybase/easybasejs">
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/easybasejs">
  <img alt="npm" src="https://img.shields.io/npm/v/easybasejs">
</p>

<br />

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Documentation](#documentation)
* [Types and Options](#types-and-options)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project



### Built With

* [microbundle](https://github.com/developit/microbundle)
* [webpack](https://webpack.js.org/)
* [cross-fetch](https://github.com/lquixada/cross-fetch)
* [Easybase.io](https://easybase.io)
* [object-observer](https://github.com/gullerya/object-observer)


<!-- GETTING STARTED -->
## Getting Started
Browser and Node.js compatible library for EasyBase. This library supports both the Easybase rest integrations (**GET**, **POST**, **UPDATE**, **DELETE**) and the **NODE** framework integration.

### Prerequisites

* npm for node projects
* *There are no prerequisites for usage in browser*

### Installation
* Node:
```sh
npm install easybasejs
```
* Browser:
```html
<head>
    ...
    <script src="https://cdn.jsdelivr.net/npm/easybasejs/dist/bundle.js"></script>
    ...
</head>

```

<!-- USAGE EXAMPLES -->
## Usage


### **NODE Framework**

The node framework integration creates a configurable database in your project that synchronizes remote changes and is editable via a live array. [Example walkthrough]() 

The *Frame()* function will point to your database and can be edited as a normal javascript array. Read more below.

<!-- // TODO: Add walkthrough and video --->

```javascript
import Easybase from "easybasejs";
import ebconfig from "./ebconfig"; // Download from NODE integration

// Initialize
const eb = Easybase.EasybaseProvider({ ebconfig });
eb.configureFrame({ limit: 10, offset: 0 });
await eb.sync(); // Normalize local and remote changes
console.log(eb.Frame());

// Edit entry
eb.Frame(2).rating = 10;
await eb.sync();
console.log(eb.Frame());

// Delete entry
eb.Frame().pop();
await eb.sync();
console.log(eb.Frame());

// Add example entry
eb.Frame().push({ app_name: "Glaseo", rating: 15, isUpdated: false });
await eb.sync();
console.log(eb.Frame());

// Next 10 entries
eb.configureFrame({ limit: 10, offset: 10 });
await eb.sync();
console.log(eb.Frame());
```

<br />

### **REST integrations**

* Node

```typescript
import Easybase from 'easybasejs';
const { get, post, update, Delete } = Easybase;

let offset = null;
const limit = 10;

const data = await get("s5aF3-8ne-DaG7K5x", offset, limit);

console.log(data); // [ { profile_picture, home, meeting_time }, { profile_picture, home, meeting_time }, ... ]
```

* Browser:
```javascript
var offset = null;
var limit = 10;

EasyBase.get("s5aF3-8ne-DaG7K5x", offset, limit)
    .then(data => {
        document.body.innerText = JSON.stringify(data);
    });
```

### **Cloud Functions**

The *EasybaseProvider* pattern is not necessary for invoking cloud functions, only *callFunction* is needed.
```jsx
import { callFunction } from 'easybase-react';

function App() {
    async function handleButtonClick() {
        const response = await callFunction("123456-YOUR-ROUTE", {
            hello: "world",
            message: "Find me in event.body"
        });

        console.log("Cloud function: " + response);
    }

    //...
}
```

Learn more about [deploying cloud functions here](https://easybase.io/react/2021/03/09/The-Easiest-Way-To-Deploy-Cloud-Functions-for-your-React-Projects/).

<!-- DOCUMENTATION EXAMPLES -->
## Documentation

Documentation for this library included in the `easybase-react` library [available here](https://easybase.io/docs/easybase-react/).

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/easybase/easybasejs/issues) for a list of proposed features (and known issues).


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/EasybaseFeature`)
3. Commit your Changes (`git commit -m 'feature'`)
4. Push to the Branch (`git push origin feature/EasybaseFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Your Name - [@easybase_io](https://twitter.com/easybase_io) - hello@easybase.io

Project Link: [https://github.com/easybase/easybasejs](https://github.com/easybase/easybasejs)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
<!-- [contributors-shield]: https://img.shields.io/github/contributors/easybase/repo.svg?style=flat-square
[contributors-url]: https://github.com/easybase/repo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/easybase/repo.svg?style=flat-square
[forks-url]: https://github.com/easybase/repo/network/members
[stars-shield]: https://img.shields.io/github/stars/easybase/repo.svg?style=flat-square
[stars-url]: https://github.com/easybase/repo/stargazers
[issues-shield]: https://img.shields.io/github/issues/easybase/repo.svg?style=flat-square
[issues-url]: https://github.com/easybase/repo/issues
[license-shield]: https://img.shields.io/github/license/easybase/repo.svg?style=flat-square
[license-url]: https://github.com/easybase/repo/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/easybase
[product-screenshot]: images/screenshot.png -->