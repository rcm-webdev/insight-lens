<script setup lang="ts">
import { ref, computed } from 'vue';
import type { UploadFile, UploadConfig, ValidationResult } from '@/types/upload.types';
import { DEFAULT_UPLOAD_CONFIG } from '@/types/upload.types';

const props = defineProps<{
  config?: Partial<UploadConfig>;
}>();

const emit = defineEmits<{
  filesAdded: [files: UploadFile[]];
  fileRemoved: [fileId: string];
}>();

const uploadConfig = computed<UploadConfig>(() => ({
  ...DEFAULT_UPLOAD_CONFIG,
  ...props.config
}));

const files = ref<UploadFile[]>([]);
const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Generate unique ID for files
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format file size for display
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Validate individual file
const validateFile = (file: File): ValidationResult => {
  const errors: string[] = [];

  // Check file size
  if (file.size > uploadConfig.value.maxFileSize) {
    errors.push(`File size exceeds ${formatFileSize(uploadConfig.value.maxFileSize)}`);
  }

  // Check file type
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType = uploadConfig.value.acceptedTypes.includes(file.type) ||
    uploadConfig.value.acceptedExtensions.includes(fileExtension);

  if (!isValidType) {
    errors.push('File type not supported. Please upload medical images (JPEG, PNG, BMP, TIFF)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Create image preview
const createPreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve(e.target?.result as string);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Get image dimensions
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Process files
const processFiles = async (fileList: FileList | File[]) => {
  const filesToAdd: UploadFile[] = [];

  // Check if adding files would exceed max
  if (files.value.length + fileList.length > uploadConfig.value.maxFiles) {
    alert(`Maximum ${uploadConfig.value.maxFiles} files allowed`);
    return;
  }

  for (const file of Array.from(fileList)) {
    const validation = validateFile(file);

    if (!validation.isValid) {
      alert(`${file.name}: ${validation.errors.join(', ')}`);
      continue;
    }

    try {
      const preview = await createPreview(file);
      const dimensions = await getImageDimensions(file);

      const uploadFile: UploadFile = {
        id: generateId(),
        file,
        preview,
        status: 'pending',
        progress: 0,
        metadata: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          dimensions
        }
      };

      filesToAdd.push(uploadFile);
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      alert(`Failed to process ${file.name}`);
    }
  }

  if (filesToAdd.length > 0) {
    files.value.push(...filesToAdd);
    emit('filesAdded', filesToAdd);
  }
};

// Handle file input change
const handleFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    processFiles(target.files);
    target.value = ''; // Reset input
  }
};

// Handle drag events
const handleDragEnter = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;

  if (e.dataTransfer?.files) {
    processFiles(e.dataTransfer.files);
  }
};

// Trigger file input click
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

// Remove file
const removeFile = (fileId: string) => {
  const index = files.value.findIndex(f => f.id === fileId);
  if (index !== -1) {
    files.value.splice(index, 1);
    emit('fileRemoved', fileId);
  }
};

// Clear all files
const clearAll = () => {
  files.value = [];
};

defineExpose({
  clearAll,
  files
});
</script>

<template>
  <div class="file-uploader">
    <!-- Drop Zone -->
    <div
      class="drop-zone"
      :class="{ 'dragging': isDragging }"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInputRef"
        type="file"
        multiple
        :accept="uploadConfig.acceptedTypes.join(',')"
        @change="handleFileInput"
        style="display: none"
      />

      <div class="drop-zone-content">
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
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>

        <h3>Drop images here or click to select</h3>
        <p>
          Supports: {{ uploadConfig.acceptedExtensions.join(', ') }}<br>
          Max size: {{ formatFileSize(uploadConfig.maxFileSize) }} per file<br>
          Max files: {{ uploadConfig.maxFiles }}
        </p>
      </div>
    </div>

    <!-- File List -->
    <div v-if="files.length > 0" class="file-list">
      <div class="file-list-header">
        <h4>Selected Files ({{ files.length }})</h4>
        <button @click="clearAll" class="secondary outline small">Clear All</button>
      </div>

      <div class="file-grid">
        <div v-for="uploadFile in files" :key="uploadFile.id" class="file-card">
          <div class="file-preview">
            <img :src="uploadFile.preview" :alt="uploadFile.metadata.name" />
          </div>

          <div class="file-info">
            <p class="file-name">{{ uploadFile.metadata.name }}</p>
            <p class="file-meta">
              {{ formatFileSize(uploadFile.metadata.size) }}
              <span v-if="uploadFile.metadata.dimensions">
                • {{ uploadFile.metadata.dimensions.width }}×{{ uploadFile.metadata.dimensions.height }}
              </span>
            </p>
          </div>

          <button
            @click.stop="removeFile(uploadFile.id)"
            class="remove-btn"
            title="Remove file"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-uploader {
  width: 100%;
}

.drop-zone {
  border: 2px dashed var(--primary);
  border-radius: var(--border-radius);
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--card-background-color);
}

.drop-zone:hover {
  border-color: var(--primary-hover);
  background-color: var(--card-sectionning-background-color);
}

.drop-zone.dragging {
  border-color: var(--primary-focus);
  background-color: var(--primary-focus);
  opacity: 0.8;
}

.drop-zone-content svg {
  color: var(--primary);
  margin-bottom: 1rem;
}

.drop-zone-content h3 {
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.drop-zone-content p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--muted-color);
  line-height: 1.6;
}

.file-list {
  margin-top: 2rem;
}

.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.file-list-header h4 {
  margin: 0;
}

.file-list-header button {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.file-card {
  position: relative;
  border: 1px solid var(--muted-border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  background-color: var(--card-background-color);
  transition: transform 0.2s ease;
}

.file-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--card-box-shadow);
}

.file-preview {
  width: 100%;
  height: 150px;
  overflow: hidden;
  background-color: var(--card-sectionning-background-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-info {
  padding: 0.75rem;
}

.file-name {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  margin: 0;
  font-size: 0.75rem;
  color: var(--muted-color);
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background-color: var(--del-color);
  color: white;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.file-card:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background-color: var(--del-hover-color);
}
</style>