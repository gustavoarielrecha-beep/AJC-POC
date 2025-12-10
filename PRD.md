# Product Requirements Document (PRD)
## Project: AJC International Global Logistics Portal (POC)
**Version:** 1.0  
**Status:** MVP / Proof of Concept  
**Date:** 2024-05-21

---

## 1. Executive Summary
The **AJC Global Logistics Portal** is a centralized web application designed for AJC International to manage global food logistics operations. It provides real-time visibility into inventory across international warehouses, tracks maritime and overland shipments, and offers business intelligence through an integrated AI assistant.

The system aims to replace fragmented spreadsheet tracking with a unified, visual dashboard accessible by logistics coordinators, sales representatives, and administrators.

---

## 2. Problem Statement
*   **Lack of Visibility:** Stakeholders cannot easily visualize the real-time status of shipments moving between continents.
*   **Data Silos:** Inventory data and shipping schedules are often disconnected, making it difficult to answer customer queries instantly.
*   **Inefficient Information Retrieval:** Finding specific details about stock levels or shipment ETAs requires manual searching through multiple systems.

---

## 3. User Personas
| Role | Description | Key Needs |
| :--- | :--- | :--- |
| **Logistics Coordinator** | Manages day-to-day shipments. | Needs detailed tracking, status updates, and delay alerts (Customs/Hold). |
| **Sales Representative** | Sells products (Poultry, Pork, etc.). | Needs accurate inventory levels and location data to promise stock to clients. |
| **Viewer / Executive** | Oversees high-level performance. | Needs aggregate dashboards, KPI cards, and visual maps of global activity. |

---

## 4. Functional Requirements

### 4.1 Authentication & User Management
*   **Providers:** Support for Email/Password and OAuth (Google, GitHub, Facebook, Azure/Microsoft).
*   **Redirects:** Secure redirection to production URLs or localhost based on environment.
*   **Profile Management:** Automatic profile creation upon registration.
*   **Roles:** Support for `admin`, `logistics`, `sales`, and `viewer` roles.

### 4.2 Executive Dashboard
*   **KPI Cards:** Display real-time metrics for:
    *   Total Stock (in Metric Tons).
    *   Active Shipments count.
    *   Delayed/Customs alerts (requiring attention).
    *   Total SKU count.
*   **Visual Analytics:**
    *   **Inventory by Category:** Bar chart displaying stock distribution (Poultry, Pork, Beef, Seafood, Vegetables, Fries).
    *   **Shipment Status:** Donut chart showing the ratio of In Transit vs. Delivered vs. Pending.
*   **Mini-Map:** A preview of the global tracking map.
*   **Recent Activity:** A list of active shipments for quick access.

### 4.3 Inventory Management
*   **Data Grid:** Tabular view of all products.
*   **Attributes:** Product Name, Category, Physical Location (Warehouse/Port), Stock Level, and Unit of Measure (e.g., MT).
*   **Visual Indicators:** Progress bars indicating stock levels relative to capacity.
*   **CRUD Operations:** UI support for Adding, Editing, and Deleting products (Backend policies configured for authenticated users).

### 4.4 Logistics & Shipment Tracking
*   **Shipment Registry:** Detailed list of all tracked movements.
*   **Status Workflow:** Support for specific statuses: `In Transit` -> `Delivered` -> `Pending` -> `Customs`.
*   **Route Details:** Origin and Destination tracking with ETA dates.
*   **Visual Status:** Color-coded badges for immediate status recognition (e.g., Yellow for Customs, Blue for In Transit).

### 4.5 Interactive Global Map
*   **Visualization:** Leaflet-based interactive map.
*   **Geospatial Data:** Render markers for Origin and Destination coordinates.
*   **Route Visualization:** Polyline connections between origin and destination.
*   **Interactivity:**
    *   Clicking a shipment in the dashboard "flies" the map to the route bounds.
    *   Selecting a route highlights it in Red and dims non-selected routes.
    *   Popups displaying tracking ID, route info, and ETA.

### 4.6 AI Assistant (AJC-Bot)
*   **Engine:** Google Gemini API (Supports `gemini-2.5-flash` and `gemini-3-pro-preview`).
*   **Context Awareness:** The bot has read-access to the **current** state of the `products` and `shipments` database tables to answer context-aware questions.
*   **Interface:** Floating chat widget accessible from all pages.
*   **System Prompting:** Configured to act as a professional AJC logistics assistant, capable of multi-lingual responses (English/Spanish).

---

## 5. Non-Functional Requirements

### 5.1 Performance
*   **Lazy Loading:** Heavy components (like the Map) are lazy-loaded to ensure fast initial page load (Time to Interactive).
*   **Optimized Assets:** Use CDN for external libraries (React, Leaflet, Recharts) via Import Maps to reduce bundle size.

### 5.2 Security
*   **API Key Management:** Google GenAI API keys are loaded via Docker Secrets or Environment variables.
*   **Row Level Security (RLS):** Supabase RLS policies enabled to restrict data access to authenticated users.

### 5.3 Infrastructure & Deployment
*   **Containerization:** Application Dockerized (Node 20 Alpine).
*   **Orchestration:** Support for Docker Swarm deployment via `docker-compose.yml`.
*   **Secrets:** Secure injection of API keys via Docker Secrets.

---

## 6. Technical Architecture

### 6.1 Frontend
*   **Framework:** React 19 (via Vite).
*   **Styling:** Tailwind CSS (Custom AJC color palette: `#003366` Blue, `#CC0000` Red).
*   **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`).
*   **Routing:** Tab-based internal navigation state.

### 6.2 Backend (BaaS)
*   **Platform:** Supabase.
*   **Database:** PostgreSQL.
*   **Auth:** Supabase Auth (GoTrue).

### 6.3 AI Integration
*   **SDK:** `@google/genai`.
*   **Pattern:** Client-side RAG (Retrieval-Augmented Generation). The frontend fetches DB data and injects it into the prompt context before sending to Gemini.

---

## 7. Data Dictionary

### 7.1 Products
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique Identifier |
| `name` | String | Product Name |
| `category` | Enum | Poultry, Pork, Beef, Seafood, etc. |
| `stock_level`| Integer | Quantity in MT |
| `location` | String | Warehouse Name |

### 7.2 Shipments
| Field | Type | Description |
| :--- | :--- | :--- |
| `tracking_number` | String | Unique Tracking ID (e.g., SH-2024-001) |
| `origin` / `destination` | String | City/Port Names |
| `origin_lat` / `lng` | Float | Geospatial coordinates |
| `status` | Enum | In Transit, Delivered, Pending, Customs |
| `eta` | Date | Estimated Time of Arrival |

---

## 8. Future Roadmap
1.  **Real-time container tracking:** Integrate with MarineTraffic API for live vessel coordinates.
2.  **Document Management:** Upload Bill of Lading (BOL) and Invoices to Supabase Storage attached to shipments.
3.  **Role-Based Access Control (RBAC):** Restrict "Edit" permissions to Logistics/Admin roles only.
4.  **Notifications:** Email/SMS alerts when a shipment status changes to "Customs" or "Delayed".
