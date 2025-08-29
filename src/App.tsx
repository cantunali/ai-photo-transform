import React, { useState } from 'react';

function App() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'style' | 'process' | 'result'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setCurrentStep('style');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = () => {
    setCurrentStep('process');
    
    setTimeout(() => {
      setCurrentStep('result');
    }, 3000);
  };

  const resetApp = () => {
    setCurrentStep('upload');
    setSelectedImage(null);
  };

  const handleDownload = () => {
    if (selectedImage) {
      const link = document.createElement('a');
      link.download = 'ai-donusturulmus-fotograf.jpg';
      link.href = selectedImage;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('Fotoğraf indirildi! 📁');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          🎨 AI Fotoğraf Dönüştürücü
        </h1>

        {/* Progress Steps */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
            {['upload', 'style', 'process', 'result'].map((step, index) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: step === currentStep ? '#fbbf24' : 'rgba(255,255,255,0.3)',
                  color: step === currentStep ? 'black' : 'white'
                }}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div style={{
                    width: '32px',
                    height: '2px',
                    background: 'rgba(255,255,255,0.3)',
                    marginLeft: '8px'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          
          {currentStep === 'upload' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📸</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Fotoğrafınızı Yükleyin
              </h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                JPG, PNG veya WebP formatında fotoğrafınızı seçin
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                style={{
                  display: 'inline-block',
                  background: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                📷 Fotoğraf Seç
              </label>
            </div>
          )}

          {currentStep === 'style' && selectedImage && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
                ✨ Stilinizi Seçin
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>📸 Yüklenen Fotoğraf:</h3>
                  <img
                    src={selectedImage}
                    alt="Yüklenen"
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb'
                    }}
                  />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>👔 Stil Seçenekleri:</h3>
                  <div style={{ marginBottom: '2rem' }}>
                    {[
                      '💼 Takım Elbise', 
                      '👕 Casual', 
                      '🏃 Sport', 
                      '👔 Business', 
                      '🎉 Parti', 
                      '✨ Smart Casual'
                    ].map((style) => (
                      <div key={style} style={{
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        backgroundColor: '#f9f9f9',
                        transition: 'background 0.3s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#e3f2fd'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#f9f9f9'}
                      >
                        {style}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleProcess}
                    style={{
                      width: '100%',
                      background: '#10b981',
                      color: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.3s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
                  >
                    🚀 Dönüştürmeye Başla
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'process' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1rem',
                animation: 'spin 2s linear infinite'
              }}>⚙️</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                🤖 AI İşliyor...
              </h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Fotoğrafınız AI tarafından dönüştürülüyor, lütfen bekleyin.
              </p>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '75%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s infinite'
                }}></div>
              </div>
              <p style={{ color: '#999', marginTop: '1rem', fontSize: '0.9rem' }}>
                ⏱️ Tahmini süre: 30-60 saniye
              </p>
            </div>
          )}

          {currentStep === 'result' && selectedImage && (
            <div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '2rem', 
                textAlign: 'center',
                color: '#10b981'
              }}>
                ✅ Başarıyla Tamamlandı!
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>📷 Öncesi:</h3>
                  <img
                    src={selectedImage}
                    alt="Öncesi"
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb'
                    }}
                  />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>✨ Sonrası:</h3>
                  <img
                    src={selectedImage}
                    alt="Sonrası"
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '4px solid #10b981',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                    }}
                  />
                  <p style={{ 
                    fontSize: '0.8rem', 
                    color: '#666', 
                    marginTop: '8px',
                    fontStyle: 'italic'
                  }}>
                    💡 Demo modda aynı fotoğraf gösteriliyor
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={resetApp}
                  style={{
                    flex: 1,
                    background: '#3b82f6',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                >
                  🔄 Yeni Fotoğraf
                </button>
                <button 
                  onClick={handleDownload}
                  style={{
                    flex: 1,
                    background: '#10b981',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
                >
                  📥 İndir
                </button>
              </div>
              <div style={{ 
                marginTop: '1rem', 
                padding: '12px', 
                background: '#f0fdf4', 
                borderRadius: '8px',
                border: '1px solid #bbf7d0'
              }}>
                <p style={{ color: '#166534', fontSize: '0.9rem', margin: 0 }}>
                  🎉 Fotoğrafınız başarıyla dönüştürüldü! İndir butonuna tıklayarak bilgisayarınıza kaydedin.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;