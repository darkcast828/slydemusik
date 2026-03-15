import { useState, useEffect } from "react";
import { Camera, Edit2, Globe, Instagram, MapPin, Twitter, Youtube, Play, Music, DollarSign, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

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
            setProfileData({
              displayName: data.displayName || currentUser.displayName || "",
              location: data.location || "",
              genre: data.genre || "",
              bio: data.bio || "",
              instagram: data.instagram || "",
              twitter: data.twitter || "",
              youtube: data.youtube || "",
              website: data.website || "",
            });
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
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">Perfil do Artista</h1>
          <p className="text-gray-400 font-medium">Gerencie sua identidade visual e acompanhe seu impacto.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full transition-all flex items-center gap-2 border border-white/10"
          >
            <Edit2 size={16} />
            Editar Perfil
          </button>
        )}
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Capa */}
        <div className="h-64 bg-gradient-to-br from-[#6c3cff] via-[#0073C7] to-[#1db954] relative group cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white font-medium backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all shadow-xl hover:scale-105 active:scale-95">
              <Camera size={18} />
              Alterar Capa
            </button>
          </div>
        </div>

        <div className="px-6 md:px-10 pb-10 relative">
          {/* Avatar */}
          <div className="w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-[#0f0f0f] bg-gray-800 absolute -top-20 left-6 md:left-10 overflow-hidden group cursor-pointer shadow-2xl">
            <img src={currentUser?.photoURL || "https://picsum.photos/seed/artist/200/200"} alt="Artist Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={28} className="text-white" />
            </div>
          </div>

          <div className="pt-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-3">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                    className="text-3xl md:text-4xl font-black bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#0073C7] focus:border-transparent w-full md:w-auto transition-all"
                    placeholder="Nome Artístico"
                  />
                ) : (
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3 group">
                    {profileData.displayName || "Nome Artístico"}
                  </h2>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-gray-400 font-medium">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <MapPin size={16} className="text-[#0073C7]" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="bg-transparent border-none p-0 text-sm text-white focus:outline-none focus:ring-0 w-32 md:w-40"
                      placeholder="Localização"
                    />
                  ) : (
                    <span className="text-sm">{profileData.location || "Localização não definida"}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Globe size={16} className="text-[#1db954]" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profileData.genre}
                      onChange={(e) => setProfileData({...profileData, genre: e.target.value})}
                      className="bg-transparent border-none p-0 text-sm text-white focus:outline-none focus:ring-0 w-32 md:w-40"
                      placeholder="Gênero Musical"
                    />
                  ) : (
                    <span className="text-sm">{profileData.genre || "Gênero não definido"}</span>
                  )}
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-white/5 text-white font-bold rounded-full hover:bg-white/10 transition-colors w-full md:w-auto"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-xl w-full md:w-auto"
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Sobre o Artista
              </h3>
              {isEditing ? (
                <textarea 
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="w-full h-40 p-5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0073C7] focus:border-transparent transition-all resize-none leading-relaxed"
                  placeholder="Conte um pouco sobre você..."
                />
              ) : (
                <p className="text-gray-300 bg-white/5 p-6 rounded-2xl border border-white/5 leading-relaxed text-lg">
                  {profileData.bio || "Nenhuma biografia adicionada. Clique em editar para adicionar sua história."}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Links Sociais</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 focus-within:border-pink-500/50 focus-within:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <Instagram size={16} className="text-pink-500" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Instagram Username" 
                    value={profileData.instagram}
                    onChange={(e) => setProfileData({...profileData, instagram: e.target.value})}
                    disabled={!isEditing}
                    className="bg-transparent border-none focus:outline-none text-white w-full disabled:opacity-70 text-sm font-medium" 
                  />
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 focus-within:border-blue-400/50 focus-within:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                    <Twitter size={16} className="text-blue-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Twitter Username" 
                    value={profileData.twitter}
                    onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                    disabled={!isEditing}
                    className="bg-transparent border-none focus:outline-none text-white w-full disabled:opacity-70 text-sm font-medium" 
                  />
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 focus-within:border-red-500/50 focus-within:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Youtube size={16} className="text-red-500" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="YouTube Channel URL" 
                    value={profileData.youtube}
                    onChange={(e) => setProfileData({...profileData, youtube: e.target.value})}
                    disabled={!isEditing}
                    className="bg-transparent border-none focus:outline-none text-white w-full disabled:opacity-70 text-sm font-medium" 
                  />
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 focus-within:border-gray-400/50 focus-within:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-400/20 flex items-center justify-center">
                    <Globe size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Website URL" 
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    disabled={!isEditing}
                    className="bg-transparent border-none focus:outline-none text-white w-full disabled:opacity-70 text-sm font-medium" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas do Artista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Streams Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0073C7]/20 to-transparent border border-[#0073C7]/30 rounded-[2rem] p-8 group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#0073C7]/20 rounded-full blur-3xl group-hover:bg-[#0073C7]/30 transition-all duration-500"></div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#0073C7]/20 flex items-center justify-center backdrop-blur-md border border-[#0073C7]/30">
                <Play size={24} className="text-[#0073C7] ml-1" />
              </div>
              <p className="text-gray-300 font-medium text-lg">Total de Streams</p>
            </div>
            <h3 className="text-5xl font-black text-white tracking-tighter relative z-10">{stats.totalStreams.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#0073C7] font-medium relative z-10">
              <TrendingUp size={16} />
              <span>+15% este mês</span>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1db954]/20 to-transparent border border-[#1db954]/30 rounded-[2rem] p-8 group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#1db954]/20 rounded-full blur-3xl group-hover:bg-[#1db954]/30 transition-all duration-500"></div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#1db954]/20 flex items-center justify-center backdrop-blur-md border border-[#1db954]/30">
                <DollarSign size={24} className="text-[#1db954]" />
              </div>
              <p className="text-gray-300 font-medium text-lg">Receita Total</p>
            </div>
            <h3 className="text-5xl font-black text-white tracking-tighter relative z-10">${stats.totalRevenue.toFixed(2)}</h3>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#1db954] font-medium relative z-10">
              <TrendingUp size={16} />
              <span>+8% este mês</span>
            </div>
          </div>
        </div>

        {/* Top Songs */}
        <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-8 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Music size={20} className="text-white" />
              </div>
              Top Músicas
            </h3>
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5">
              Ver todas
            </button>
          </div>
          
          <div className="space-y-2 flex-1">
            {stats.topSongs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 py-12">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <Music size={32} className="opacity-50" />
                </div>
                <p className="font-medium">Nenhuma música encontrada.</p>
              </div>
            ) : (
              stats.topSongs.map((song, index) => (
                <div key={index} className="group flex items-center justify-between p-3 pr-6 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 cursor-pointer">
                  <div className="flex items-center gap-5">
                    <span className="w-6 text-center text-gray-500 font-bold group-hover:text-white transition-colors text-lg">{index + 1}</span>
                    <div className="relative w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                      {song.cover ? (
                        <img src={`/uploads/covers/${song.cover}`} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <Music size={20} className="text-gray-500" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={20} className="text-white fill-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg group-hover:text-[#0073C7] transition-colors">{song.title}</h4>
                      <p className="text-sm text-gray-400 font-medium">{song.streams.toLocaleString()} streams</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1db954] bg-[#1db954]/10 px-4 py-1.5 rounded-full text-sm border border-[#1db954]/20 shadow-sm">
                      ${song.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
