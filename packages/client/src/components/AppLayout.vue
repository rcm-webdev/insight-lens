<template>
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <nav>
          <ul>
            <li><strong>InsightLens</strong></li>
          </ul>
          <ul>
            <li><small>Ophthalmic AI Workflow</small></li>
          </ul>
        </nav>
      </header>
  
      <!-- Main container with sidebar and content -->
      <div class="app-body">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
          <nav>
            <ul>
            <li>
              <router-link to="/" :class="{ active: isActive('/') }">
                Dashboard
              </router-link>
            </li>
            <li>
              <router-link to="/upload" :class="{ active: isActive('/upload') }">
                Upload Images
              </router-link>
            </li>
            <li>
              <router-link to="/models" :class="{ active: isActive('/models') }">
                Models
              </router-link>
            </li>
            <li>
              <router-link to="/rules" :class="{ active: isActive('/rules') }">
                Rules
              </router-link>
            </li>
            <li>
              <router-link to="/audit" :class="{ active: isActive('/audit') }">
                Audit Logs
              </router-link>
            </li>
          </ul>
          </nav>
        </aside>
  
        <!-- Main Content Area -->
        <main class="content">
          <slot>
            <!-- Views will be rendered here -->
            <h2>Welcome to InsightLens</h2>
            <p>Select an option from the sidebar to get started.</p>
          </slot>
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  

const route = useRoute()

const isActive = (path: string): boolean => {
  return route.path === path
}
  </script>
  
  <style scoped>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .app-header {
    border-bottom: 1px solid var(--muted-border-color);
    padding: 0 1rem;
  }
  
  .app-header nav {
    padding: 0;
  }
  
  .app-body {
    display: flex;
    flex: 1;
  }
  
  .sidebar {
    width: 250px;
    border-right: 1px solid var(--muted-border-color);
    padding: 2rem 1rem;
    background-color: var(--card-background-color);
  }
  
  .sidebar nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .sidebar nav ul li {
    margin-bottom: 0.5rem;
  }
  
  .sidebar nav ul li a {
    display: block;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    color: var(--color);
    transition: background-color 0.2s;
  }
  
  .sidebar nav ul li a:hover {
    background-color: var(--primary-hover);
  }
  
  .sidebar nav ul li a.active {
    background-color: var(--primary);
    color: cyan;
    font-weight: 500;
  }
  
  .content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }
  </style>