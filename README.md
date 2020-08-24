

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
  <a href="https://github.com/easybase/easybasejs">
    <img src="https://easybase.io/assets/images/logo_black.png" alt="Logo" width="80" height="80">
  </a>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project



### Built With

* [babel](https://babeljs.io/)
* [webpack](https://webpack.js.org/)
* [axios](https://github.com/axios/axios)



<!-- GETTING STARTED -->
## Getting Started
Browser and Node.js compatible library for EasyBase. Although this library is not necessary to interface with EasyBase via javascript, it makes integration much simpler.

### Prerequisites

* npm

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
### Node
* ES5:
```js
var { get, post, update, Delete } = require('easybasejs');

const offset = null;
const limit = 10;
EasyBase.get("s5aF3-8ne-DaG7K5x", offset, limit)
    .then(data => {
        console.log(data); // [ { profile_picture, home, meeting_time }, { profile_picture, home, meeting_time }, ... ]
    });
```
* ES6:
```js
import { get, post, update, Delete } from 'easybasejs';

const offset = null;
const limit = 10;

(async  () => {

    const data = await get("s5aF3-8ne-DaG7K5x", offset, limit)
    console.log(data); // [ { profile_picture, home, meeting_time }, { profile_picture, home, meeting_time }, ... ]

})();
```


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