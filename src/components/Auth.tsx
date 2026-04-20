import type { UserProfileData } from "../App";
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface AuthProps {
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfileData | null>>;

  setCurrentPage: (page: 'home' | 'auth' | 'manifesto' | 'dashboard') => void;
}

export default function Auth({ setCurrentPage, setUserProfile }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        const metadata = data.user.user_metadata || {};
        setUserProfile({
          firstName: metadata.first_name || "User",
          lastName: metadata.last_name || "",
          avatarUrl: metadata.avatar_url || "/avatar1.png",
          bio: metadata.bio || "",
          hobbies: metadata.hobbies || "",
          location: metadata.location || "",
          hasCompletedTour: metadata.hasCompletedTour || false
        });
        setMessage('Successfully logged in!');
        setTimeout(() => setCurrentPage('dashboard'), 500);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              age: parseInt(age, 10),
              gender,
              avatar_url: `/avatar${avatarIndex}.png`,
            }
          }
        });
        if (error) throw error;
        setUserProfile({
          firstName,
          lastName,
          avatarUrl: `/avatar${avatarIndex}.png`,
          bio: "",
          hobbies: "",
          location: "",
          hasCompletedTour: false
        });
        setMessage('Application submitted! Check your email for a confirmation link.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-off-white flex flex-col md:flex-row relative z-50 animate-on-scroll min-h-screen">
      
      {/* Return Button fixed top left */}
      <button 
        onClick={() => setCurrentPage('home')}
        className="absolute top-10 md:top-12 left-8 md:left-12 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-deep-rose hover:text-primary-pink transition-colors flex items-center group z-50 fixed md:fixed md:top-12"
      >
        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> Return
      </button>

      {/* Demo Skip Button (Top Right) */}
      <button 
        type="button"
        onClick={() => setCurrentPage('dashboard')}
        className="absolute top-10 md:top-12 right-8 md:right-12 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-deep-rose border border-deep-rose/20 px-3 py-1.5 rounded-full hover:bg-deep-rose/5 transition-all z-50"
      >
        Demo Dashboard
      </button>

      {/* Left Side - Form Area */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 lg:px-16 h-svh overflow-y-auto relative bg-off-white shadow-[12px_0_24px_-12px_rgba(158,58,68,0.1)] z-10 py-6 md:py-8">
        <div className="max-w-md w-full mx-auto relative z-10 flex flex-col h-full justify-center">
          
          <div className={`text-left flex flex-col items-start ${isLogin ? 'mb-8 md:mb-10' : 'mb-4 md:mb-6'}`}>
            <img src="/logo.png" alt="Aphrodite Logo" className={`${isLogin ? 'h-24 md:h-32 mb-6' : 'h-12 md:h-16 mb-2 md:mb-4'} w-auto object-contain -ml-3 transition-all duration-500`} />
            <h2 className={`font-serif italic text-deep-rose mb-1.5 md:mb-2 leading-tight transition-all duration-500 ${isLogin ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
              {isLogin ? 'Welcome Back.' : 'Join The Club.'}
            </h2>
            <p className="font-sans text-[10px] tracking-[0.2em] text-neutral-dark/60 uppercase">
              {isLogin ? 'Enter your credentials.' : 'Submit your application.'}
            </p>
          </div>

          {error && <p className="text-red-500 font-sans text-xs tracking-wider mb-3 border border-red-200 bg-red-50 p-2 rounded">{error}</p>}
          {message && <p className="text-green-600 font-sans text-xs tracking-wider mb-3 border border-green-200 bg-green-50 p-2 rounded">{message}</p>}

          <form className={`flex flex-col ${isLogin ? 'space-y-6 md:space-y-8' : 'space-y-3 md:space-y-4'}`} onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="flex flex-col group mb-1 md:mb-2">
                  <label className="font-sans text-[9px] uppercase tracking-[0.15em] text-deep-rose mb-1 font-bold">Select Avatar</label>
                  <div className="flex gap-4 md:gap-5 overflow-x-auto py-1 pb-3 scrollbar-hide snap-x w-full items-center">
                    {[...Array(8)].map((_, i) => (
                      <button 
                        key={i} 
                        type="button" 
                        onClick={() => setAvatarIndex(i + 1)}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex-shrink-0 border-[1.5px] transition-all p-0.5 snap-center ${avatarIndex === i + 1 ? 'border-deep-rose scale-[1.15] shadow-sm' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.10]'}`}
                      >
                        <img src={`/avatar${i + 1}.png`} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover rounded-full mix-blend-multiply" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-5">
                  <div className="flex flex-col group">
                    <label className="font-sans text-[9px] uppercase tracking-[0.15em] text-deep-rose mb-1 font-bold">First Name</label>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-1.5 md:py-2 focus:outline-none focus:border-deep-rose font-sans text-xs md:text-sm transition-colors text-neutral-dark placeholder:text-neutral-dark/20 w-full"
                      required={!isLogin}
                    />
                  </div>
                  <div className="flex flex-col group">
                    <label className="font-sans text-[9px] uppercase tracking-[0.15em] text-deep-rose mb-1 font-bold">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-1.5 md:py-2 focus:outline-none focus:border-deep-rose font-sans text-xs md:text-sm transition-colors text-neutral-dark placeholder:text-neutral-dark/20 w-full"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-5">
                  <div className="flex flex-col group">
                    <label className="font-sans text-[9px] uppercase tracking-[0.15em] text-deep-rose mb-1 font-bold">Age</label>
                    <input 
                      type="number" 
                      min="18"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                      className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-1.5 md:py-2 focus:outline-none focus:border-deep-rose font-sans text-xs md:text-sm transition-colors text-neutral-dark placeholder:text-neutral-dark/20 w-full"
                      required={!isLogin}
                    />
                  </div>
                  <div className="flex flex-col group">
                    <label className="font-sans text-[9px] uppercase tracking-[0.15em] text-deep-rose mb-1 font-bold">Gender</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-1.5 md:py-2 focus:outline-none focus:border-deep-rose font-sans text-xs md:text-sm transition-colors text-neutral-dark w-full appearance-none rounded-none cursor-pointer"
                      required={!isLogin}
                    >
                      <option value="" disabled className="text-neutral-dark/40">Select...</option>
                      <option value="female" className="text-neutral-dark">Female</option>
                      <option value="male" className="text-neutral-dark">Male</option>
                      <option value="non-binary" className="text-neutral-dark">Non-binary</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex flex-col group">
              <label className="font-sans text-[9px] uppercase tracking-[0.15em] text-deep-rose mb-1 font-bold">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-1.5 md:py-2 focus:outline-none focus:border-deep-rose font-sans text-xs md:text-sm transition-colors text-neutral-dark placeholder:text-neutral-dark/20"
                required
              />
            </div>
            
            <div className="flex flex-col group relative">
               <label className="font-sans text-[9px] uppercase tracking-[0.15em] text-deep-rose mb-1 font-bold">Password</label>
               <input 
                 type={showPassword ? "text" : "password"} 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="••••••••"
                 className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-1.5 md:py-2 focus:outline-none focus:border-deep-rose font-sans text-xs md:text-sm transition-colors text-neutral-dark placeholder:text-neutral-dark/20 pr-12"
                 required
               />
               <button 
                 type="button" 
                 onClick={() => setShowPassword(!showPassword)} 
                 className="absolute right-0 bottom-2 md:bottom-3 text-[8px] font-sans uppercase tracking-[0.2em] text-neutral-dark/40 hover:text-primary-pink transition-colors font-bold"
               >
                 {showPassword ? 'Hide' : 'Show'}
               </button>
               {isLogin && (
                 <button type="button" className="absolute right-0 top-0 text-[8px] font-sans uppercase tracking-[0.1em] text-neutral-dark/40 hover:text-primary-pink transition-colors mt-0.5">
                   Forgot?
                 </button>
               )}
            </div>

            <button 
               type="submit" 
               disabled={loading}
               className={`w-full text-off-white font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold py-3 md:py-4 rounded-full transition-all transform shadow-md hover:shadow-xl mt-4 md:mt-6 ${loading ? 'bg-deep-rose/70 cursor-not-allowed flex justify-center items-center' : 'bg-deep-rose hover:bg-primary-pink hover:-translate-y-0.5 active:scale-95'}`}
            >
               {loading ? (isLogin ? 'Signing In...' : 'Sending Application...') : (isLogin ? 'Sign In' : 'Apply For Membership')}
            </button>
          </form>

          <div className="mt-6 md:mt-8 text-left z-10 border-t border-deep-rose/10 pt-4 md:pt-6">
            <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-neutral-dark/50">
              {isLogin ? "Don't have an account?" : "Already a member?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-deep-rose font-bold hover:text-primary-pink transition-colors ml-1.5 md:ml-2 decoration-2 underline-offset-4 hover:underline"
              >
                {isLogin ? 'Apply Now' : 'Sign In'}
              </button>
            </p>
          </div>

        </div>
      </div>

      {/* Right Side - Visual Atmosphere */}
      <div className="w-full md:w-1/2 min-h-[50svh] md:h-screen md:sticky md:top-0 relative bg-soft-blush overflow-hidden flex flex-col justify-end p-12 lg:p-20 hidden md:flex transition-colors duration-1000">
         {/* Background Image */}
         <img 
           key={isLogin ? 'login' : 'register'}
           src={isLogin ? "https://images.unsplash.com/photo-1541271696563-3be2f555fc4e?q=80&w=1000&auto=format&fit=crop" : "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1000&auto=format&fit=crop"} 
           alt={isLogin ? "Romance aesthetics" : "Intimate connection"} 
           className="absolute inset-0 w-full h-full object-cover mix-blend-multiply scale-105 filter brightness-110 sepia-[10%] opacity-90 animate-fade-in"
         />
         {/* Vignette Gradients */}
         <div className="absolute inset-0 bg-gradient-to-t from-deep-rose/90 via-deep-rose/30 to-transparent mix-blend-overlay"></div>
         <div className="absolute inset-0 bg-gradient-to-l from-deep-rose/40 to-transparent mix-blend-overlay"></div>
         
         <div className="relative z-10 text-off-white drop-shadow-md pb-8">
           <div className="w-16 h-[1.5px] bg-off-white mb-8 opacity-60"></div>
           <blockquote className="font-serif italic text-3xl md:text-5xl leading-tight mb-6 max-w-xl">
             "To find love is to step out of the loud, chaotic marketplace and into a quiet, sacred room."
           </blockquote>
           <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold opacity-80">
             The Aphrodite Ethos
           </span>
         </div>
      </div>

    </div>
  );
}