# Project Development Guidelines

Follow these guidelines to maintain consistency and quality across the OJT Management System.

## 🏗 General Principles
- **Clean Code**: Refactor as you go. Keep functions small and focused on a single task.
- **Modularity**: Place helper functions and reusable components in `src/app/components` or `src/app/utils`.
- **Absolute Paths**: When possible, use absolute imports or defined aliases to avoid deeply nested relative paths.

## 🎨 Design System
- **Tailwind CSS**: Use utility classes for styling. Avoid writing custom CSS in `.css` files unless absolutely necessary.
- **Consistency**: Use the primary brand color (`#3b82f6` or `bg-blue-500`) for primary actions.
- **Responsive Design**: Always test layouts for mobile and desktop using Tailwind's `sm:`, `md:`, and `lg:` prefixes.

## ⚛ React Standards
- **Component Naming**: Use `PascalCase` for files and component names (e.g., `UserCard.tsx`).
- **Hooks**: Keep logic separate from UI by using custom hooks where appropriate.
- **State Management**: Use the existing Context providers for global data like Authentication.

## 🐍 Backend (FastAPI)
- **Type Hinting**: Always use Pydantic schemas for request and response validation.
- **RESTful API**: Follow standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- **Migrations**: If you change a model in `app/db/models/ojt_models.py`, ensure you update `init_db.py` or create a migration.

## 🧪 Testing & Validation
- **Manual Testing**: Before submitting a PR, verify your changes in the local environment using the roles (Admin, Mentor, Student) relevant to the feature.
- **Documentation**: If you add a new core feature, update `GUIDE.md`.
