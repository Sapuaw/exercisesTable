# Exam Update Web App – Detailed Flow and Features

This document outlines the flow, features, and data handling processes for the Exam Update Web App. The app is designed for a single user and requires no sign-in, enabling quick and easy creation, updating, and viewing of exams.

---

## 1. Overview

The Exam Update Web App allows the user to:

- Create new exams by specifying exam details.
- Add multiple exercises to each exam.
- View a list of previously submitted exams.
- Store exercise content as Markdown and images in a dedicated folder.

---

## 2. App Flow

### Home Page

- **Display Elements:**
  - **Add Exam Option:** A clear button or link to start the exam creation process.
  - **List of Submitted Exams:** Shows all previously added exams, named following the convention:  
    `Exame "Subject" "Year"`
- **User Actions:**
  - **Create New Exam:** Click the "Add Exam" button to start creating a new exam.
  - **View/Edit Existing Exam:** Click on any listed exam to view or update its details.

---

### Creating a New Exam

1. **Exam Details Prompt:**

   - When the user clicks to add a new exam, they are prompted to select or enter:
     - **Subject:** Choose from a dropdown list or enter manually.
     - **School Year:** Input the relevant school year.
     - **Exam Year:** Input or select the year of the exam.

2. **Navigation:**
   - Once the exam details are confirmed, the app navigates the user to the **Exam Creation Page**.

---

### Exam Creation Page

- **Exam Summary:**

  - Display the chosen exam details (subject, school year, exam year) at the top of the page for clarity.

- **Exercise Management:**

  - **Add Exercise Section:**

    - A prominent button or form to add a new exercise.
    - **For each exercise, include the following fields:**
      - **Topic & Subtopic:**
        - Dropdowns or selection fields to choose the appropriate topic and subtopic.
      - **Multiple Choice Option:**
        - A checkbox to indicate if the exercise is multiple choice.
        - If checked, display a dropdown menu to select the correct answer.
      - **Difficulty Level:**
        - A selection input (e.g., radio buttons or dropdown) to choose a difficulty level (ranging from Easy to Hard).
      - **Content Inputs:**
        - **Statement(s):**
          - An optional text input for statements.
          - Allows users to type text and add images.
        - **Question:**
          - A required text input for the main question.
          - Supports text entry and image attachments.
        - **Answer/Tip(s):**
          - A required text input for answers or tips.
          - Supports both text and image attachments.

  - **Exercise List Display:**
    - A section on the same page that shows all the added exercises.
    - Each exercise is numbered to indicate its order in the exam.

- **Submission:**
  - Once all exercises are added, a **Submit/Save Exam** button is provided.
  - On submission:
    - **Images** are saved to an `images` folder.
    - **Text Content & Exercise Data** are compiled and stored in a Markdown file.

---

## 3. Data Storage & File Management

- **Images:**
  - All images uploaded during exam creation are saved in a dedicated `images` folder.
- **Markdown File:**
  - The exam's textual content (including statements, questions, answers/tips, and metadata such as topic, subtopic, multiple choice flag, and difficulty) is saved in a Markdown file.
- **File Naming Convention:**
  - Exams are named following the format: `Exame "Subject" "Year"`, ensuring consistency across the app.

---

## 4. Additional Considerations

- **Single User Focus:**

  - The app is designed for one user only. Authentication or user management features are not necessary.
  - Local storage or a lightweight database is recommended for managing exam data.

- **User Experience (UX):**

  - Ensure the interface is intuitive and easy to navigate.
  - Clear instructions and consistent styling help reduce user errors and streamline the exam creation process.

- **Extensibility:**
  - The design leaves room for future enhancements, such as editing existing exams or adding additional metadata fields if needed.

---

## 5. Summary

The Exam Update Web App offers a streamlined and user-friendly interface for creating and managing exams without the need for user authentication. It combines form-based exam creation with a robust exercise input system and simple file storage strategies, ensuring that both text and image data are managed efficiently.

This structured approach allows developers to easily understand and implement the necessary features while keeping the user experience simple and effective.

## 6. Database Schema (Placeholder)

The following schema represents the data structure that will be implemented in the backend:

### Tables

1. **Exams**

   ```sql
   {
     id: string (UUID),
     subject: string,
     schoolYear: string,
     examYear: number,
     createdAt: timestamp,
     updatedAt: timestamp
   }
   ```

2. **Exercises**

   ```sql
   {
     id: string (UUID),
     examId: string (foreign key),
     orderNumber: number,
     topic: string,
     subtopic: string,
     isMultipleChoice: boolean,
     correctAnswer: string (nullable),
     difficultyLevel: enum ('Easy', 'Medium', 'Hard'),
     statement: text (nullable),
     question: text,
     answer: text,
     createdAt: timestamp,
     updatedAt: timestamp
   }
   ```

3. **Images**
   ```sql
   {
     id: string (UUID),
     exerciseId: string (foreign key),
     type: enum ('statement', 'question', 'answer'),
     path: string,
     createdAt: timestamp
   }
   ```

## 7. Folder Structure

```
exercisesTable/
├── public/
│   ├── images/          # Stored exercise images
│   └── assets/          # Other static assets
├── src/
│   ├── components/      # React components
│   │   ├── common/      # Reusable components
│   │   ├── exam/        # Exam-related components
│   │   └── exercise/    # Exercise-related components
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React context providers
│   ├── services/        # API and utility services
│   │   ├── api/         # API integration (placeholder)
│   │   └── utils/       # Helper functions
│   ├── types/           # TypeScript type definitions
│   ├── styles/          # Global styles and themes
│   ├── pages/           # Page components
│   └── App.tsx          # Root component
├── tests/               # Test files
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # Project documentation
```

## 8. Development Approach

The application will be built in the following phases:

1. **Phase 1: Basic Structure and Navigation**

   - Set up the project with React and TypeScript
   - Implement basic routing
   - Create layout components
   - Set up global styling

2. **Phase 2: Exam Management**

   - Create exam form components
   - Implement exam listing
   - Add exam creation flow
   - Set up temporary state management

3. **Phase 3: Exercise Management**

   - Develop exercise form components
   - Implement exercise listing within exams
   - Add image upload functionality
   - Create exercise preview component

4. **Phase 4: Data Persistence**

   - Implement temporary local storage solution
   - Set up file system for images
   - Create placeholder API services

5. **Phase 5: Polish and Optimization**
   - Add error handling
   - Implement loading states
   - Add form validation
   - Optimize performance
   - Enhance UI/UX

Each phase will be implemented iteratively, with testing and refinement at each stage. The modular structure allows for easy integration of the backend when it becomes available.
