# Angul-It

An interactive multi-stage CAPTCHA web app that challenges users with visual and logic tasks, then summarizes their performance at the end.

**Live Demo**
`https://angulit.netlify.app`

**Overview**
Angul-It is a single-page Angular application built to simulate real-world CAPTCHA flows. Users progress through multiple challenge stages, with validation at each step and persistent progress using local storage. The UI is responsive and focused on clarity and speed.

**Features**
- Multi-stage CAPTCHA flow with previous and next navigation
- Image selection challenge with visual feedback
- Math equation challenge with validation
- Text input challenge with validation
- Progress persistence via local storage
- Results summary with restart capability
- Responsive layout for desktop and mobile

**Tech Stack**
- Angular 21 (standalone components)
- TypeScript
- RxJS
- SCSS
- Tailwind CSS utilities

**Screenshots**
Hero Page
![Hero Page](public/screenshots/Screenshot%20of%20heropage.png)

Captcha Page
![Captcha Page](public/screenshots/Screenshot%20of%20captchapage.png)

Result Page
![Result Page](public/screenshots/Screenshot%20of%20resultpage.png)

**Getting Started**
Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

Run unit tests:

```bash
npm run test
```

**Project Structure**
- `src/app/features` contains feature pages and challenge components
- `src/app/core` contains services and shared models
- `src/app/shared` contains shared UI components
- `public/` contains static assets

**Notes**
- User progress is stored in local storage under the key `angul-it:attempt`.
