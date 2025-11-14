# Business Card Management - Angular Application

A modern, responsive Angular application for managing business card information with drag-and-drop file upload, real-time filtering, and Material Design UI.

## Description

The Business Card Management frontend is a single-page application built with Angular 16 and Angular Material. It provides an intuitive interface for creating, viewing, filtering, and managing business cards, with seamless integration with the .NET Core backend API.

## Features

- **Modern UI**: Material Design components for a polished user experience
- **CRUD Operations**: Create, view, and delete business cards
- **Drag & Drop**: Intuitive file upload interface for CSV/XML imports
- **Real-time Filtering**: Advanced filtering by multiple criteria
- **File Export**: Download business cards as CSV or XML files
- **Photo Upload**: Image upload with preview and size validation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Sweet Alerts**: User-friendly notifications and confirmations
- **Form Validation**: Client-side validation with visual feedback

## Tech Stack

- **Framework**: Angular 16.2.0
- **Language**: TypeScript
- **UI Library**: Angular Material 16.2.14
- **HTTP Client**: Angular HttpClient with RxJS
- **Alerts**: SweetAlert2
- **Styling**: SCSS with Material theming
- **Build Tool**: Angular CLI

## Prerequisites

- **Node.js**: Version 16.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 8.x or higher (comes with Node.js)
- **Angular CLI**: Version 16.x or higher
- **Modern Browser**: Chrome, Firefox, Edge, or Safari

## Installation

### 1. Install Angular CLI Globally

```bash
npm install -g @angular/cli@16
```

### 2. Navigate to the Frontend Directory

```bash
cd business-card-app
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Install Angular Material (if needed)

```bash
ng add @angular/material
```

Choose the following options:
- **Theme**: Indigo/Pink (or your preference)
- **Typography**: Yes
- **Animations**: Yes

### 5. Configure API Endpoint

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001'  // Your backend API URL
};
```

For production, edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com'
};
```

## Running the Application

### Development Server

```bash
ng serve
```

Expected output:
```
✔ Browser application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
```

Navigate to `http://localhost:4200` in your browser. The application will automatically reload if you change any source files.

### Build for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

### Run on Different Port

```bash
ng serve --port 4300
```

## Application Usage Guide

### Adding a Business Card

1. Click on the **"Add Card"** tab in the navigation
2. Fill in the required fields:
   - Name (required)
   - Gender (required)
   - Date of Birth (required)
   - Email (required)
   - Phone (required)
   - Address (optional)
3. Optionally upload a photo (max 1MB)
4. Click **"Preview"** to review your input
5. Click **"Submit"** to save the card

### Importing Cards from File

1. Navigate to the **"Add Card"** tab
2. Scroll to the import section
3. Either:
   - **Drag and drop** a CSV or XML file onto the drop zone, OR
   - Click **"Select File"** to browse for a file
4. Preview the imported data in the Card form
5. Click **"Submit All"** to save all imported cards

### Viewing and Filtering Cards

1. Click on the **"View Cards"** tab
2. All business cards are displayed by default
3. Click **"Show Filters"** to expand filter options
4. Enter filter criteria:
   - Name
   - Gender
   - Email
   - Phone
5. Click **"Apply Filters"** to filter results
6. Click **"Clear Filters"** to reset

### Exporting Cards

1. Navigate to the **"View Cards"** tab
2. Click either:
   - **"CSV"** button to download as CSV
   - **"XML"** button to download as XML
3. File will download automatically to your Downloads folder

### Deleting a Card

1. In the **"View Cards"** tab, find the card you want to delete
2. Click the **delete icon** (trash bin) next to the card
4. Card will be removed and a success message will appear

## Sample Data Files

### CSV Format (`test-cards.csv`)

```csv
Name,Gender,DateOfBirth,Email,Phone,Address
John Doe,Male,1990-01-15,john.doe@example.com,+1234567890,123 Main Street
Jane Smith,Female,1985-05-20,jane.smith@example.com,+0987654321,456 Oak Avenue
Bob Johnson,Male,1992-08-30,bob.j@example.com,+1122334455,789 Pine Road
```

### XML Format (`test-cards.xml`)

```xml
<?xml version="1.0" encoding="utf-8"?>
<BusinessCards>
  <BusinessCard>
    <Name>John Doe</Name>
    <Gender>Male</Gender>
    <DateOfBirth>1990-01-15</DateOfBirth>
    <Email>john.doe@example.com</Email>
    <Phone>+1234567890</Phone>
    <Address>123 Main Street</Address>
    <Photo></Photo>
  </BusinessCard>
  <BusinessCard>
    <Name>Jane Smith</Name>
    <Gender>Female</Gender>
    <DateOfBirth>1985-05-20</DateOfBirth>
    <Email>jane.smith@example.com</Email>
    <Phone>+0987654321</Phone>
    <Address>456 Oak Avenue</Address>
    <Photo></Photo>
  </BusinessCard>
</BusinessCards>
```

## Project Structure

```
business-card-app/
├── src/
│   ├── app/
│   │   ├── components/           # UI components
│   │   │   ├── add-card/        # Add/Import card component
│   │   │   ├── view-cards/      # View/Filter cards component
│   │   │   └── navbar/          # Navigation component
│   │   ├── models/              # TypeScript interfaces
│   │   │   └── business-card.model.ts
│   │   ├── services/            # HTTP services
│   │   │   └── business-card.service.ts
│   │   ├── app.component.ts     # Root component
│   │   ├── app.module.ts        # App module
│   │   └── app-routing.module.ts # Routing configuration
│   ├── environments/            # Environment configs
│   ├── utils/                  # utilits
│   │   │   ├── API/        # API path
│   ├── assets/                  # Static assets
│   ├── styles.scss             # Global styles
│   └── index.html              # Main HTML file
├── angular.json                # Angular CLI config
├── package.json               # Dependencies
└── tsconfig.json             # TypeScript config
```


## Troubleshooting

### CORS Errors

**Problem**: Browser console shows CORS errors

**Solution**:
- Ensure the backend API is running
- Verify the API URL in `environment.ts` matches your backend
- Check that backend CORS policy includes your Angular app URL (`http://localhost:4200`)

### API Connection Failed

**Problem**: Cannot connect to backend API

**Solution**:
```bash
# Verify backend is running
curl https://localhost:7001/api/BusinessCard

# Check environment.ts has correct API URL
# Restart Angular dev server
ng serve
```

### Module Not Found Errors

**Problem**: Import errors or module not found

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
ng cache clean
```

### Build Errors

**Problem**: Build fails with TypeScript errors

**Solution**:
```bash
# Check TypeScript version compatibility
npm list typescript

# Update dependencies
npm update

# If issues persist, check Angular version compatibility
ng version
```

### Photo Upload Issues

**Problem**: Photo upload fails or doesn't display

**Solution**:
- Ensure photo is under 1MB
- Check file format (JPG, PNG, GIF supported)
- Verify Base64 encoding is working
- Check browser console for error messages



## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
