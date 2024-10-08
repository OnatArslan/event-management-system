# Advanced Event Management System

## Overview

The Advanced Event Management System is a full-featured platform that allows users to create, manage, and participate in events, follow other users, and engage in real-time chat. It features location-based event management, notifications, and robust user authentication.

## Features

- **User Authentication:**

  - Sign up, log in, and manage profiles.
  - Role-based access control (Admin, Organizer, Participant).
  - Authentication using Passport.js with Local Strategies.

- **Event Management:**

  - Create, update, and delete events.
  - Location-based event management.
  - Invite participants and manage RSVPs.

- **Social Features:**

  - Follow/unfollow other users.
  - Real-time chat between followers.
  - Notifications for event updates, comments, and follower activities.

- **Search and Filter:**
  - Search for events by name, category, date, and location.
  - Filter events based on various criteria.

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** Passport.js with Local Strategies
- **Real-Time Communication:** Socket.io
- **Frontend (Optional):** React, Angular, Vue.js (if building a full-stack application)

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL installed and running

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/OnatArslan/event-management-system.git
   ```
