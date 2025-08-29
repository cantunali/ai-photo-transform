import axios from 'axios';

const API_CONFIG = {
  N8N_WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL,
  DEMO_MODE: import.meta.env.VITE_DEMO_MODE === 'true',
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760,
  SUPPORTED_FORMATS: import.meta.env.VITE_SUPPORTED_FORMATS?.split(',') || ['image/jpeg', 'image/png', 'image/webp']
};

export interface StyleSelections {
  clothingStyle: string;
  clothingColor: string;
  environment: string;
}

export interface N8NRequest {
  imageUrl: string;
  selections: StyleSelections;
}

export interface N8NResponse {
  imageUrl: string;
  originalRequest: N8NRequest;
  status: 'success' | 'error';
  message?: string;
}

// Dosya validasyonu
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > API_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Dosya boyutu ${(API_CONFIG.MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB'dan büyük olamaz`
    };
  }

  if (!API_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: 'Desteklenmeyen dosya formatı. JPG, PNG veya WebP kullanın'
    };
  }

  return { valid: true };
};

// Base64'e çevirme
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// N8N'e istek gönderme
export const processImageWithN8N = async (
  imageUrl: string, 
  selections: StyleSelections
): Promise<N8NResponse> => {
  try {
    // Demo mode kontrolü
    if (API_CONFIG.DEMO_MODE) {
      console.log('🎭 Demo Mode: N8N simülasyonu çalışıyor...');
      
      // Demo bekleme süresi (gerçekçi yapmak için)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      return {
        imageUrl: imageUrl, // Demo'da aynı fotoğrafı döndür
        originalRequest: { imageUrl, selections },
        status: 'success',
        message: 'Demo modda işlendi'
      };
    }

    // Gerçek N8N isteği
    if (!API_CONFIG.N8N_WEBHOOK_URL || API_CONFIG.N8N_WEBHOOK_URL.includes('your-n8n')) {
      throw new Error('N8N webhook URL ayarlanmamış. .env dosyasını kontrol edin');
    }

    const payload: N8NRequest = {
      imageUrl,
      selections
    };

    console.log('🚀 N8N\'e istek gönderiliyor...', payload);

    const response = await axios.post<N8NResponse>(
      API_CONFIG.N8N_WEBHOOK_URL,
      payload,
      {
        timeout: 60000, // 60 saniye timeout
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('✅ N8N yanıtı alındı:', response.data);

    return response.data;

  } catch (error: any) {
    console.error('❌ N8N hatası:', error);

    return {
      imageUrl: imageUrl,
      originalRequest: { imageUrl, selections },
      status: 'error',
      message: error.response?.data?.message || error.message || 'Bilinmeyen hata oluştu'
    };
  }
};

// Dosya yükleme servisi (basit base64 çözümü)
export const uploadImageFile = async (file: File): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    // Dosya validasyonu
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Base64'e çevir
    const base64Url = await fileToBase64(file);
    
    console.log('📁 Dosya base64 formatına çevrildi');

    return {
      success: true,
      imageUrl: base64Url
    };

  } catch (error: any) {
    console.error('❌ Dosya yükleme hatası:', error);
    return {
      success: false,
      error: 'Dosya yüklenirken hata oluştu'
    };
  }
};

export default {
  validateFile,
  fileToBase64,
  processImageWithN8N,
  uploadImageFile,
  API_CONFIG
};