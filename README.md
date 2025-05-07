# Calorie & Macro Tracker
This project is a Calorie & Macro Tracker web application that allows users to track the calories, protein, fats, and carbohydrates in the food they consume. The app uses the Nutritionix API to fetch nutritional information based on the food items and quantities entered by the user. Access it at https://hemanthnagaraj04.github.io/CalorieTracker/

# Features
* Food Search: Enter food items and quantities to get detailed nutritional information.

* Macro Tracker: Automatically calculate the total calories, protein, fats, and carbohydrates for all logged food items.

* Persistent Data: Food logs are saved in the browser’s local storage, so they persist across page reloads.

* Responsive UI: The application has a simple, user-friendly interface suitable for tracking meals throughout the day.

# Tech Stack
* Frontend: HTML, CSS, JavaScript

* Backend: Node.js with Express (for handling the API proxy)

* API: Nutritionix API (used to fetch food nutritional data)

* Hosting: GitHub Pages for frontend and Render for backend

# How It Works
## Frontend:

* Users enter a food item (e.g., "apple") and specify the quantity (e.g., "1").

* The app makes an API request to a proxy server (hosted on Render) to fetch nutritional information from the Nutritionix API.

* The app displays nutritional data such as calories, protein, fat, and carbs for the specified food.

## Backend:

* The backend server is built with Node.js and Express, acting as a middleman between the frontend and the Nutritionix API.

* Sensitive API keys are stored in an .env file to keep them secure.

## Local Storage:

* All logged food items and their nutritional data are stored in the browser's localStorage to ensure data persistence across sessions.

