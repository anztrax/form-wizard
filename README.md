# Form Wizard

A Next.js application with React Query for form wizard and employee management.

## Demo

🔗 [Live Demo](https://form-wizard-eosin.vercel.app/)

---

## Local Setup & Run Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm
- Docker (for running mock API servers)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Mock API Servers

Open a terminal and run:

```bash
npm run mock-api
```

This starts two mock API servers:
- **API 1**: http://localhost:4001
- **API 2**: http://localhost:4002

> ⚠️ Keep this terminal running while developing.

### Step 3: Configure Environment Variables

Create a `.env` file in the project root (you can copy from `env.local.template`):

```bash
cp env.local.template .env
```

Then update the `.env` file with:

```env
NEXT_PUBLIC_API_DUMMY_DATA_1_URL=http://localhost:4001
NEXT_PUBLIC_API_DUMMY_DATA_2_URL=http://localhost:4002
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Optional: Run Storybook

To view and develop UI components in isolation:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) in your browser.

---

## Running Tests

To run the test suite:

```bash
npm run test
```

---

## Testing Notes

This section documents the test coverage and testing approach for key features in the application.

### Select Component (`Select.test.tsx`)

| Test Case | Description |
|-----------|-------------|
| Renders with placeholder | Verifies the select displays placeholder text when no value is selected |
| Shows options when clicked | Confirms dropdown opens and displays all options on click |
| Calls onChange when option selected | Ensures the callback fires with correct value and option object |
| Filters options with search | Validates client-side filtering when `showSearch` is enabled |
| Async search suggestions | Tests debounced search with loading state and filtered results |
| Clears selection | Verifies clear button resets value to null when `allowClear` is enabled |

### Form Wizard Hook (`useFormWizard.test.tsx`)

#### Sequential POST + Progress States

| Test Case | Description |
|-----------|-------------|
| Shows initial loading state | Loading modal appears with "Submitting form..." message on submit |
| Submits basicInfo first, then details | Verifies correct order: basicInfo API → details API (sequential) |
| Shows progress states in correct order | Loading messages update: Submitting → Basic Info → Details → Success |
| Passes correct payload to basicInfo | Validates request body contains: fullName, email, department, role, employeeId |
| Passes correct payload to detail | Validates request body contains: photo, employmentType, location, notes, employeeId, email |
| Shows success toast and navigates | Displays success message and redirects to `/employees` page |
| Hides loading modal on success | Confirms loading modal is dismissed after successful submission |

#### Error Handling

| Test Case | Description |
|-----------|-------------|
| Shows error toast when basicInfo fails | Displays error message from API and hides loading modal |
| Shows error toast when detail fails | Displays error message from API |
| Does not call detail if basicInfo fails | Ensures sequential flow stops on first failure |

---

## Public API Endpoints

For production or testing without local mock servers:

| API | URL |
|-----|-----|
| Dummy API 1 | https://api-step1-496088874894.asia-southeast1.run.app/ |
| Dummy API 2 | https://api-step2-496088874894.asia-southeast1.run.app/ |