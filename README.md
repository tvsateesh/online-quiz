# Online Quiz & Games Platform

An interactive Angular-based platform featuring multiple games and quizzes including Chess with AI difficulty levels, Checkers, and Quiz challenges.

## Features

- 🎮 **Chess Game**: Play against computer AI with three difficulty levels (Easy, Medium, Hard)
  - Full chess rules implementation (castling, en passant, promotion)
  - Check and checkmate detection
  - Minimax algorithm with alpha-beta pruning for Hard mode
- 🎲 **Checkers Game**: Classic checkers gameplay
- 📝 **Quiz System**: Interactive quiz functionality

## Quick Start

### Development Server

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200/`

### Production Build

```bash
npm run build
npm start
```

Server runs on `http://localhost:5000`

## Deployment

### Deploy to Render.com

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for complete deployment guide.

**Quick Deploy:**

1. Push to GitHub
2. Connect to [Render.com](https://render.com)
3. Create new Web Service
4. Configure:
   - Build: `npm install && npm run build`
   - Start: `npm start`
5. Deploy! 🚀

Or use the included `render.yaml` for one-click deployment.

---

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
