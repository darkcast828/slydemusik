import React, { useState } from "react";
import { Upload as UploadIcon, Music, Image as ImageIcon, CheckCircle, Loader2, Server, Globe, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";

export default function Upload() {
  const { currentUser } = useAuth();
  
  // Wizard State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Form Data State
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  
  // Distribution Flow States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [musicUploadProgress, setMusicUploadProgress] = useState(0);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  // 0: Idle, 1: Uploading, 2: Processing Metadata, 3: Distributor API, 4: Done

  // File Processing States
  const [isProcessingCover, setIsProcessingCover] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [isProcessingMusic, setIsProcessingMusic] = useState(false);
  const [musicProgress, setMusicProgress] = useState(0);

  const handleNext = () => {
    setMessage("");
    if (currentStep === 1) {
      if (!title || !artist || !genre || !releaseDate) {
        setMessage("Preencha todos os campos obrigatórios.");
        return;
      }
    } else if (currentStep === 2) {
      if (!cover) {
        setMessage("Selecione uma capa para o álbum.");
        return;
      }
    } else if (currentStep === 3) {
      if (!file) {
        setMessage("Selecione o arquivo de áudio.");
        return;
      }
    }
    setCurrentStep((prev) => (prev < 4 ? (prev + 1) as any : prev));
  };

  const handlePrev = () => {
    setMessage("");
    setCurrentStep((prev) => (prev > 1 ? (prev - 1) as any : prev));
  };

  const handleSubmit = async () => {
    if (!file || !title || !artist || !genre || !releaseDate || !cover) {
      setMessage("Erro: Preencha todos os campos obrigatórios e envie os arquivos.");
      return;
    }

    setIsUploading(true);
    setMessage("");
    setUploadStep(1); // Step 1: Uploading to our server
    setUploadProgress(0);
    setMusicUploadProgress(0);
    setCoverUploadProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);
    formData.append("genre", genre);
    formData.append("release_date", releaseDate);
    formData.append("music", file);
    formData.append("cover", cover);
    if (currentUser) {
      formData.append("artist_id", currentUser.uid);
    }

    // Estimate sizes for separate progress bars
    // FormData appends in order, so music uploads first, then cover.
    // We add a small buffer for the text fields.
    const textFieldsSize = 1024; // 1KB estimate
    const musicStart = textFieldsSize;
    const musicEnd = musicStart + file.size;
    const coverStart = musicEnd;
    const coverEnd = coverStart + cover.size;
    const totalEstimatedSize = coverEnd;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/music/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);

        // Calculate individual file progress
        // Since we don't know exact byte boundaries of multipart/form-data, we estimate based on loaded bytes
        
        // Music Progress
        if (event.loaded < musicStart) {
          setMusicUploadProgress(0);
        } else if (event.loaded >= musicEnd) {
          setMusicUploadProgress(100);
        } else {
          const mProgress = Math.round(((event.loaded - musicStart) / file.size) * 100);
          setMusicUploadProgress(Math.min(100, Math.max(0, mProgress)));
        }

        // Cover Progress
        if (event.loaded < coverStart) {
          setCoverUploadProgress(0);
        } else if (event.loaded >= coverEnd) {
          setCoverUploadProgress(100);
        } else {
          const cProgress = Math.round(((event.loaded - coverStart) / cover.size) * 100);
          setCoverUploadProgress(Math.min(100, Math.max(0, cProgress)));
        }
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadProgress(100);
        setMusicUploadProgress(100);
        setCoverUploadProgress(100);
        setUploadStep(2); // Step 2: Processing Metadata
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setUploadStep(3); // Step 3: Distributor API
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        setUploadStep(4); // Step 4: Done
        setMessage("Sucesso! Música enviada e em processo de distribuição para mais de 45 plataformas.");
        
        // Reset form after a delay
        setTimeout(() => {
          setTitle("");
          setArtist("");
          setAlbum("");
          setGenre("");
          setReleaseDate("");
          setFile(null);
          setCover(null);
          setUploadStep(0);
          setIsUploading(false);
          setUploadProgress(0);
          setMusicUploadProgress(0);
          setCoverUploadProgress(0);
          setMessage("");
          setCurrentStep(1);
        }, 5000);
      } else {
        let errorMsg = "Erro ao enviar música";
        try {
          const data = JSON.parse(xhr.responseText);
          errorMsg = data.error || errorMsg;
        } catch (e) {}
        setMessage(errorMsg);
        setIsUploading(false);
        setUploadStep(0);
        setUploadProgress(0);
        setMusicUploadProgress(0);
        setCoverUploadProgress(0);
      }
    };

    xhr.onerror = () => {
      setMessage("Erro de conexão");
      setIsUploading(false);
      setUploadStep(0);
      setUploadProgress(0);
      setMusicUploadProgress(0);
      setCoverUploadProgress(0);
    };

    xhr.send(formData);
  };

  const stepTitles = [
    "Informações Básicas",
    "Capa do Álbum",
    "Arquivo de Áudio",
    "Revisão e Distribuição"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload de Música</h1>
        <p className="text-gray-400">Envie sua música para distribuição global em mais de 45 plataformas.</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1db954] rounded-full z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>
          
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${
                  currentStep >= step 
                    ? 'bg-[#1db954] text-black shadow-[0_0_15px_rgba(29,185,84,0.4)]' 
                    : 'bg-[#111] border-2 border-white/20 text-gray-500'
                }`}
              >
                {currentStep > step ? <CheckCircle size={20} /> : step}
              </div>
              <span className={`text-xs font-medium hidden sm:block absolute -bottom-6 whitespace-nowrap ${currentStep >= step ? 'text-white' : 'text-gray-500'}`}>
                {stepTitles[step - 1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[400px] flex flex-col">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Informações Básicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Título da Música *</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Minha Nova Música"
                      className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#1db954] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Artista Principal *</label>
                    <input 
                      type="text" 
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      placeholder="Ex: Seu Nome Artístico"
                      className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#1db954] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Álbum / EP</label>
                    <input 
                      type="text" 
                      value={album}
                      onChange={(e) => setAlbum(e.target.value)}
                      placeholder="Ex: Meu Primeiro Álbum (Opcional para Singles)"
                      className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#1db954] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Gênero Primário *</label>
                    <select 
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#1db954] transition-colors appearance-none"
                    >
                      <option value="">Selecione um gênero</option>
                      <option value="afrobeats">Afrobeats</option>
                      <option value="hiphop">Hip Hop / Rap</option>
                      <option value="pop">Pop</option>
                      <option value="rnb">R&B</option>
                      <option value="electronic">Eletrônica</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Data de Lançamento *</label>
                    <input 
                      type="date" 
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#1db954] transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Capa do Álbum</h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Arte da Capa (3000x3000px) *</label>
                  <div className="relative group cursor-pointer mt-4">
                    <input 
                      id="cover-file"
                      type="file" 
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                          setIsProcessingCover(true);
                          setCoverProgress(0);
                          const interval = setInterval(() => {
                            setCoverProgress(prev => {
                              if (prev >= 100) {
                                clearInterval(interval);
                                setCover(selectedFile);
                                setIsProcessingCover(false);
                                return 100;
                              }
                              return prev + 15;
                            });
                          }, 50);
                        }
                      }}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={isProcessingCover}
                    />
                    <div className={`w-full p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-colors ${cover || isProcessingCover ? 'border-[#1db954] bg-[#1db954]/5' : 'border-white/20 bg-black/50 group-hover:border-[#1db954]/50 group-hover:bg-white/5'}`}>
                      {isProcessingCover ? (
                        <div className="w-full max-w-xs text-center space-y-4">
                          <Loader2 size={40} className="animate-spin text-[#1db954] mx-auto" />
                          <p className="text-white font-medium">Processando imagem...</p>
                          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div className="bg-[#1db954] h-2 rounded-full transition-all duration-200" style={{ width: `${coverProgress}%` }}></div>
                          </div>
                          <p className="text-xs text-[#1db954] font-bold">{coverProgress}%</p>
                        </div>
                      ) : cover ? (
                        <>
                          <div className="w-24 h-24 rounded-2xl bg-[#1db954]/20 flex items-center justify-center text-[#1db954] overflow-hidden">
                            <img src={URL.createObjectURL(cover)} alt="Cover Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-center">
                            <p className="text-white font-medium text-lg truncate max-w-[300px]">{cover.name}</p>
                            <p className="text-sm text-[#1db954] mt-1">Imagem selecionada com sucesso</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#1db954] transition-colors">
                            <ImageIcon size={48} />
                          </div>
                          <div className="text-center">
                            <p className="text-white font-medium text-lg">Clique ou arraste a capa</p>
                            <p className="text-sm text-gray-500 mt-2">JPG, PNG (Max 10MB)<br/>Recomendado: 3000x3000px</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Arquivo de Áudio</h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Música (WAV ou MP3) *</label>
                  <div className="relative group cursor-pointer mt-4">
                    <input 
                      id="music-file"
                      type="file" 
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.wav') && !selectedFile.name.toLowerCase().endsWith('.mp3') && selectedFile.type !== 'audio/wav' && selectedFile.type !== 'audio/mpeg') {
                          setMessage("Erro: O arquivo de áudio deve ser no formato WAV ou MP3.");
                          setFile(null);
                          e.target.value = '';
                        } else if (selectedFile) {
                          setIsProcessingMusic(true);
                          setMusicProgress(0);
                          setMessage("");
                          const interval = setInterval(() => {
                            setMusicProgress(prev => {
                              if (prev >= 100) {
                                clearInterval(interval);
                                setFile(selectedFile);
                                setIsProcessingMusic(false);
                                return 100;
                              }
                              return prev + 10;
                            });
                          }, 50);
                        }
                      }}
                      accept=".wav,.mp3,audio/wav,audio/mpeg"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={isProcessingMusic}
                    />
                    <div className={`w-full p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-colors ${file || isProcessingMusic ? 'border-[#1db954] bg-[#1db954]/5' : 'border-white/20 bg-black/50 group-hover:border-[#1db954]/50 group-hover:bg-white/5'}`}>
                      {isProcessingMusic ? (
                        <div className="w-full max-w-xs text-center space-y-4">
                          <Loader2 size={40} className="animate-spin text-[#1db954] mx-auto" />
                          <p className="text-white font-medium">Analisando áudio...</p>
                          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div className="bg-[#1db954] h-2 rounded-full transition-all duration-200" style={{ width: `${musicProgress}%` }}></div>
                          </div>
                          <p className="text-xs text-[#1db954] font-bold">{musicProgress}%</p>
                        </div>
                      ) : file ? (
                        <>
                          <div className="w-24 h-24 rounded-full bg-[#1db954]/20 flex items-center justify-center text-[#1db954]">
                            <Music size={48} />
                          </div>
                          <div className="text-center">
                            <p className="text-white font-medium text-lg truncate max-w-[300px]">{file.name}</p>
                            <p className="text-sm text-[#1db954] mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#1db954] transition-colors">
                            <UploadIcon size={48} />
                          </div>
                          <div className="text-center">
                            <p className="text-white font-medium text-lg">Clique ou arraste o áudio</p>
                            <p className="text-sm text-gray-500 mt-2">WAV ou MP3 (Max 150MB)<br/>Qualidade recomendada: 16-bit, 44.1kHz</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Revisão e Distribuição</h2>
                
                {!isUploading ? (
                  <>
                    <div className="bg-black/40 rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row gap-6 items-center md:items-start">
                      {cover && (
                        <img 
                          src={URL.createObjectURL(cover)} 
                          alt="Cover" 
                          className="w-40 h-40 rounded-xl object-cover shadow-2xl"
                        />
                      )}
                      <div className="flex-1 space-y-4 w-full">
                        <div>
                          <h3 className="text-3xl font-bold text-white">{title}</h3>
                          <p className="text-xl text-gray-400">{artist}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Gênero</p>
                            <p className="text-white font-medium capitalize">{genre}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Lançamento</p>
                            <p className="text-white font-medium">{new Date(releaseDate).toLocaleDateString('pt-BR')}</p>
                          </div>
                          {album && (
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Álbum</p>
                              <p className="text-white font-medium">{album}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white">Plataformas de Destino</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Spotify', 'Apple Music', 'YouTube Music', 'TikTok', 'Deezer', 'Amazon Music', 'Tidal'].map(platform => (
                          <div key={platform} className="flex items-center gap-2 p-3 rounded-lg border border-[#1db954]/30 bg-[#1db954]/5">
                            <CheckCircle size={16} className="text-[#1db954]" />
                            <span className="text-sm font-medium text-white">{platform}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 p-3 rounded-lg border border-white/10 bg-white/5">
                          <span className="text-sm font-medium text-gray-400">+ 38 outras</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-black/40 border border-[#1db954]/30 rounded-2xl p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">Status da Distribuição</h3>
                    
                    <div className="space-y-6 max-w-md mx-auto">
                      {/* Step 1 */}
                      <div className={`flex items-center gap-4 transition-opacity duration-500 ${uploadStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${uploadStep > 1 ? 'bg-[#1db954] text-black' : uploadStep === 1 ? 'bg-[#1db954]/20 text-[#1db954] border border-[#1db954]' : 'bg-white/10 text-gray-400'}`}>
                          {uploadStep > 1 ? <CheckCircle size={24} /> : uploadStep === 1 ? <Loader2 size={24} className="animate-spin" /> : <UploadIcon size={24} />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-lg ${uploadStep >= 1 ? 'text-white' : 'text-gray-400'}`}>1. Upload para SLYDE MUSIK</p>
                          <p className="text-sm text-gray-500 mb-4">Enviando arquivos de áudio e capa com segurança.</p>
                          {uploadStep === 1 && (
                            <div className="space-y-4">
                              {/* Music Progress */}
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-300 flex items-center gap-1"><Music size={12}/> Áudio ({file?.name})</span>
                                  <span className="text-[#1db954] font-bold">{musicUploadProgress}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-[#1db954] h-1.5 rounded-full transition-all duration-300 ease-out" 
                                    style={{ width: `${musicUploadProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              {/* Cover Progress */}
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-300 flex items-center gap-1"><ImageIcon size={12}/> Capa ({cover?.name})</span>
                                  <span className="text-[#1db954] font-bold">{coverUploadProgress}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-[#1db954] h-1.5 rounded-full transition-all duration-300 ease-out" 
                                    style={{ width: `${coverUploadProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              {/* Total Progress */}
                              <div className="pt-2 border-t border-white/10">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400 font-medium">Progresso Total</span>
                                  <span className="text-white font-bold">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                                  <div 
                                    className="bg-white h-1 rounded-full transition-all duration-300 ease-out" 
                                    style={{ width: `${uploadProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className={`flex items-center gap-4 transition-opacity duration-500 ${uploadStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${uploadStep > 2 ? 'bg-[#1db954] text-black' : uploadStep === 2 ? 'bg-[#1db954]/20 text-[#1db954] border border-[#1db954]' : 'bg-white/10 text-gray-400'}`}>
                          {uploadStep > 2 ? <CheckCircle size={24} /> : uploadStep === 2 ? <Loader2 size={24} className="animate-spin" /> : <Server size={24} />}
                        </div>
                        <div>
                          <p className={`font-bold text-lg ${uploadStep >= 2 ? 'text-white' : 'text-gray-400'}`}>2. Processamento de Metadata</p>
                          <p className="text-sm text-gray-500">Validando informações, ISRC e qualidade de áudio.</p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className={`flex items-center gap-4 transition-opacity duration-500 ${uploadStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${uploadStep > 3 ? 'bg-[#1db954] text-black' : uploadStep === 3 ? 'bg-[#1db954]/20 text-[#1db954] border border-[#1db954]' : 'bg-white/10 text-gray-400'}`}>
                          {uploadStep > 3 ? <CheckCircle size={24} /> : uploadStep === 3 ? <Loader2 size={24} className="animate-spin" /> : <Globe size={24} />}
                        </div>
                        <div>
                          <p className={`font-bold text-lg ${uploadStep >= 3 ? 'text-white' : 'text-gray-400'}`}>3. API da Distribuidora</p>
                          <p className="text-sm text-gray-500">Conectando com parceiros agregadores.</p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className={`flex items-center gap-4 transition-opacity duration-500 ${uploadStep >= 4 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${uploadStep >= 4 ? 'bg-[#1db954] text-black' : 'bg-white/10 text-gray-400'}`}>
                          <CheckCircle size={24} />
                        </div>
                        <div>
                          <p className={`font-bold text-lg ${uploadStep >= 4 ? 'text-[#1db954]' : 'text-gray-400'}`}>4. Distribuição Concluída</p>
                          <p className="text-sm text-gray-500">Música a caminho de 45+ plataformas globais.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message */}
        {message && !isUploading && (
          <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${message.includes("Erro") || message.includes("Preencha") || message.includes("Selecione") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-[#1db954]/10 text-[#1db954] border border-[#1db954]/20"}`}>
            {message.includes("Erro") || message.includes("Preencha") || message.includes("Selecione") ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span className="font-medium">{message}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        {!isUploading && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                currentStep === 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              <ChevronLeft size={20} />
              Voltar
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-transform hover:scale-105 active:scale-95"
              >
                Próximo Passo
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-[#1db954] text-black hover:bg-[#1ed760] rounded-full font-bold transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(29,185,84,0.4)]"
              >
                <UploadIcon size={20} />
                Distribuir Música
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
