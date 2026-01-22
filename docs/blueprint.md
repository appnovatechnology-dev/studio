# **App Name**: ProjectView

## Core Features:

- Customer List: Display a list of customers fetched from Firestore.
- Add Customer: Allow authenticated admins to add new customers to Firestore with a name and email.
- Project Management: Enable admins to manage project details, including status, milestones, and updates, with persistence to Firestore.
- Public Project Progress: Provide a public, read-only view of project progress for a single customer, fetched by ID from Firestore.
- Admin Authentication: Secure admin-only areas (/ and /admin/[id]) by implementing an authentication system that redirects unauthenticated users to the /login page.
- Project Summary Generation: Generate concise project summaries for each client using Genkit and Gemini model and act as tool when certain information should be used
- Data Security: Secure Firestore data with security rules that limit customer data to only admins. Limit customers so they can only access their data.

## Style Guidelines:

- Primary color: Deep Indigo (#4F46E5) for a professional and trustworthy feel.
- Background color: Very light gray (#F9FAFB), subtly desaturated indigo, providing a clean backdrop.
- Accent color: Violet (#8B5CF6), an analogous color to Indigo but with a higher brightness and saturation, ideal for highlighting key actions and interactive elements.
- Body text: 'Inter', sans-serif, with a modern, machined, objective, neutral look; suitable for headlines or body text.
- Headline font: 'Space Grotesk', sans-serif, a computerized, techy, scientific feel; if longer text is anticipated, use 'Inter' for body
- Simple line icons from a set like Lucide or Feather, consistently sized and colored with the primary indigo, providing clear visual cues without clutter.
- Use a grid-based layout for the customer list and project dashboards to maintain a clean, organized interface, supplemented by the Tailwind CSS utility classes.
- Subtle transitions and loading animations to improve user experience, using framer-motion where possible