# Employee Department Directory with Abstract Data Types

A Node.js application demonstrating database modeling and Abstract Data Type (ADT) concepts using Sequelize ORM with PostgreSQL. This project manages employees, departments, and their project assignments with a many-to-many relationship.

## 📋 Project Overview

This application implements a company directory system where:
- **Departments** contain multiple employees
- **Employees** work in departments and can be assigned to multiple projects
- **Projects** have multiple assigned employees with specific roles and hour allocations
- The **Employee-Project** relationship is a junction table storing role and hours allocated

This serves as a practical learning example of:
- ORM (Object-Relational Mapping) with Sequelize
- Database migrations and versioning
- Entity relationships (One-to-Many and Many-to-Many)
- Abstract Data Type implementation patterns

## 🏗️ Project Structure

```
emp_dept_directory_ADT_Prac/
├── config/
│   └── database.js           # Database connection configuration
├── models/
│   ├── index.js              # Model loader and association setup
│   ├── department.js          # Department model with relationships
│   ├── employee.js            # Employee model with relationships
│   ├── Project.js             # Project model with relationships
│   └── EmployeeProject.js     # Junction table for Employee-Project relationship
├── migrations/
│   ├── 001-create-projects.js        # Create Projects table
│   ├── 002-create-employee-projects.js # Create EmployeeProjects junction table
│   └── 003-add-status-to-projects.js # Add status column to Projects
├── index.js                  # Main application entry point
├── migrate.js                # Migration runner
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
└── package.json              # Dependencies (not versioned)
```

## 📁 File Descriptions and Connections

### **config/database.js**
**Purpose:** Establishes and exports the Sequelize database connection.

**Details:**
- Loads environment variables from `.env` file
- Creates a Sequelize instance configured for PostgreSQL
- Uses environment variables for database credentials: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- Supports optional SSL connections via `DB_SSL` environment variable
- Disables query logging for cleaner output

**Usage:** Imported by all model files and `index.js` to initialize the database connection.

```javascript
// How it's used in models:
const sequelize = require('../config/database');
```

---

### **models/index.js**
**Purpose:** Dynamically loads all model files and sets up associations between them.

**Details:**
- Scans the models directory for all `.js` files (except itself)
- Dynamically requires each model file
- Stores models in a `models` object keyed by model name
- Calls the `associate()` method on each model to establish relationships
- Exports all models for use in the application

**Key Logic:**
1. Uses `fs.readdirSync()` to read all files in the directory
2. Filters out `index.js` and non-JS files
3. Iterates through files and requires each one
4. Calls `associate(models)` on each model that has this method
5. This allows models to reference each other after all are loaded

**Usage:** Used in `index.js` to import all models:
```javascript
const { Department, Employee, Project, EmployeeProject } = require('./models');
```

---

### **models/department.js**
**Purpose:** Defines the Department model representing company departments.

**Schema:**
- `id` - Auto-generated primary key
- `name` - Unique string (department name)
- `location` - Text field (department location)
- `createdAt` & `updatedAt` - Auto-managed timestamps

**Relationships:**
- **One-to-Many with Employee:** One department has many employees
  - Foreign key: `Dept_id` in Employee table
  - `onDelete: 'CASCADE'` - Deleting a department deletes all its employees

**Key Methods:**
```javascript
Department.associate() // Defines hasMany relationship with Employee
```

**Used By:** `index.js` to create/query departments and their employees.

---

### **models/employee.js**
**Purpose:** Defines the Employee model representing company employees.

**Schema:**
- `id` - Auto-generated primary key
- `name` - String field (employee name)
- `email` - String field (email address)
- `salary` - Integer field (employee salary)
- `Dept_id` - Foreign key referencing Department

**Relationships:**
1. **Many-to-One with Department:** Many employees belong to one department
   - Foreign key: `Dept_id`
   
2. **Many-to-Many with Project:** Many employees can work on many projects
   - Through table: `EmployeeProject` (junction table)
   - Foreign key in junction: `EmployeeID`

**Key Methods:**
```javascript
Employee.associate() // Defines belongsTo (Department) and belongsToMany (Project)
```

**Used By:** `index.js` to create/query employees and their department and project assignments.

---

### **models/Project.js**
**Purpose:** Defines the Project model representing company projects.

**Schema:**
- `id` - Auto-generated primary key
- `name` - String field (project name)
- `deadline` - Date field (project deadline)
- `status` - String field (added by migration 003, defaults to 'active')
- `createdAt` & `updatedAt` - Auto-managed timestamps

**Relationships:**
- **Many-to-Many with Employee:** Many projects have many employees
  - Through table: `EmployeeProject` (junction table)
  - Foreign key in junction: `ProjectID`

**Key Methods:**
```javascript
Project.associate() // Defines belongsToMany relationship with Employee
```

**Used By:** `index.js` to create/query projects and their assigned employees.

---

### **models/EmployeeProject.js**
**Purpose:** Junction table model for the Many-to-Many relationship between Employee and Project.

**Schema:**
- `id` - Auto-generated primary key
- `role` - String field (employee's role in the project: Developer, Tester, Manager, etc.)
- `hoursAllocated` - Integer field (hours allocated to the project)
- `createdAt` & `updatedAt` - Auto-managed timestamps

**Why This Model Exists:**
The Many-to-Many relationship between Employee and Project needs to store additional metadata (role and hoursAllocated). A junction table allows us to store this extra data while maintaining the many-to-many association.

**Example Data:**
- Employee 1 → Project 1 (role: Developer, hoursAllocated: 100)
- Employee 1 → Project 2 (role: Lead Developer, hoursAllocated: 150)

**Used By:** Referenced in Employee and Project models' `belongsToMany` associations, and directly manipulated in `index.js` for updating/deleting employee-project assignments.

---

### **migrations/001-create-projects.js**
**Purpose:** Creates the `Projects` table in the database.

**What It Creates:**
- `id` - Primary key (auto-increment)
- `name` - Non-nullable string
- `deadline` - Date-only field
- `createdAt` & `updatedAt` - Timestamps

**Up Method:** Creates the Projects table
**Down Method:** Drops the Projects table (for rollback)

**Connection:** Executed first during migration process; creates the table structure before employees can reference projects.

---

### **migrations/002-create-employee-projects.js**
**Purpose:** Creates the `EmployeeProjects` junction table for the Many-to-Many relationship.

**What It Creates:**
- `id` - Primary key (auto-increment)
- `EmployeeID` - Foreign key to Employees table (CASCADE delete)
- `ProjectID` - Foreign key to Projects table (CASCADE delete)
- `role` - Non-nullable string
- `hoursAllocated` - Integer field
- `createdAt` & `updatedAt` - Timestamps
- **Unique Constraint:** On (EmployeeID, ProjectID) to prevent duplicate assignments

**Key Features:**
- Cascade delete ensures if an employee or project is deleted, all related entries are removed
- Unique constraint prevents the same employee from being assigned to the same project multiple times

**Connection:** Executed after 001; creates the linking table that connects Employees to Projects.

---

### **migrations/003-add-status-to-projects.js**
**Purpose:** Adds a `status` column to the existing `Projects` table.

**What It Adds:**
- `status` - String field with default value 'active'

**Use Case:** Allows tracking project status (active, completed, on-hold, etc.)

**Up Method:** Adds the status column to Projects
**Down Method:** Removes the status column (for rollback)

**Connection:** Executed after 002; modifies the Projects table to extend its functionality.

---

### **index.js**
**Purpose:** Main application entry point demonstrating complete CRUD operations and relationships.

**Workflow:**

1. **Initialization**
   - Imports Sequelize connection from `config/database.js`
   - Imports all models from `models/index.js`

2. **Department Creation**
   - Creates 2 departments: HR and IT

3. **Employee Creation**
   - Creates 3 employees assigned to different departments
   - Relationships established via `Dept_id` foreign key

4. **Project Creation**
   - Creates 2 projects with deadlines

5. **Employee-Project Assignment**
   - Associates employees with projects
   - Specifies role and hoursAllocated for each assignment
   - Uses Sequelize's `addProject()` method with `through` data

6. **Data Querying**
   - **Query 1:** Fetch all employees with their departments using `include`
   - **Query 2:** Fetch single employee with department and projects
   - **Query 3:** Fetch project with all assigned employees

7. **Update Operation**
   - Updates employee's role in a project (Tester → Lead Developer)
   - Demonstrates updating junction table data

8. **Delete Operation**
   - Removes an employee-project assignment
   - Verifies deletion by querying the removed relationship

**Database Connection Flow:**
```
index.js
  ↓
config/database.js (Sequelize instance)
  ↓
models/index.js (loads all models)
  ├── models/department.js
  ├── models/employee.js
  ├── models/Project.js
  └── models/EmployeeProject.js
```

---

### **migrate.js**
**Purpose:** CLI tool for running database migrations up or down.

**Command Options:**
- `node migrate.js up` - Run all pending migrations
- `node migrate.js down` - Revert the last applied migration

**Details:**
- Uses Umzug library for migration management
- Loads environment variables from `.env`
- Uses Sequelize storage backend to track which migrations have been applied
- Executes migration files in the `migrations/` directory in order

**Usage Sequence:**
1. Set up database credentials in `.env`
2. Run `node migrate.js up` to create tables
3. Run `node index.js` to populate data and test queries

---

### **.env**
**Purpose:** Environment configuration file containing database credentials.

**Variables:**
```
DB_NAME=dept_emp_db          # Database name
DB_USER=postgres              # Database user
DB_PASSWORD=admin123          # Database password
DB_HOST=localhost             # Database host
DB_PORT=5432                  # Database port (PostgreSQL default)
DB_SSL=false                  # SSL connection flag
```

**Security Note:** This file should be added to `.gitignore` in production to prevent exposing credentials.

---

### **.gitignore**
**Purpose:** Specifies files that should not be committed to Git.

**Ignored Items:**
- `/node_modules` - NPM dependencies
- `package.json` - Dependency manifest
- `package-lock.json` - Dependency lock file

---

## 🔗 Data Flow & Relationships Diagram

```
Department (1) ──→ (Many) Employee
                       ↓
                       ↓ (Many-to-Many via EmployeeProject)
                       ↓
                    Project
```

**Detailed Relationships:**

```
Department
  ├── id (PK)
  ├── name (UNIQUE)
  └── location
      └── hasMany → Employee

Employee
  ├── id (PK)
  ├── name
  ├── email
  ├── salary
  ├── Dept_id (FK → Department)
  │   └── belongsTo → Department
  └── belongsToMany → Project (through EmployeeProject)

Project
  ├── id (PK)
  ├── name
  ├── deadline
  ├── status (added by migration)
  └── belongsToMany → Employee (through EmployeeProject)

EmployeeProject (Junction Table)
  ├── id (PK)
  ├── EmployeeID (FK → Employee) [CASCADE]
  ├── ProjectID (FK → Project) [CASCADE]
  ├── role
  └── hoursAllocated
  └── UNIQUE constraint on (EmployeeID, ProjectID)
```

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- PostgreSQL database running
- npm package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create/configure `.env` file with your PostgreSQL credentials

4. Run migrations:
   ```bash
   node migrate.js up
   ```

5. Execute the main application:
   ```bash
   node index.js
   ```

## 📊 Example Output

When you run `node index.js`, you'll see:
- Created departments and employees
- Employee list with department information
- Single employee with all project assignments
- Project with all assigned employees
- Updated employee role in a project
- Confirmation of deleted employee-project relationship

## 🎓 Learning Concepts Demonstrated

1. **ORM (Object-Relational Mapping):** Using Sequelize to map JavaScript objects to database tables
2. **One-to-Many Relationships:** Department → Employee
3. **Many-to-Many Relationships:** Employee ↔ Project through junction table
4. **Database Migrations:** Version control for database schema changes
5. **Abstract Data Types:** Modeling complex entities and their relationships
6. **CRUD Operations:** Create, Read, Update, Delete examples
7. **Foreign Keys & Cascading:** Referential integrity and data consistency
8. **Unique Constraints:** Preventing duplicate records

## 📝 Key Takeaways

- **Models** define the structure and relationships of data
- **Migrations** track database schema changes over time
- **Junction tables** enable many-to-many relationships with additional metadata
- **Associations** connect models and define how data relates
- **Sequelize** provides an abstraction layer over raw SQL queries
