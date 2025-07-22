# Niyam (नियम)

![Niyam Logo](https://placehold.co/1200x300/171717/FFFFFF?text=NIYAM&font=raleway)

**A free platform to make Nepali laws accessible, navigable, and understandable for everyone.**
Checkout [Website](https://niyam.dev)

[![Project Status: Active](https://img.shields.io/badge/status-active-success.svg)](https://github.com/axyut/niyam)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://golang.org/)

---

## 📖 Table of Contents

- [Niyam (नियम)](#niyam-नियम)
  - [📖 Table of Contents](#-table-of-contents)
  - [📍 About The Project](#-about-the-project)
    - [The Problem](#the-problem)
    - [Our Solution](#our-solution)
  - [✨ Key Features](#-key-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [🗺️ Roadmap](#️-roadmap)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [Acknowledgements](#acknowledgements)

---

## 📍 About The Project

**Niyam** is an ambitious final-year project designed to tackle a fundamental challenge within Nepal's legal landscape: the accessibility and comprehensibility of legal documents. The law serves as a cornerstone of society, yet legal texts are often intricate, filled with complex terminology, and extensively cross-referenced, making them difficult to navigate for citizens, legal professionals, and even policymakers.

### The Problem

> Legal writings are difficult to understand and navigate because they frequently relate to other laws or papers and depend heavily on internal references (such as "as indicated in section X, subject to subsection Y"). This creates a confusing web of information that is dispersed across multiple government websites and archives, lacking a unified, organized, and user-friendly system. This information overload hinders legal awareness, slows down research, and creates a barrier to civic engagement.

### Our Solution

Niyam aims to bridge this gap by creating an innovative, open-source digital platform. The system is designed to simplify Nepali legal documents by providing:

- User-friendly tools for navigating complex internal and external references.
- Clear, accessible information about legislative history.
- A structured, centralized repository for all legal content.

By enhancing the clarity, accessibility, and research capabilities of legal texts, Niyam empowers lawyers, Members of Parliament, students, and the general public, fostering a more informed and efficient engagement with Nepal's legal framework.

---

## ✨ Key Features

- **Intuitive Navigation:** Easily understand cross-referenced legal jargon with features like pop-up definitions and split-screen views.
- **Version Control & History:** Track the legislative history of laws with metadata on _when, why, and by whom_ provisions were introduced or amended.
- **Centralized Repository:** Access all Nepali laws and regulations from a single, structured platform.
- **Community Collaboration:** Engage in discussions, polls, and petitions on new bills and existing laws to foster public participation.
- **Personalized Notifications:** Follow specific legal topics and receive newsletter updates on relevant changes.
- **Bilingual Support:** Full support for both Nepali (नेपाली) and English interfaces.
- **Modern UI/UX:** A clean, responsive, and accessible design with light and dark modes.

---

## 🛠️ Tech Stack

This project leverages a modern, scalable technology stack to ensure performance and maintainability.

| Category               | Technology                                                   |
| :--------------------- | :----------------------------------------------------------- |
| **Frontend**           | [**Next.js**](https://nextjs.org/) (with React & TypeScript) |
| **Backend**            | [**Golang**](https://go.dev/)                                |
| **Database**           | [**MongoDB**](https://www.mongodb.com/) (NoSQL)              |
| **Document Scanning**  | [**Tesseract**](https://github.com/tesseract-ocr/tessdoc)    |
| **Document Formating** | [**Internal**](https://github.com/axyut/niyam)               |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/axyut/niyam.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd niyam
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```
4.  Run the development server:
    ```sh
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🗺️ Roadmap

- [x] **Phase 1: Project Foundation and Layout** - Setup, Theming, i18n
- [ ] **Phase 2: Component & Page Development**
- [ ] **Phase 3: Backend Integration**
- [ ] **Phase 4: Advanced Features like Document Scanning and Version Control**
- [ ] **Phase 5: Community Features and Notifications**
- [ ] **Phase 6: Testing, Optimization, and Deployment**
- [ ] **Phase 7: Documentation and Open Source Release**

See the open [issues](https://github.com/axyut/niyam/issues) for a full list of proposed features (and known issues).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Acknowledgements

This project is submitted for the fulfillment of the requirements for the Bachelors in Information Technology degree at Tribhuvan University, Birendra Multiple Campus.

While the frontend currently is open-source, the backend is not yet available. The backend is being developed in Golang and will be released soon. But the application will always be free to use.

<!--
// -----------------------------------------------------------------------------
// FILE: /src/lib/api-types.ts
// -----------------------------------------------------------------------------
// Description: This file will hold the TypeScript types generated from your
// niyam-api.json OpenAPI specification.
//
// HOW TO GENERATE:
// 1. Install openapi-typescript: `npm install -D openapi-typescript`
// 2. Run the command:
//    `npx openapi-typescript ./path/to/niyam-api.json -o ./src/lib/api-types.ts`
//
// This will automatically create all the necessary interfaces based on your API.
// For now, I'm adding a few placeholder types based on your file.
// -----------------------------------------------------------------------------
somechangestodeploy
 -->a
