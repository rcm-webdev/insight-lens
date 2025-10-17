<!-- src/views/ModelsView.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import ModelSelector from '@/components/features/ModelSelector.vue';
import { MOCK_MODELS } from '@/types/model.types';
import type { AIModel, ModelSelection } from '@/types/model.types';

const models = ref(MOCK_MODELS);
const selectedModels = ref<ModelSelection[]>([]);
const showDetailsModal = ref(false);
const detailsModel = ref<AIModel | null>(null);

const handleSelectionChanged = (selection: ModelSelection[]) => {
  selectedModels.value = selection;
  console.log('Selection changed:', selection);
};

const handleModelDetails = (model: AIModel) => {
  detailsModel.value = model;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  detailsModel.value = null;
};

const downloadModel = (model: AIModel) => {
  alert(`Downloading ${model.name}...\n(This would trigger actual model download in production)`);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<template>
  <div class="models-view">
    <header class="view-header">
      <div class="header-content">
        <h1>AI Models</h1>
        <p>Select models for analyzing your medical images</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <span class="stat-value">{{ models.length }}</span>
          <span class="stat-label">Total Models</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ models.filter(m => m.status === 'available').length }}</span>
          <span class="stat-label">Available</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ selectedModels.length }}</span>
          <span class="stat-label">Selected</span>
        </div>
      </div>
    </header>

    <section class="selector-section">
      <ModelSelector
        :models="models"
        :multi-select="true"
        @selection-changed="handleSelectionChanged"
        @model-details="handleModelDetails"
      />
    </section>

    <!-- Model Details Modal -->
    <dialog :open="showDetailsModal" @click="closeDetailsModal">
      <article @click.stop v-if="detailsModel">
        <header>
          <button
            aria-label="Close"
            rel="prev"
            @click="closeDetailsModal"
          ></button>
          <h3>{{ detailsModel.name }}</h3>
        </header>

        <div class="modal-body">
          <div class="detail-section">
            <h4>📋 Overview</h4>
            <p>{{ detailsModel.description }}</p>
          </div>

          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Version</span>
              <span class="detail-value">{{ detailsModel.version }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Type</span>
              <span class="detail-value">{{ detailsModel.type }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Status</span>
              <span class="detail-value">{{ detailsModel.status }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">File Size</span>
              <span class="detail-value">{{ detailsModel.fileSize }} MB</span>
            </div>
            <div class="detail-item" v-if="detailsModel.accuracy">
              <span class="detail-label">Accuracy</span>
              <span class="detail-value">{{ detailsModel.accuracy }}%</span>
            </div>
            <div class="detail-item" v-if="detailsModel.inference_time">
              <span class="detail-label">Inference Time</span>
              <span class="detail-value">~{{ detailsModel.inference_time }}ms</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Input Size</span>
              <span class="detail-value">
                {{ detailsModel.inputSize.width }}×{{ detailsModel.inputSize.height }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Updated</span>
              <span class="detail-value">{{ formatDate(detailsModel.lastUpdated) }}</span>
            </div>
          </div>

          <div class="detail-section" v-if="detailsModel.capabilities.length > 0">
            <h4>⚡ Capabilities</h4>
            <ul>
              <li v-for="capability in detailsModel.capabilities" :key="capability">
                {{ capability }}
              </li>
            </ul>
          </div>

          <div class="detail-section" v-if="detailsModel.diseases && detailsModel.diseases.length > 0">
            <h4>🔬 Detectable Conditions</h4>
            <div class="disease-tags">
              <span 
                v-for="disease in detailsModel.diseases" 
                :key="disease"
                class="disease-tag"
              >
                {{ disease }}
              </span>
            </div>
          </div>

          <div class="detail-section" v-if="detailsModel.author">
            <h4>👤 Author</h4>
            <p>{{ detailsModel.author }}</p>
          </div>

          <div class="detail-section">
            <h4>📍 Location</h4>
            <p>
              <span v-if="detailsModel.isLocal" style="color: var(--ins-color)">
                ✓ Installed locally
              </span>
              <span v-else style="color: var(--muted-color)">
                ○ Not installed (cloud-based)
              </span>
            </p>
          </div>
        </div>

        <footer>
          <button
            v-if="!detailsModel.isLocal"
            @click="downloadModel(detailsModel)"
            class="primary"
          >
            Download Model
          </button>
          <button @click="closeDetailsModal" class="secondary">
            Close
          </button>
        </footer>
      </article>
    </dialog>
  </div>
</template>

<style scoped>
.models-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.view-header {
  margin-bottom: 2rem;
}

.header-content h1 {
  margin-bottom: 0.5rem;
}

.header-content p {
  color: var(--muted-color);
  margin: 0 0 1.5rem 0;
}

.header-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  max-width: 400px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: var(--card-background-color);
  border: 1px solid var(--muted-border-color);
  border-radius: var(--border-radius);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--muted-color);
  margin-top: 0.25rem;
  text-transform: uppercase;
  font-weight: 600;
}

.selector-section {
  margin-bottom: 2rem;
}

/* Modal Styles */
dialog {
  max-width: 700px;
  border-radius: var(--border-radius);
  border: none;
  padding: 0;
}

dialog article {
  margin: 0;
}

.modal-body {
  max-height: 60vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h4 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: var(--primary);
}

.detail-section p {
  margin: 0;
  line-height: 1.6;
}

.detail-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.detail-section li {
  margin-bottom: 0.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;
  background-color: var(--card-sectionning-background-color);
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--muted-color);
  font-weight: 600;
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 600;
}

.disease-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.disease-tag {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background-color: var(--primary);
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .models-view {
    padding: 1rem;
  }

  .header-stats {
    grid-template-columns: repeat(3, 1fr);
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  dialog {
    max-width: 95vw;
  }
}
</style>