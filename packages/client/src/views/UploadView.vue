<script setup lang="ts">
import { ref } from 'vue';
import FileUploader from '@/components/features/FileUploader.vue';
import type { UploadFile } from '@/types/upload.types';

const uploaderRef = ref<InstanceType<typeof FileUploader> | null>(null);
const uploadedFiles = ref<UploadFile[]>([]);
const isProcessing = ref(false);

const handleFilesAdded = (files: UploadFile[]) => {
  console.log('Files added:', files);
  uploadedFiles.value.push(...files);
};

const handleFileRemoved = (fileId: string) => {
  console.log('File removed:', fileId);
  const index = uploadedFiles.value.findIndex(f => f.id === fileId);
  if (index !== -1) {
    uploadedFiles.value.splice(index, 1);
  }
};

const processImages = async () => {
  if (uploadedFiles.value.length === 0) {
    alert('Please select at least one image to process');
    return;
  }

  isProcessing.value = true;

  // Simulate processing (replace with actual API call later)
  try {
    console.log('Processing files:', uploadedFiles.value);
    
    // Simulate upload progress
    for (const file of uploadedFiles.value) {
      file.status = 'uploading';
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        file.progress = i;
      }
      
      file.status = 'success';
    }

    alert('Images processed successfully!');
  } catch (error) {
    console.error('Processing error:', error);
    alert('Failed to process images');
  } finally {
    isProcessing.value = false;
  }
};

const resetUpload = () => {
  uploaderRef.value?.clearAll();
  uploadedFiles.value = [];
};
</script>

<template>
  <div class="upload-view">
    <header class="view-header">
      <h1>Upload Images</h1>
      <p>Select OCT or retinal fundus images for AI analysis</p>
    </header>

    <section class="upload-section">
      <FileUploader
        ref="uploaderRef"
        @files-added="handleFilesAdded"
        @file-removed="handleFileRemoved"
      />
    </section>

    <section v-if="uploadedFiles.length > 0" class="actions-section">
      <div class="actions-group">
        <button
          @click="processImages"
          :disabled="isProcessing"
          :aria-busy="isProcessing"
        >
          {{ isProcessing ? 'Processing...' : 'Process Images' }}
        </button>
        
        <button
          @click="resetUpload"
          class="secondary"
          :disabled="isProcessing"
        >
          Reset
        </button>
      </div>

      <div class="info-box">
        <h4>📊 Upload Summary</h4>
        <ul>
          <li><strong>Total files:</strong> {{ uploadedFiles.length }}</li>
          <li>
            <strong>Total size:</strong>
            {{
              (uploadedFiles.reduce((sum, f) => sum + f.metadata.size, 0) / (1024 * 1024)).toFixed(2)
            }} MB
          </li>
          <li>
            <strong>Status:</strong>
            <span v-if="isProcessing" style="color: var(--primary)">Processing...</span>
            <span v-else>Ready to process</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="help-section">
      <details>
        <summary><strong>ℹ️ Upload Guidelines</strong></summary>
        <div class="help-content">
          <h5>Supported Image Types</h5>
          <ul>
            <li><strong>OCT Scans:</strong> Optical Coherence Tomography images (.jpg, .png, .bmp, .tiff)</li>
            <li><strong>Fundus Images:</strong> Retinal photographs (.jpg, .png)</li>
          </ul>

          <h5>Image Requirements</h5>
          <ul>
            <li>Maximum file size: 10 MB per image</li>
            <li>Maximum files: 20 images per batch</li>
            <li>Recommended resolution: 512×512 pixels or higher</li>
            <li>Color or grayscale images accepted</li>
          </ul>

          <h5>Best Practices</h5>
          <ul>
            <li>Ensure images are properly focused and well-lit</li>
            <li>Remove any patient identifying information before upload</li>
            <li>Group similar image types together for batch processing</li>
            <li>Use high-quality source images for better analysis results</li>
          </ul>
        </div>
      </details>
    </section>
  </div>
</template>

<style scoped>
.upload-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.view-header {
  margin-bottom: 2rem;
}

.view-header h1 {
  margin-bottom: 0.5rem;
}

.view-header p {
  color: var(--muted-color);
  margin: 0;
}

.upload-section {
  margin-bottom: 2rem;
}

.actions-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.actions-group {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.actions-group button {
  flex: 1;
}

.info-box {
  padding: 1.5rem;
  background-color: var(--card-background-color);
  border: 1px solid var(--muted-border-color);
  border-radius: var(--border-radius);
}

.info-box h4 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.info-box ul {
  margin: 0;
  padding-left: 1.5rem;
}

.info-box li {
  margin-bottom: 0.5rem;
}

.help-section {
  margin-top: 3rem;
}

.help-content {
  padding: 1rem 0;
}

.help-content h5 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.help-content ul {
  margin-bottom: 1rem;
}

.help-content li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .actions-section {
    grid-template-columns: 1fr;
  }

  .actions-group {
    flex-direction: column;
  }
}
</style>