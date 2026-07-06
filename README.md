# Noble Addis

**Noble Addis** is a machine learning supported real estate review platform for Addis Ababa. It helps property buyers review listings before negotiation by combining price estimation, negotiation guidance, suspicious listing signals, location context, saved review history, and admin monitoring.

This project is submitted under the **ML Track**. The machine learning workflow supports the main product, while the deployed web application shows how the model outputs can be used in a practical real estate decision-support platform.

---

## Live Project Links

**Live Deployed Application:**  
https://nobleaddis.vercel.app

**GitHub Repository:**  
https://github.com/Solomon-the-octave/Nobleaddis

**Demo Video:**  
https://drive.google.com/file/d/12gAV8YA6IBqlWE_FarrfHLgEdLgh9__S/view?usp=drive_link

---

## Project Overview

Property buyers often struggle to know whether a listing is fairly priced, complete, or safe to continue with. This is even harder for remote or cross-border buyers who may not be able to visit the property immediately. Some listings may have missing information, unclear location details, unrealistic prices, or weak supporting evidence.

Noble Addis was built to support early-stage property review. A user can enter property details, run a review, and receive an estimated property value, negotiation range, price signal, and suspicious listing review. The goal is not to replace professional valuation, legal review, or physical site verification. Instead, the platform helps buyers become more informed before contacting an agent, visiting a property, or making payment.

The platform also includes saved review history, a help/support page, an admin dashboard, light and dark mode, and a responsive mobile-friendly interface.

---

## Main Objectives

The main objectives of Noble Addis are to:

1. Build a working real estate review platform for Addis Ababa property buyers.
2. Use machine learning models to support property price estimation and suspicious listing review.
3. Provide negotiation guidance based on the estimated value of a property.
4. Help users identify listings that may need closer verification.
5. Allow users to save and compare property review results.
6. Create an admin dashboard for monitoring platform activity.
7. Deploy the full product online so it can be accessed through a public link.

---

## Core Features

### User Features

- User sign up and login
- Forgot password option
- Property review form
- Price estimate
- Negotiation range
- Price signal
- Suspicious listing review
- Buyer guidance
- Location and map preview
- Saved property review history
- Search and filter saved reviews
- Help/support request form
- Light and dark mode
- Mobile responsive interface

### Admin Features

- Admin login
- Admin overview dashboard
- View platform activity
- View submitted/listed property checks
- View saved property reviews
- View suspicious or high-caution checks
- View support requests
- Sign out functionality

---

## Demo Admin Login

Admin dashboard link:

```text
https://nobleaddis.vercel.app/admin/login
```

Demo admin credentials:

```text
Email: admin@nobleaddis.com
Password: nobleaddis123
```

---

## Machine Learning Approach

Noble Addis uses supervised machine learning models to support property review.

The project includes two main model tasks:

1. **Property price prediction**
2. **Suspicious listing detection**

The model outputs are used inside the web platform to give users a clearer view of whether a property price looks reasonable and whether the listing may need extra caution.

---

## Dataset

The project uses Addis Ababa property listing data for academic model training and testing. The dataset includes property-level fields such as:

- Property type
- Listing type
- Location
- Latitude and longitude
- Listed price
- Size in square meters
- Bedrooms
- Bathrooms
- Image count
- Description length
- Completeness score
- Property condition
- Furnishing status

Private seller contact details were not used as part of the model workflow.

Main dataset and sample data files are stored in:

```text
data/
```

Model files and model metrics are stored in:

```text
models/
```

---

## Model Features

The models use features such as:

- Property type
- Listing type
- Size in square meters
- Latitude
- Longitude
- Number of bedrooms
- Number of bathrooms
- Image count
- Description length
- Whether the listing has an image
- Completeness score
- Property condition
- Furnishing status

These features help the system estimate property value and identify unusual listing patterns.

---

## Model Architecture

The machine learning pipeline follows this structure:

```text
Property listing data
→ Data cleaning
→ Feature preparation
→ Categorical and numeric feature handling
→ Model training
→ Model evaluation
→ Model export
→ FastAPI model API
→ Next.js web application
```

### Price Prediction Model

The price prediction model estimates the likely value of a property based on listing details.

```text
Model: Small Random Forest Regressor
Target: Property price
Rows used: 85,400
R² score: Approximately 0.745
MAE: Approximately 3,294,083
RMSE: Approximately 6,631,324
```

The Small Random Forest Regressor was selected because it provided a reasonable balance between model performance and deployment stability. It was also lightweight enough to serve through the deployed model API.

### Suspicious Listing Detection Model

The suspicious listing model reviews listing patterns and returns a caution signal.

```text
Model: Decision Tree Classifier
Purpose: Suspicious listing detection
Output: Listing risk/caution signal
```

The suspicious listing result does not prove fraud. It only means the listing should receive additional verification before the buyer continues.

---

## Model Outputs Used in the Platform

When a user submits a property review, the platform returns:

- Estimated property value
- Negotiation low range
- Negotiation high range
- Price signal
- Price gap percentage
- Risk level
- Risk score
- Buyer guidance
- Price per square meter
- Model source

This makes the machine learning output practical and understandable for users.

---

## Important Note About Model Results

The model results are decision-support signals, not final property valuations. Real estate prices can be affected by many factors that may not be fully captured in the dataset, such as exact building condition, legal status, seller urgency, road access, neighborhood demand, and real-time market changes.

Because of this, Noble Addis encourages users to verify ownership documents, seller identity, exact location, and property condition before making any payment or final decision.

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- CSS
- Lucide React icons

### Backend

- Next.js API routes
- Prisma ORM
- Supabase PostgreSQL database

### Machine Learning API

- Python
- FastAPI
- Scikit-learn
- Joblib/Pickle model files

### Deployment

- Vercel for the main web application
- Render for the machine learning model API
- Supabase for the production database
- GitHub for version control

---

## System Architecture

Noble Addis uses a full-stack deployment setup:

```text
User
→ Next.js frontend
→ Next.js backend/API routes
→ FastAPI model API
→ Machine learning models
→ Prediction response
→ User interface result cards
→ Supabase database through Prisma
→ Admin dashboard
```

The web application is deployed on Vercel. The model API is deployed separately on Render. Supabase is used as the production database.

---

## Main Project Structure

```text
app/
  Main Next.js application routes and pages

app/api/
  Backend API routes for authentication, reports, support, and predictions

app/evaluate/
  Property review/check listing page

app/reports/
  Saved user history page

app/help/
  Help and support page

app/admin/
  Admin dashboard and admin pages

components/
  Reusable UI components such as Navbar, Footer, PropertyForm, ResultCards, MapView, and ThemeToggle

lib/
  Helper functions for authentication, Prisma, sample data, and prediction logic

prisma/
  Prisma database schema

model_api/
  FastAPI machine learning API

models/
  Trained model files and model metrics

data/
  Dataset and sample listing files

public/
  Brand assets, images, and static files
```

---

## Installation and Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Solomon-the-octave/Nobleaddis.git
cd Nobleaddis
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` or `.env.local` file in the root folder.

Example:

```env
DATABASE_URL="your_supabase_database_url"
MODEL_API_URL="https://noble-addis-api.onrender.com/predict"
```

Do not commit real environment variables to GitHub.

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Push Prisma schema to the database if needed

```bash
npx prisma db push
```

### 6. Run the development server

```bash
npm run dev
```

Open the local app:

```text
http://localhost:3000
```

---

## Running the Model API Locally

The machine learning API is inside the `model_api` folder.

### 1. Move into the model API folder

```bash
cd model_api
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

On Mac/Linux:

```bash
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

### 3. Install Python dependencies

```bash
pip install fastapi uvicorn pandas scikit-learn joblib pydantic
```

### 4. Run the API

```bash
uvicorn main:app --reload
```

The local API should run at:

```text
http://127.0.0.1:8000
```

---

## Testing Strategy

Testing was done manually across the main user, admin, model, and deployment flows. The goal was to confirm that the platform works as a complete product and not only as separate code files.

### Functional Testing

| Test Area | What Was Tested | Result |
|---|---|---|
| Landing page | Page loads and navigation works | Passed |
| User sign up | New user account can be created | Passed |
| User login | Existing user can sign in | Passed |
| Forgot password | User can access password reset option | Passed |
| Property review form | User can enter property details and submit | Passed |
| Prediction result | Estimated value, negotiation range, and risk signal display | Passed |
| Map preview | Selected location/landmark shows map context | Passed |
| Saved history | Property reviews are saved for the logged-in user | Passed |
| History search/filter | User can search and filter saved reviews | Passed |
| Help page | User can submit a support request | Passed |
| Admin login | Admin can access dashboard using demo credentials | Passed |
| Admin dashboard | Admin can view platform activity | Passed |
| Admin pages | Listings, checks, and support pages open correctly | Passed |
| Sign out | User/admin can sign out | Passed |
| Light/dark mode | Theme toggle works across the platform | Passed |
| Mobile responsiveness | Main pages are usable on phone screens | Passed |

### Model/API Testing

The model API was tested by sending sample property data and confirming that it returns:

- Estimated property value
- Negotiation range
- Price signal
- Risk level
- Risk score
- Price per square meter
- Buyer guidance

The deployed Render API was also tested before recording the final demo to make sure the prediction service was awake and responding.

### Deployment Testing

The deployed Vercel application was tested through the production link:

```text
https://nobleaddis.vercel.app
```

The main user pages, admin pages, database-backed features, and model prediction flow were tested after deployment.

---

## Analysis of Results

The final product achieved the main scope of the project. Users can review a property listing, receive a price estimate, understand a negotiation range, and see whether the listing needs caution. The platform also supports saved history, map preview, support requests, admin monitoring, and responsive use on mobile screens.

The price model achieved an R² score of about 0.745, which is reasonable for an early property price estimation model. This means the model can explain a meaningful part of the variation in property prices, although it is not perfect. The suspicious listing model adds another layer by helping users identify listings that may need closer review.

One important result of the project is that the machine learning model was not left only inside a notebook. It was connected to a working deployed product through a FastAPI model API and used inside the user workflow. This makes the project more practical because users can interact with the model through a real interface.

---

## Deployment Plan and Execution

The final deployment used three main services:

### Vercel

Vercel was used to deploy the main Next.js web application. This made the platform available through a public production link.

### Render

Render was used to deploy the FastAPI model API. The web application sends property data to this API and receives prediction results.

### Supabase

Supabase PostgreSQL was used as the production database. Prisma connects the application to the database and manages data such as users, saved reports, listings, and support requests.

This setup allowed Noble Addis to work as a real online platform with a frontend, backend, database, and model API.

---

## Code Quality and Maintainability

The project was organized to make the code easier to understand and improve.

Examples of code organization include:

- Reusable UI components inside the `components` folder
- Separate user pages and admin pages
- Database access handled through Prisma
- Authentication logic separated into helper functions
- Model prediction logic separated from the main UI
- Environment variables used for sensitive configuration
- Responsive CSS for desktop and mobile layouts
- Light and dark mode handled through a reusable theme component

This structure makes the project easier to maintain and extend in future versions.

---

## Ethical Note

Noble Addis is designed as a decision-support tool, not as an accusation system. A suspicious signal does not mean a seller or agent has committed fraud. It only means that the listing has patterns that may require more verification.

The platform also avoids using private seller contact details as model features. Users are encouraged to verify property documents, ownership details, location, and seller identity before making payments or signing agreements.

---

## Limitations

The current version has some limitations:

- The model depends on the quality and coverage of the available dataset.
- The platform does not yet verify legal ownership documents.
- The suspicious listing signal is not a final fraud decision.
- The model may not fully capture real-time market changes.
- Render free hosting may take a short time to wake up after inactivity.
- The password reset feature is basic and would need email verification for production use.
- More verified property data would improve model reliability.

---

## Future Improvements

Future versions of Noble Addis could include:

- Verified agent accounts
- Property document verification
- More real-time market data
- Amharic language support
- Stronger suspicious listing detection
- Image-based listing checks
- More detailed location scoring
- Email-based password reset
- Buyer-agent messaging
- Property comparison dashboard
- Admin tools for approving or rejecting listings
- Continuous model retraining with better verified data

---

## Final Demo Summary

The final demo video shows:

1. The landing page and project purpose
2. User sign in and property review flow
3. Price estimate and negotiation range
4. Suspicious listing signal
5. Location and map preview
6. Saved history page
7. Help/support request page
8. Admin login and dashboard
9. Mobile responsiveness and theme switching

---

## Final Submission

The final submission includes:

- GitHub repository link
- Live deployed application link
- Demo video link
- Project source code
- README with setup, testing, deployment, model explanation, and project reflection

---

## Summary

Noble Addis demonstrates how machine learning can support a more transparent real estate review process. The platform brings together price estimation, negotiation guidance, suspicious listing review, location context, saved reports, and admin monitoring into one working MVP for Addis Ababa property buyers.