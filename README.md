# Swipe-Invoice-Management

## Frontend
- **Framework:** Next.js  
- **Deployment:** Vercel  
- **Live link:** [Frontend on Vercel](https://swipe-invoice-management-frontend.vercel.app/)  

## Backend
- **Framework:** Express.js  
- **Deployment:** Vercel  
- **Live link:** [Backend on Vercel](https://swipe-invoice-management.vercel.app/)  

## Database
- **Database:** MongoDB  
- **Data Extraction:** Utilizes the **Google Gemini API** to extract structured data from uploaded files, including invoices in PDF, Image, Excel formats.  

---

## Running the Project Locally

Follow these steps to set up and run the project on your local machine:

1. **Clone the repository:**  
   Use one of the following methods to clone the repo:

   - **HTTPS:**
     ```bash
     git clone https://github.com/hemanth-sunkireddy/Swipe-Invoice-Management.git
     ```
   - **SSH:**
     ```bash
     git clone git@github.com:hemanth-sunkireddy/Swipe-Invoice-Management.git
     ```

2. **Navigate to the project directory:**
   ```bash
   cd Swipe-Invoice-Management
3. **Setup the frontend:**
```
cd frontend
npm install
npm run dev
```

4. **Open link in browser:**
`
http://localhost:3000
`

5. **Configure environment variables**
  * Add .env file in backend folder and add required keys (check .env.example)

6. **setup backend:**
```
cd ../backend
npm install
npm run start
```
* Backend runs on 4000 port


