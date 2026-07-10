import { useState, useEffect } from "react";
import { Camera, Edit2, Globe, Instagram, MapPin, Twitter, Youtube, Play, Music, DollarSign, TrendingUp, CheckCircle2, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "motion/react";

export default function Profile() {
  const { currentUser, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: "",
    location: "",
    genre: "",
    bio: "",
    instagram: "",
    twitter: "",
    youtube: "",
    website: "",
  });

  const [originalProfileData, setOriginalProfileData] = useState({
    displayName: "",
    location: "",
    genre: "",
    bio: "",
    instagram: "",
    twitter: "",
    youtube: "",
    website: "",
  });

  const [errors, setErrors] = useState({
    displayName: "",
    bio: "",
    instagram: "",
    twitter: "",
    youtube: "",
    website: "",
  });

  const validateURL = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      displayName: "",
      bio: "",
      instagram: "",
      twitter: "",
      youtube: "",
      website: "",
    };

    if (profileData.displayName.length > 50) {
      newErrors.displayName = "O nome não pode ter mais de 50 caracteres.";
      isValid = false;
    }

    if (profileData.bio.length > 500) {
      newErrors.bio = "A biografia não pode ter mais de 500 caracteres.";
      isValid = false;
    }

    if (profileData.instagram && !validateURL(profileData.instagram)) {
      newErrors.instagram = "Insira uma URL válida (ex: https://instagram.com/...).";
      isValid = false;
    }

    if (profileData.twitter && !validateURL(profileData.twitter)) {
      newErrors.twitter = "Insira uma URL válida (ex: https://twitter.com/...).";
      isValid = false;
    }

    if (profileData.youtube && !validateURL(profileData.youtube)) {
      newErrors.youtube = "Insira uma URL válida (ex: https://youtube.com/...).";
      isValid = false;
    }

    if (profileData.website && !validateURL(profileData.website)) {
      newErrors.website = "Insira uma URL válida (ex: https://seusite.com).";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const [stats, setStats] = useState({
    totalStreams: 0,
    totalRevenue: 0,
    topSongs: [] as any[]
  });

  useEffect(() => {
    if (currentUser) {
      // Fetch profile from Firestore
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const fetchedData = {
              displayName: data.displayName || currentUser.displayName || "",
              location: data.location || "",
              genre: data.genre || "",
              bio: data.bio || "",
              instagram: data.instagram || "",
              twitter: data.twitter || "",
              youtube: data.youtube || "",
              website: data.website || "",
            };
            setProfileData(fetchedData);
            setOriginalProfileData(fetchedData);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();

      // Fetch stats from backend
      const fetchStats = async () => {
        try {
          const response = await fetch(`/api/royalties/${currentUser.uid}`);
          if (response.ok) {
            const data = await response.json();
            const streams = data.reduce((acc: number, curr: any) => acc + curr.streams, 0);
            const revenue = data.reduce((acc: number, curr: any) => acc + curr.revenue, 0);
            setStats({
              totalStreams: streams,
              totalRevenue: revenue,
              topSongs: data.slice(0, 5) // Top 5 songs
            });
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };
      fetchStats();
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, {
        displayName: profileData.displayName,
        location: profileData.location,
        genre: profileData.genre,
        bio: profileData.bio,
        instagram: profileData.instagram,
        twitter: profileData.twitter,
        youtube: profileData.youtube,
        website: profileData.website,
      }, { merge: true });
      setOriginalProfileData(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Perfil do Artista</h1>
          <p className="text-zinc-400 text-lg">Gerencie sua identidade visual e acompanhe seu impacto.</p>
        </div>
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.button 
              key="edit"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors flex items-center gap-2 border border-white/10 shadow-lg backdrop-blur-md"
            >
              <Edit2 size={18} />
              Editar Perfil
            </motion.button>
          ) : (
            <motion.div 
              key="actions"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 w-full md:w-auto"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setProfileData(originalProfileData);
                  setErrors({
                    displayName: "",
                    bio: "",
                    instagram: "",
                    twitter: "",
                    youtube: "",
                    website: "",
                  });
                  setIsEditing(false);
                }}
                className="px-6 py-3 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors w-full md:w-auto flex items-center justify-center gap-2"
              >
                <X size={18} />
                Cancelar
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-[#1db954] text-black font-black rounded-xl hover:bg-[#1ed760] transition-colors disabled:opacity-50 w-full md:w-auto shadow-[0_0_20px_rgba(29,185,84,0.3)] flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Salvar Alterações
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 shadow-2xl"
      >
        {/* Capa */}
        <div className="h-64 md:h-80 bg-gradient-to-br from-[#1db954]/40 via-[#1db954]/10 to-black relative group cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-black/60 rounded-full text-white font-bold backdrop-blur-md border border-white/10 hover:bg-black/80 transition-colors shadow-xl"
            >
              <Camera size={20} />
              Alterar Capa
            </motion.button>
          </div>
        </div>

        <div className="px-8 md:px-12 pb-12 relative">
          {/* Avatar */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-zinc-900 absolute -top-20 md:-top-24 left-8 md:left-12 overflow-hidden group cursor-pointer border-8 border-zinc-900 shadow-2xl"
          >
            <img src={currentUser?.photoURL || "https://picsum.photos/seed/artist/400/400"} alt="Artist Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
              <Camera size={32} className="text-white" />
            </div>
          </motion.div>

          <div className="pt-24 md:pt-32 flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1 w-full">
              <div className="mb-4">
                {isEditing ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full md:w-auto"
                  >
                    <input 
                      type="text" 
                      value={profileData.displayName}
                      maxLength={50}
                      onChange={(e) => {
                        setProfileData({...profileData, displayName: e.target.value});
                        if (errors.displayName) setErrors({...errors, displayName: ""});
                      }}
                      className={`text-4xl md:text-5xl font-black bg-black/40 border ${errors.displayName ? 'border-red-500' : 'border-white/10'} rounded-xl px-6 py-3 text-white focus:outline-none focus:border-[#1db954]/50 w-full md:w-auto transition-colors shadow-inner`}
                      placeholder="Nome Artístico"
                    />
                    {errors.displayName && <p className="text-red-500 text-sm mt-2 font-medium">{errors.displayName}</p>}
                    <p className="text-zinc-500 text-xs mt-2 text-right font-medium">{profileData.displayName.length}/50</p>
                  </motion.div>
                ) : (
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl md:text-5xl font-black text-white tracking-tighter"
                  >
                    {profileData.displayName || "Nome Artístico"}
                  </motion.h2>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-zinc-400">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
                  <MapPin size={16} className="text-[#1db954]" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profileData.location}
                      maxLength={100}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="bg-transparent border-none p-0 text-sm font-medium text-white focus:outline-none focus:ring-0 w-40 placeholder:text-zinc-600"
                      placeholder="Localização"
                    />
                  ) : (
                    <span className="text-sm font-medium">{profileData.location || "Localização não definida"}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
                  <Globe size={16} className="text-[#1db954]" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profileData.genre}
                      maxLength={50}
                      onChange={(e) => setProfileData({...profileData, genre: e.target.value})}
                      className="bg-transparent border-none p-0 text-sm font-medium text-white focus:outline-none focus:ring-0 w-40 placeholder:text-zinc-600"
                      placeholder="Gênero Musical"
                    />
                  ) : (
                    <span className="text-sm font-medium">{profileData.genre || "Gênero não definido"}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 space-y-12">
            {/* Sobre o Artista */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1db954]/10 flex items-center justify-center">
                  <Edit2 size={16} className="text-[#1db954]" />
                </div>
                Sobre o Artista
              </h3>
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <textarea 
                    value={profileData.bio}
                    maxLength={500}
                    onChange={(e) => {
                      setProfileData({...profileData, bio: e.target.value});
                      if (errors.bio) setErrors({...errors, bio: ""});
                    }}
                    className={`w-full h-40 p-6 rounded-2xl bg-black/40 border ${errors.bio ? 'border-red-500' : 'border-white/10'} text-zinc-300 focus:outline-none focus:border-[#1db954]/50 transition-colors resize-none text-base shadow-inner leading-relaxed`}
                    placeholder="Conte um pouco sobre você..."
                  />
                  {errors.bio && <p className="text-red-500 text-sm mt-2 font-medium">{errors.bio}</p>}
                  <p className="text-zinc-500 text-xs mt-2 text-right font-medium">{profileData.bio.length}/500</p>
                </motion.div>
              ) : (
                <div className="bg-white/5 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <p className="text-zinc-300 text-base leading-relaxed">
                    {profileData.bio || "Nenhuma biografia adicionada. Clique em editar para adicionar sua história."}
                  </p>
                </div>
              )}
            </div>

            {/* Links Sociais */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Globe size={16} className="text-white" />
                </div>
                Links Sociais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Instagram */}
                <div>
                  <div className={`flex items-center gap-4 p-4 rounded-2xl bg-black/40 border ${errors.instagram ? 'border-red-500' : 'border-white/5'} focus-within:border-[#1db954]/50 transition-colors shadow-inner`}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shrink-0 shadow-lg">
                      <Instagram size={20} className="text-white" />
                    </div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        placeholder="https://instagram.com/seu_perfil" 
                        value={profileData.instagram}
                        onChange={(e) => {
                          setProfileData({...profileData, instagram: e.target.value});
                          if (errors.instagram) setErrors({...errors, instagram: ""});
                        }}
                        className="bg-transparent border-none focus:outline-none text-white w-full text-base font-medium placeholder:text-zinc-600" 
                      />
                    ) : (
                      profileData.instagram ? (
                        <a href={profileData.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#1db954] transition-colors truncate w-full">
                          {profileData.instagram.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      ) : (
                        <span className="text-zinc-500 italic w-full">Não informado</span>
                      )
                    )}
                  </div>
                  {errors.instagram && <p className="text-red-500 text-sm mt-2 ml-2 font-medium">{errors.instagram}</p>}
                </div>
                
                {/* Twitter */}
                <div>
                  <div className={`flex items-center gap-4 p-4 rounded-2xl bg-black/40 border ${errors.twitter ? 'border-red-500' : 'border-white/5'} focus-within:border-[#1db954]/50 transition-colors shadow-inner`}>
                    <div className="w-12 h-12 rounded-xl bg-[#1DA1F2] flex items-center justify-center shrink-0 shadow-lg">
                      <Twitter size={20} className="text-white" />
                    </div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        placeholder="https://twitter.com/seu_perfil" 
                        value={profileData.twitter}
                        onChange={(e) => {
                          setProfileData({...profileData, twitter: e.target.value});
                          if (errors.twitter) setErrors({...errors, twitter: ""});
                        }}
                        className="bg-transparent border-none focus:outline-none text-white w-full text-base font-medium placeholder:text-zinc-600" 
                      />
                    ) : (
                      profileData.twitter ? (
                        <a href={profileData.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#1DA1F2] transition-colors truncate w-full">
                          {profileData.twitter.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      ) : (
                        <span className="text-zinc-500 italic w-full">Não informado</span>
                      )
                    )}
                  </div>
                  {errors.twitter && <p className="text-red-500 text-sm mt-2 ml-2 font-medium">{errors.twitter}</p>}
                </div>

                {/* YouTube */}
                <div>
                  <div className={`flex items-center gap-4 p-4 rounded-2xl bg-black/40 border ${errors.youtube ? 'border-red-500' : 'border-white/5'} focus-within:border-[#1db954]/50 transition-colors shadow-inner`}>
                    <div className="w-12 h-12 rounded-xl bg-[#FF0000] flex items-center justify-center shrink-0 shadow-lg">
                      <Youtube size={20} className="text-white" />
                    </div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        placeholder="https://youtube.com/c/seu_canal" 
                        value={profileData.youtube}
                        onChange={(e) => {
                          setProfileData({...profileData, youtube: e.target.value});
                          if (errors.youtube) setErrors({...errors, youtube: ""});
                        }}
                        className="bg-transparent border-none focus:outline-none text-white w-full text-base font-medium placeholder:text-zinc-600" 
                      />
                    ) : (
                      profileData.youtube ? (
                        <a href={profileData.youtube} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FF0000] transition-colors truncate w-full">
                          {profileData.youtube.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      ) : (
                        <span className="text-zinc-500 italic w-full">Não informado</span>
                      )
                    )}
                  </div>
                  {errors.youtube && <p className="text-red-500 text-sm mt-2 ml-2 font-medium">{errors.youtube}</p>}
                </div>

                {/* Website */}
                <div>
                  <div className={`flex items-center gap-4 p-4 rounded-2xl bg-black/40 border ${errors.website ? 'border-red-500' : 'border-white/5'} focus-within:border-[#1db954]/50 transition-colors shadow-inner`}>
                    <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center shrink-0 shadow-lg">
                      <Globe size={20} className="text-white" />
                    </div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        placeholder="https://seusite.com" 
                        value={profileData.website}
                        onChange={(e) => {
                          setProfileData({...profileData, website: e.target.value});
                          if (errors.website) setErrors({...errors, website: ""});
                        }}
                        className="bg-transparent border-none focus:outline-none text-white w-full text-base font-medium placeholder:text-zinc-600" 
                      />
                    ) : (
                      profileData.website ? (
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-zinc-300 transition-colors truncate w-full">
                          {profileData.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      ) : (
                        <span className="text-zinc-500 italic w-full">Não informado</span>
                      )
                    )}
                  </div>
                  {errors.website && <p className="text-red-500 text-sm mt-2 ml-2 font-medium">{errors.website}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Estatísticas do Artista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Streams Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Play size={20} className="text-white ml-1" />
                </div>
                <p className="text-zinc-400 font-bold uppercase tracking-wider">Total de Streams</p>
              </div>
              <h3 className="text-5xl font-black text-white tracking-tighter">{stats.totalStreams.toLocaleString()}</h3>
              <div className="mt-6 flex items-center gap-2 text-sm text-[#1db954] font-bold bg-[#1db954]/10 w-fit px-4 py-2 rounded-xl border border-[#1db954]/20">
                <TrendingUp size={16} />
                <span>+15% este mês</span>
              </div>
            </div>
          </motion.div>

          {/* Revenue Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#1db954]/20 to-[#1db954]/5 border border-[#1db954]/30 rounded-3xl p-8 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#1db954]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#1db954]/20 flex items-center justify-center">
                  <DollarSign size={20} className="text-[#1db954]" />
                </div>
                <p className="text-[#1db954] font-bold uppercase tracking-wider">Receita Total</p>
              </div>
              <h3 className="text-5xl font-black text-white tracking-tighter">${stats.totalRevenue.toFixed(2)}</h3>
              <div className="mt-6 flex items-center gap-2 text-sm text-zinc-300 font-bold bg-black/20 w-fit px-4 py-2 rounded-xl border border-white/5">
                <TrendingUp size={16} className="text-[#1db954]" />
                <span>+8% este mês</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Songs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Music size={20} className="text-white" />
              </div>
              Top Músicas
            </h3>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-bold text-zinc-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/5"
            >
              Ver todas
            </motion.button>
          </div>
          
          <div className="space-y-2 flex-1">
            {stats.topSongs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 py-12">
                <div className="p-4 bg-white/5 rounded-full">
                  <Music size={32} className="opacity-50" />
                </div>
                <p className="text-lg font-medium">Nenhuma música encontrada.</p>
              </div>
            ) : (
              stats.topSongs.map((song, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-6">
                    <span className="w-6 text-center text-zinc-500 text-lg font-black">{index + 1}</span>
                    <div className="w-14 h-14 bg-black/40 rounded-xl flex items-center justify-center overflow-hidden shadow-md border border-white/5">
                      {song.cover ? (
                        <img src={`/uploads/covers/${song.cover}`} alt={song.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music size={20} className="text-zinc-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">{song.title}</h4>
                      <p className="text-sm text-zinc-400 font-medium flex items-center gap-1">
                        <Play size={12} />
                        {song.streams.toLocaleString()} streams
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-[#1db954]">
                      ${song.revenue.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
