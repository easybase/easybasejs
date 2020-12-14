

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

<br />

### **NODE Framework**:

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

### **REST integrations:**

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

<!-- DOCUMENTATION EXAMPLES -->
## Documentation

<br />

### **NODE Framework**:

### configureFrame(options: ConfigureFrameOptions): StatusResponse
Configure the current frame size. Set the offset and amount of records to retreive assume you don't want to receive your entire collection. This is useful for paging.

### sync(): Promise\<StatusResponse>
Call this method to syncronize your current changes with your database. Delections, additions, and changes will all be reflected by your backend after calling this method. Call Frame() after this to get a normalized array of the freshest data.

### Frame(index?: number): Record<string, any> | Record<string, any>[]
This function is how you access a single object your current frame. This function does not get new data or push changes to EasyBase. If you want to syncronize your frame and EasyBase, call sync() then Frame(). Passing an index will only return the object at that index in your Frame, rather than the entire array. This is useful for editing single objects based on an index.

### currentConfiguration(): FrameConfiguration
View your frames current configuration

<br />

*Note the below functions are isolated and do not have an effect on the synchronicity of Frame() as those above.*

<br />

### Query(options: QueryOptions): Promise<Record<string, any>[]>
Perform a query created in the Easybase Visual Query Builder by name. This returns an isolated array that has no effect on your frame or frame configuration. sync() and Frame() have no relationship with a Query(). An edited Query cannot be synced with your database, use Frame() for realtime database array features.

### fullTableSize(): Promise\<number>
Gets the number of records in your table.

### tableTypes(): Promise<Record<string, any>>
Retrieve an object detailing the columns in your table mapped to their corresponding type.

### updateRecordImage(options: UpdateRecordAttachmentOptions): Promise\<StatusResponse>
Upload an image to your backend and attach it to a specific record. columnName must reference a column of type 'image'. The file must have an extension of an image. Call sync() for fresh data with propery attachment links to cloud hosting.

### updateRecordVideo(options: UpdateRecordAttachmentOptions): Promise\<StatusResponse>
Upload a video to your backend and attach it to a specific record. columnName must reference a column of type 'video'. The file must have an extension of a video. Call sync() for fresh data with propery attachment links to cloud hosting.

### updateRecordFile(options: UpdateRecordAttachmentOptions): Promise\<StatusResponse>
Upload a file to your backend and attach it to a specific record. columnName must reference a column of type 'file'. Call sync() for fresh data with propery attachment links to cloud hosting.

### addRecord(options: AddRecordOptions): Promise\<StatusRespnse>
Manually add a record to your collection regardless of your current frame. You must call sync() after this to see updated response.

### deleteRecord(record: Record<string, any>): Promise\<StatusResponse>
Manually delete a record from your collection regardless of your current frame. You must call sync() after this to see updated response.

<br />

### **REST integrations**:

### get(options: GetOptions): Promise\<Array>
Get elements as detailed in **GET** integration

### post(options: PostOptions): Promise\<string>
Post single element as detailed in **POST** integration

### update(options: UpdateOptions): Promise\<string>
Updated element(s) as detailed in **UPDATE** integration

### Delete(options: DeleteOptions): Promise\<string>
Delete element(s) as detailed in **DELETE** integration

<br />

## Types and Options
### **NODE Framework**:
```ts
interface ConfigureFrameOptions {
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Set to -1 or null to return all records. Can be used in combination with offset. */
    limit?: number | null;
}

interface EasybaseProviderPropsOptions {
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** Log Easybase react status and events to console. */
    logging?: boolean;
}

interface EasybaseProviderProps {
    /** EasyBase ebconfig object. Can be downloaded in the integration drawer next to 'React Token'. This is automatically generated.  */
    ebconfig: Ebconfig;
    /** Optional configuration parameters. */
    options?: EasybaseProviderPropsOptions
}

interface FrameConfiguration {
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset: number;
    /** Limit the amount of records to be retrieved. Set to -1 or null to return all records. Can be used in combination with offset. */
    limit: number | null;
}

interface AddRecordOptions {
    /** If true, record will be inserted at the end of the collection rather than the front. Overwrites absoluteIndex. */
    insertAtEnd?: boolean;
    /** Values to post to EasyBase collection. Format is { column name: value } */
    newRecord: Record<string, any>;
}

interface QueryOptions {
    /** Name of the query saved in Easybase's Visual Query Builder */
    queryName: string;
    /** If you would like to sort the order of your query by a column. Pass the name of that column here */
    sortBy?: string;
    /** By default, columnToSortBy will sort your query by ascending value (1, 2, 3...). To sort by descending set this to true */
    descending?: boolean;
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Can be used in combination with offset. */
    limit?: number;
    /** This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50. Read more: https://easybase.io/about/2020/09/15/Customizing-query-values/ */
    customQuery?: Record<string, any>;
}

interface FileFromURI {
    /** Path on local device to the attachment. Usually received from react-native-image-picker or react-native-document-picker */
    uri: string,
    /** Name of the file with proper extension */
    name: string,
    /** File MIME type */
    type: string
}

interface UpdateRecordAttachmentOptions {
    /** EasyBase Record to attach this attachment to */
    record: Record<string, any>;
    /** The name of the column that is of type file/image/video */
    columnName: string;
    /** Either an HTML File element containing the correct type of attachment or a FileFromURI object for React Native instances.
     * For React Native use libraries such as react-native-image-picker and react-native-document-picker.
     * The file name must have a proper file extension corresponding to the attachment. 
     */
    attachment: File | FileFromURI;
}

interface StatusResponse {
    /** Returns true if the operation was successful */
    success: boolean;
    /** Readable description of the the operation's status */
    message: string;
    /** Will represent a corresponding error if an error was thrown during the operation. */
    error?: Error;
}
```

### **REST integrations**:
```ts
interface GetOptions {
    /** EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.  */
    integrationID: string;
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Can be used in combination with offset. */
    limit?: number;
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50. */
    customQuery?: Record<string, unknown>;
}

interface PostOptions {
    /** EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.  */
    integrationID: string;
    /** Values to post to EasyBase collection. Format is { column name: value } */
    newRecord: Record<string, unknown>;
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** If true, record will be inserted at the end of the collection rather than the front. */
    insertAtEnd?: boolean;
}

interface UpdateOptions {
    /** EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.  */
    integrationID: string;
    /** Values to update records with. Format is { column_name: new value } */
    updateValues: Record<string, unknown>;
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50. */
    customQuery?: Record<string, unknown>;
}

interface DeleteOptions {
    /** EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.  */
    integrationID: string;
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50. */
    customQuery?: Record<string, unknown>;
}
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