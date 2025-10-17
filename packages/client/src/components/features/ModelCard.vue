
<script setup lang="ts">
import { computed } from 'vue';
import type { AIModel } from '@/types/model.types';

const props = defineProps<{
  model: AIModel;
  selected?: boolean;
}>();

const emit = defineEmits<{
  select: [model: AIModel];
  viewDetails: [model: AIModel];
}>();

const statusColor = computed(() => {
  switch (props.model.status) {
    case 'available': return 'var(--ins-color)';
    case 'loading': return 'var(--primary)';
    case 'unavailable': return 'var(--muted-color)';
    case 'error': return 'var(--del-color)';
    default: return 'var(--muted-color)';
  }
});

const statusText = computed(() => {
  switch (props.model.status) {
    case 'available': return '● Available';
    case 'loading': return '● Loading...';
    case 'unavailable': return '○ Unavailable';
    case 'error': return '● Error';
    default: return '○ Unknown';
  }
});

const typeIcon = computed(() => {
  switch (props.model.type) {
    case 'classification': return '🏷️';
    case 'segmentation': return '🎯';
    case 'detection': return '🔍';
    case 'custom': return '⚙️';
    default: return '📊';
  }
});

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handleSelect = () => {
  if (props.model.status === 'available') {
    emit('select', props.model);
  }
};
</script>

<template>
  <article 
    class="model-card" 
    :class="{ 
      'selected': selected, 
      'disabled': model.status !== 'available' 
    }"
    @click="handleSelect"
  >
    <header class="model-header">
      <div class="model-title-row">
        <span class="model-icon">{{ typeIcon }}</span>
        <h4>{{ model.name }}</h4>
      </div>
      <span class="model-status" :style="{ color: statusColor }">
        {{ statusText }}
      </span>
    </header>

    <div class="model-body">
      <p class="model-description">{{ model.description }}</p>

      <div class="model-meta">
        <div class="meta-item">
          <span class="meta-label">Version</span>
          <span class="meta-value">{{ model.version }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Type</span>
          <span class="meta-value">{{ model.type }}</span>
        </div>
        <div v-if="model.accuracy" class="meta-item">
          <span class="meta-label">Accuracy</span>
          <span class="meta-value">{{ model.accuracy }}%</span>
        </div>
        <div v-if="model.inference_time" class="meta-item">
          <span class="meta-label">Speed</span>
          <span class="meta-value">~{{ model.inference_time }}ms</span>
        </div>
      </div>

      <div v-if="model.capabilities.length > 0" class="model-capabilities">
        <span 
          v-for="capability in model.capabilities.slice(0, 3)" 
          :key="capability"
          class="capability-badge"
        >
          {{ capability }}
        </span>
      </div>

      <div v-if="model.diseases && model.diseases.length > 0" class="model-diseases">
        <strong>Detects:</strong>
        <span class="disease-list">{{ model.diseases.slice(0, 4).join(', ') }}</span>
        <span v-if="model.diseases.length > 4" class="more-count">
          +{{ model.diseases.length - 4 }} more
        </span>
      </div>
    </div>

    <footer class="model-footer">
      <div class="footer-info">
        <span class="file-size">{{ model.fileSize }} MB</span>
        <span class="separator">•</span>
        <span class="last-updated">{{ formatDate(model.lastUpdated) }}</span>
      </div>
      <button
        v-if="model.status === 'available'"
        @click.stop="emit('viewDetails', model)"
        class="outline small"
      >
        Details
      </button>
    </footer>

    <div v-if="selected" class="selected-indicator">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  </article>
</template>

<style scoped>
.model-card {
  position: relative;
  border: 2px solid var(--muted-border-color);
  border-radius: var(--border-radius);
  padding: 1.25rem;
  background-color: var(--card-background-color);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.model-card:hover:not(.disabled) {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--card-box-shadow);
}

.model-card.selected {
  border-color: var(--primary);
  background-color: var(--primary-focus);
}

.model-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.model-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.model-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.model-header h4 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.3;
}

.model-status {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.model-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.model-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--muted-color);
  line-height: 1.5;
}

.model-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.meta-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--muted-color);
  font-weight: 600;
}

.meta-value {
  font-size: 0.875rem;
  font-weight: 600;
}

.model-capabilities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.capability-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--primary);
  color: white;
  border-radius: 4px;
  font-weight: 500;
}

.model-diseases {
  font-size: 0.75rem;
  padding: 0.75rem;
  background-color: var(--card-sectionning-background-color);
  border-radius: 4px;
  line-height: 1.6;
}

.model-diseases strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--primary);
}

.disease-list {
  color: var(--muted-color);
}

.more-count {
  display: inline-block;
  margin-left: 0.25rem;
  font-weight: 600;
  color: var(--primary);
}

.model-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--muted-border-color);
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--muted-color);
}

.separator {
  opacity: 0.5;
}

.model-footer button {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  margin: 0;
}

.selected-indicator {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>