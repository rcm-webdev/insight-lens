
<script setup lang="ts">
import { ref, computed } from 'vue';
import ModelCard from './ModelCard.vue';
import type { AIModel, ModelType, ModelSelection } from '@/types/model.types';

const props = defineProps<{
  models: AIModel[];
  multiSelect?: boolean;
  preselectedIds?: string[];
}>();

const emit = defineEmits<{
  selectionChanged: [selection: ModelSelection[]];
  modelDetails: [model: AIModel];
}>();

const selectedModels = ref<Map<string, ModelSelection>>(new Map());
const filterType = ref<ModelType | 'all'>('all');
const searchQuery = ref('');
const sortBy = ref<'name' | 'accuracy' | 'speed' | 'recent'>('name');

// Initialize with preselected models
if (props.preselectedIds) {
  props.preselectedIds.forEach(id => {
    const model = props.models.find(m => m.id === id);
    if (model) {
      selectedModels.value.set(id, {
        modelId: id,
        model,
        selectedAt: new Date()
      });
    }
  });
}

// Filter and sort models
const filteredModels = computed(() => {
  let filtered = props.models;

  // Filter by type
  if (filterType.value !== 'all') {
    filtered = filtered.filter(m => m.type === filterType.value);
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query) ||
      m.capabilities.some(c => c.toLowerCase().includes(query)) ||
      m.diseases?.some(d => d.toLowerCase().includes(query))
    );
  }

  // Sort models
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'accuracy':
        return (b.accuracy || 0) - (a.accuracy || 0);
      case 'speed':
        return (a.inference_time || 999999) - (b.inference_time || 999999);
      case 'recent':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default:
        return 0;
    }
  });

  return filtered;
});

const availableTypes = computed(() => {
  const types = new Set(props.models.map(m => m.type));
  return Array.from(types);
});

const selectionArray = computed(() => Array.from(selectedModels.value.values()));

const isSelected = (modelId: string): boolean => {
  return selectedModels.value.has(modelId);
};

const handleModelSelect = (model: AIModel) => {
  if (model.status !== 'available') return;

  if (props.multiSelect) {
    // Toggle selection for multi-select
    if (selectedModels.value.has(model.id)) {
      selectedModels.value.delete(model.id);
    } else {
      selectedModels.value.set(model.id, {
        modelId: model.id,
        model,
        selectedAt: new Date()
      });
    }
  } else {
    // Single selection - replace
    selectedModels.value.clear();
    selectedModels.value.set(model.id, {
      modelId: model.id,
      model,
      selectedAt: new Date()
    });
  }

  emit('selectionChanged', selectionArray.value);
};

const handleViewDetails = (model: AIModel) => {
  emit('modelDetails', model);
};

const clearSelection = () => {
  selectedModels.value.clear();
  emit('selectionChanged', []);
};

defineExpose({
  selectedModels: selectionArray,
  clearSelection
});
</script>

<template>
  <div class="model-selector">
    <!-- Controls -->
    <div class="selector-controls">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search models by name, capability, or disease..."
          aria-label="Search models"
        />
      </div>

      <div class="filter-controls">
        <div class="filter-group">
          <label for="type-filter">Type:</label>
          <select id="type-filter" v-model="filterType">
            <option value="all">All Types</option>
            <option 
              v-for="type in availableTypes" 
              :key="type" 
              :value="type"
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="sort-by">Sort:</label>
          <select id="sort-by" v-model="sortBy">
            <option value="name">Name</option>
            <option value="accuracy">Accuracy</option>
            <option value="speed">Speed</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Selection Summary -->
    <div v-if="selectionArray.length > 0" class="selection-summary">
      <div class="summary-content">
        <strong>Selected:</strong>
        <span class="selected-count">{{ selectionArray.length }} model{{ selectionArray.length !== 1 ? 's' : '' }}</span>
        <span class="selected-names">
          {{ selectionArray.map(s => s.model.name).join(', ') }}
        </span>
      </div>
      <button @click="clearSelection" class="secondary outline small">
        Clear Selection
      </button>
    </div>

    <!-- Model Grid -->
    <div v-if="filteredModels.length > 0" class="models-grid">
      <ModelCard
        v-for="model in filteredModels"
        :key="model.id"
        :model="model"
        :selected="isSelected(model.id)"
        @select="handleModelSelect"
        @view-details="handleViewDetails"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <h3>No models found</h3>
      <p>Try adjusting your search or filter criteria</p>
    </div>
  </div>
</template>

<style scoped>
.model-selector {
  width: 100%;
}

.selector-controls {
  margin-bottom: 2rem;
}

.search-box {
  margin-bottom: 1rem;
}

.search-box input {
  width: 100%;
  margin-bottom: 0;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  margin: 0;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
}

.filter-group select {
  min-width: 150px;
  margin: 0;
  padding: 0.5rem;
}

.selection-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: var(--primary-focus);
  border: 1px solid var(--primary);
  border-radius: var(--border-radius);
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.selected-count {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background-color: var(--primary);
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.selected-names {
  font-size: 0.875rem;
  color: var(--muted-color);
}

.selection-summary button {
  margin: 0;
  padding: 0.25rem 0.75rem;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state svg {
  color: var(--muted-color);
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: var(--muted-color);
}

.empty-state p {
  margin: 0;
  color: var(--muted-color);
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
  }

  .filter-group {
    width: 100%;
  }

  .filter-group select {
    flex: 1;
  }

  .models-grid {
    grid-template-columns: 1fr;
  }

  .selection-summary {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>