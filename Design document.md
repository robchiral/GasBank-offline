# Anesthesiology Question Bank - Design Document

## 1. Introduction & Goals

This document outlines the design and architecture for a standalone, local Anesthesiology Question Bank application. The primary goal is to create a portable, easy-to-use study tool that can be downloaded from a GitHub repository and run on any modern computer without a complex installation process.

### Core Principles:
- **Portability:** The app must be self-contained and run locally from a folder.  
- **Simplicity:** No external database or web server is required. All data is stored in local files.
- **Offline First:** The application is fully functional offline.
- **Extensibility:** The data format and architecture should make it easy to add new questions and features.
    
## 2. Proposed Architecture

To meet the goals of portability and ease of use, we will use a **single-page web application (SPA)** packaged as a desktop application using **Electron**.

- **Frontend Framework:** **React.js**. It's ideal for building a dynamic and responsive user interface. All components, logic, and styling will be contained within a single file for simplicity, as per the project's setup.
    
- **Desktop Packaging:** **Electron**. This will wrap the React web app into a cross-platform desktop application (Windows, macOS, Linux). This gives the app a native feel and, crucially, allows it to reliably read from and write to the user's local file system, which is a browser security limitation.
    
- **Data Storage:**
    
    - **Question Bank:** A single `questions.json` file located within the application's data directory. This file will be shipped with the application and can be easily updated by replacing it.
        
    - **User Data:** All user-specific data (progress, statistics, settings, custom questions) will be stored in a single `userData.json` file created in the user's local application data directory. The app will create this file on first launch if it doesn't exist.
        

### Rationale:

This architecture is optimal because an Electron app can be distributed as a single executable or installer. The user simply downloads it, runs it, and the application manages its own file-based data without any configuration from the user. Using JSON files makes the data human-readable and easy to manage or even edit manually if needed.

## 3. Core Features

### 3.1. Dashboard

- **Welcome Screen:** Displays a summary of the user's overall progress.
    
- **Statistics Overview:**
    
    - Pie chart of answered questions (Correct vs. Incorrect vs. Unanswered).
        
    - Bar graph showing performance by main category.
        
- **Quick Start Buttons:**
    
    - "Start New Session" (opens session creation modal).
        
    - "Review Incorrect Questions".
        
    - "Resume Last Session".
        

### 3.2. Study Sessions

- **Session Creation:** A modal allows users to configure a new study session with the following options:
    
    - **Mode:**
        
        - **Tutor Mode:** Explanations are shown immediately after each question is answered.
            
        - **Exam Mode:** A timed session where all results and explanations are held until the end.
            
    - **Question Selection:**
        
        - Number of questions for the session.
            
        - Select specific categories and subcategories.
            
        - Filter by difficulty (Easy, Medium, Hard).
            
        - Filter by status (Unanswered, Incorrect, All).
            
    - **Randomization:** Option to randomize question order.
        
- **Session Interface:**
    
    - **Main View:** Displays the current question and multiple-choice answers.
        
    - **Navigation:** Buttons for "Next," "Previous," and "End Session."
        
    - **Question Palette:** A side panel showing a numbered list of all questions in the session, color-coded by status (unanswered, answered-correct, answered-incorrect) for easy navigation.
        
    - **Post-Answer View (Tutor Mode):**
        
        - The selected answer and the correct answer are clearly marked.
            
        - The explanation for _each_ answer choice is displayed directly below it.
            
        - The final, broader didactic explanation is displayed at the bottom.
            

### 3.3. Statistics & Performance Tracking

- **Detailed Stats View:** A dedicated page with in-depth analytics.
    
- **Data Visualization:** Use charts and tables to display:
    
    - Overall performance (percentage correct, total answered, etc.).
        
    - Performance breakdown by category and subcategory.
        
- **Question History:** A searchable, sortable table of every question attempt, showing the date, whether it was correct, and a link to review the question.
    
- **User Actions:**
    
    - **Reset All Progress:** A button to wipe the `userData.json` file clean.
        
    - **Reset Individual Question:** A button on the question review page to reset its history.
        

### 3.4. Content Management

- **Question Browser:** A dedicated interface to search, filter, and view all questions in the bank. Users can search by keyword or Question ID.
    
- **Create/Edit Questions:**
    
    - A form-based interface for creating new questions.
        
    - Fields will match the `questions.json` data model.
        
    - A simple rich-text editor for question text and explanations would be a valuable addition (e.g., to support bolding or bullet points).
        
    - Newly created questions are saved to the user's `userData.json` to keep them separate from the core question bank.
        
- **Import/Export:**
    
    - **Import:** Allow bulk import of questions from a CSV or JSON file. Provide a template file for users to download.
        
    - **Export:** Allow users to export their self-created questions.
        

## 4. Data Models

### 4.1. Question Bank (`questions.json`)

This is an array of question objects.

```
[
  {
    "id": "ANES001",
    "category": "Basic Sciences",
    "subcategory": "Pharmacology",
    "difficulty": "medium",
    "questionText": "Which of the following intravenous anesthetic agents has the most pronounced analgesic properties?",
    "answers": [
      {
        "text": "Propofol",
        "isCorrect": false,
        "explanation": "Propofol is an excellent hypnotic but has minimal to no analgesic properties."
      },
      {
        "text": "Ketamine",
        "isCorrect": true,
        "explanation": "Ketamine is unique among IV anesthetics as it produces profound analgesia through NMDA receptor antagonism, in addition to its dissociative anesthetic effects."
      },
      {
        "text": "Etomidate",
        "isCorrect": false,
        "explanation": "Etomidate is hemodynamically stable and a potent hypnotic, but it lacks analgesic effects."
      },
      {
        "text": "Midazolam",
        "isCorrect": false,
        "explanation": "Midazolam is a benzodiazepine used for anxiolysis and sedation; it does not provide analgesia."
      }
    ],
    "didactic": "Intravenous anesthetic agents form a cornerstone of modern anesthesia practice. They are broadly categorized by their chemical structure and mechanism of action. While most agents like propofol and etomidate primarily work by potentiating the effects of the inhibitory neurotransmitter GABA, they offer little to no pain relief.\n\nKetamine stands apart due to its primary mechanism of antagonizing the N-methyl-D-aspartate (NMDA) receptor. This action interrupts pain pathways in a way other agents do not, producing a state of 'dissociative anesthesia' that includes potent analgesia and amnesia while often preserving airway reflexes and respiratory drive."
  }
]
```

### 4.2. User Data (`userData.json`)

This is a single JSON object that stores all user-specific state.

```
{
  "userSettings": {
    "theme": "dark"
  },
  "customQuestions": [
    {
      "...question object..."
    }
  ],
  "questionStats": {
    "ANES001": {
      "status": "correct",
      "attempts": [
        {
          "timestamp": "2025-10-27T10:00:00Z",
          "result": "incorrect"
        },
        {
          "timestamp": "2025-10-28T14:30:00Z",
          "result": "correct"
        }
      ],
      "notes": "User-added notes for this question."
    }
  },
  "activeSession": {
    "questions": ["ANES001", "ANES042"],
    "currentIndex": 1,
    "userAnswers": {
      "ANES001": "Ketamine"
    },
    "startTime": "2025-10-29T09:00:00Z",
    "mode": "Tutor"
  }
}
```

## 5. User Interface (UI) Flow

1. **App Launch:**
    
    - The app loads `questions.json` and any custom questions from `userData.json` into memory.
        
    - It reads `userData.json` to determine user progress.
        
    - The **Dashboard** is displayed.
        
2. **Creating a Session:**
    
    - User clicks "Start New Session."
        
    - The session configuration modal appears.
        
    - User selects options and clicks "Start."
        
    - The app transitions to the **Session Interface**, displaying the first question.
        
3. **Answering a Question:**
    
    - User selects an answer and clicks "Submit."
        
    - In Tutor Mode, the explanations are immediately shown.
        
    - User clicks "Next" to proceed.
        
    - `userData.json` is updated in the background with the result.
        
4. **Managing Content:**
    
    - User navigates to the "Content Management" tab.
        
    - They can browse/search existing questions.
        
    - Clicking "Add New" opens the question creation form.
        
    - Upon saving, the new question is added to the `customQuestions` array in `userData.json`.
        

