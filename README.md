# Noble Addis

Noble Addis is a machine learning supported property listing review platform for Addis Ababa real estate. It helps remote and cross-border buyers review property listings before negotiation by combining listing data, price comparison, risk screening, location context, and saved review reports.

This project is submitted under the **ML Track**. The machine learning workflow is shown in the notebook, while the web application serves as the MVP interface for demonstrating how the model outputs can support users.

## GitHub Repository

https://github.com/Solomon-the-octave/Nobleaddis

## Project Description

Remote property buyers often struggle to know whether a listing is fairly priced, complete, or worth further verification before contacting an agent or visiting the site. Listings may have missing details, unclear location information, limited supporting evidence, or unusual price patterns.

Noble Addis provides an early review workspace where a user can:

* Select a property listing
* View listing image and source details
* Run a price and risk review
* View a negotiation reference range
* View the approximate listing location
* Save a property review report
* Review flagged listings from an admin page

The system does not replace professional valuation, legal review, or physical site verification. It is designed to support early decision-making before a buyer proceeds further.

## Dataset

The MVP uses a small dataset collected from public Jiji Ethiopia real estate listing pages for academic testing.

The dataset includes listing-level fields such as:

* Listing title
* Location
* Property type
* Listed price
* Size in square meters
* Bedrooms and bathrooms where available
* Listing image URL
* Listing URL
* Source platform
* Completeness score
* Review category

Private seller names, phone numbers, WhatsApp numbers, and personal contact details were excluded.

Main dataset file:

```text
data/addis_property_listings.csv
```

Raw extracted dataset:

```text
data/jiji_raw_listings.csv
```

Model prediction export used by the web MVP:

```text
data/model_predictions_for_web.csv
```

## Machine Learning Notebook

The notebook documents the ML workflow:

```text
Noble_Addis_ML_Workflow.ipynb
```

The notebook includes:

* Data loading
* Data cleaning
* Feature engineering
* Data visualization
* Model architecture explanation
* Regression model training
* Classification model training
* Initial performance metrics
* Prediction export for the web MVP
* Limitations and future work

## Data Engineering

The notebook prepares the dataset by cleaning missing values, converting numeric fields, and creating additional features.

Important engineered features include:

* Price per square meter
* Description length
* Completeness score
* Model review label
* Negotiation target value

These features are used to train the regression and classification models.

## Data Visualization

The notebook includes visualizations such as:

* Distribution of listed prices
* Listing review category counts
* Size versus price per square meter by review category
* Average price by location

These visualizations help explain the dataset before model training.

## Model Architecture

This project uses traditional supervised machine learning models rather than a deep neural network.

The model pipeline follows this structure:

```text
Listing data
→ Data cleaning
→ Feature engineering
→ One-hot encoding for categorical variables
→ Numeric feature processing
→ Random Forest Regressor
→ Random Forest Classifier
→ Evaluation metrics
→ Exported predictions for web MVP
```

### Regression Model

A **Random Forest Regressor** is used to estimate a negotiation reference value.

Input features include:

* Location
* Property type
* Listed price
* Size in square meters
* Bedrooms
* Bathrooms
* Amenities count
* Completeness score
* Description length
* Price per square meter

Output:

```text
Negotiation reference value
```

### Classification Model

A **Random Forest Classifier** is used to classify listings into review categories.

Output categories:

```text
normal
medium-risk
suspicious
```

A suspicious label does not prove fraud. It only means the listing should receive additional verification before a buyer proceeds.

## Initial Performance Metrics

The notebook reports initial model performance using the following metrics.

Regression metrics:

* Mean Absolute Error
* Root Mean Squared Error
* R2 Score

Classification metrics:

* Accuracy
* Precision
* Recall
* F1 Score
* Classification report
* Confusion matrix

Because the dataset is still small, these results are treated as early MVP evidence rather than final production performance.

## Web MVP / Deployment Option

The deployment option for this ML project is a web-based MVP interface built with Next.js.

The notebook trains the models and exports prediction outputs. The web MVP reads those exported prediction outputs and displays them in the listing review workflow.

The web MVP allows users to:

* Select a standard, flagged, or land listing
* View the listing image and source information
* Run a listing review
* View the predicted negotiation reference range
* View the predicted listing review category
* View price comparison and risk signals
* View the listing location on a map
* Save review reports
* View saved reports
* View listings needing admin review

## Tech Stack

* Python
* Pandas
* Scikit-learn
* Matplotlib
* Google Colab
* Next.js
* React
* TypeScript
* Prisma
* SQLite
* CSS

## Project Structure

```text
app/
  admin/
  api/
  evaluate/
  insights/
  reports/

components/
  DevelopmentPreview.tsx
  MapView.tsx
  Navbar.tsx
  PropertyForm.tsx
  ResultCards.tsx

data/
  addis_property_listings.csv
  jiji_raw_listings.csv
  model_predictions_for_web.csv
  sample_listings.csv

lib/
  modelPredictions.ts
  prediction.ts
  prisma.ts
  sampleData.ts

prisma/
  schema.prisma

public/
  listings/
  screenshots/

Noble_Addis_ML_Workflow.ipynb
README.md
```

## Environment Setup

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Run the development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

## Notebook Setup

Open the notebook in Google Colab:

```text
Noble_Addis_ML_Workflow.ipynb
```

Upload the dataset:

```text
addis_property_listings.csv
```

Then run all notebook cells from top to bottom.

The notebook exports:

```text
model_predictions_for_web.csv
```

This file is then converted into:

```text
lib/modelPredictions.ts
```

so the web MVP can use the trained model prediction outputs.

## Screenshots and Designs

Screenshots are stored in:

```text
public/screenshots/
```

Screenshots to include:

* Home page
* Evaluate listing page
* Property review result
* Listing image and source section
* Insights page
* Admin review page
* Reports page
* Notebook data visualization
* Notebook model metrics

## Deployment Plan

The current version runs locally as an MVP. The planned deployment approach is:

1. Push the project to GitHub.
2. Deploy the Next.js app on Vercel.
3. Move from local/browser storage to a managed database such as Supabase or PostgreSQL.
4. Store verified listing images safely.
5. Export and serve the trained model through an API endpoint.
6. Add authentication for buyers, admins, and verified agents.
7. Expand the dataset and retrain the model with more verified listings.

## Video Demo

The video demo should be between 5 and 10 minutes.

Suggested demo flow:

1. Briefly introduce Noble Addis.
2. Show the GitHub repository and README.
3. Show the notebook dataset, visualizations, model architecture, and metrics.
4. Show the exported model prediction file.
5. Open the web MVP.
6. Select a listing.
7. Run a listing review.
8. Show the negotiation range and review category.
9. Show the map and listing image.
10. Show saved reports.
11. Show the admin review queue.
12. Close with limitations and future work.

Video demo link:

```text
PASTE VIDEO LINK HERE
```

## Limitations

This is an initial MVP and has several limitations:

* The dataset is still small.
* Some listing fields may be incomplete or estimated.
* The model is not a formal property valuation system.
* The suspicious category does not prove fraud.
* The current deployment is a local MVP.
* More verified property data is needed before production use.

## Future Work

Future improvements include:

* Collecting more real estate listings from multiple sources
* Separating rental listings from sale listings
* Adding verified coordinates
* Adding document verification fields
* Improving image storage and verification
* Comparing additional ML models
* Serving the trained model through a backend API
* Adding verified agent accounts
* Deploying the platform online

## Ethical Note

This project only uses public listing-level information for academic MVP testing. Private seller contact details were intentionally excluded. The system does not accuse sellers or agents of fraud. It only identifies patterns that may require further verification.

## Demo Summary

Noble Addis demonstrates how a machine learning supported property platform can combine listing data, price intelligence, risk screening, location context, and saved reports to support safer early-stage property review for remote buyers interested in Addis Ababa real estate.
