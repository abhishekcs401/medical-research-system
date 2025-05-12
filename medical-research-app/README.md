# Medical Research Application

This is a full-stack Angular application for managing medical research programs and participants. It includes features for authentication, registration, and CRUD operations for programs and participants.

## Folder Structure

The project follows a modular structure with clearly defined modules for core services, shared components, layout components, and feature modules.

```plaintext
src/
└── app/
    ├── core/                           // Singleton services, interceptors, guards, global config
    │   ├── interceptors/               // HTTP interceptors
    │   ├── guards/                     // Route guards
    │   ├── services/                   // Core services
    │   │   ├── auth.service.ts         // Authentication service
    │   │   └── auth-token.service.ts   // Auth token service
    │   └── core.module.ts              // Core module
    │
    ├── shared/                          // Reusable components, directives, pipes
    │   ├── components/                  // Shared components
    │   ├── directives/                  // Shared directives
    │   ├── pipes/                       // Shared pipes
    │   └── shared.module.ts             // Shared module
    │
    ├── layout/                          // Layout components
    │   ├── layout.module.ts             // Layout module
    │   ├── main-layout/                 // Main layout components (header, footer, etc.)
    │   └── auth-layout/                 // Auth layout components (e.g., login, register)
    │
    ├── features/                        // All main features (auth, program, participant)
    │   ├── auth/                        // Auth feature
    │   │   ├── auth.module.ts           // Auth module
    │   │   ├── auth-routing.ts          // Auth routing
    │   │   ├── types/                   // Auth types (models, DTOs)
    │   │   ├── login/                   // Login components
    │   │   └── register/                // Register components
    │   │
    │   ├── program/                     // Program feature
    │   │   ├── program.module.ts        // Program module
    │   │   ├── program-routing.ts       // Program routing
    │   │   └── components/              // Program-related components
    │   │
    │   └── participant/                 // Participant feature
    │       ├── participant.module.ts    // Participant module
    │       ├── participant-routing.ts   // Participant routing
    │       └── components/              // Participant-related components
    │
    ├── app-routing.module.ts            // Main routing module, includes layout and feature routing
    ├── app.component.ts                 // Root component
    ├── app.component.html               // Root component template
    └── app.module.ts                    // Main app module, imports everything needed for the app
```
