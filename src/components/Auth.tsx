import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface AuthProps {
  setCurrentPage: (page: 'home' | 'auth' | 'manifesto') => void;
}

export default function Auth({ setCurrentPage }: AuthProps) {
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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Successfully logged in!');
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

      {/* Left Side - Form Area */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 min-h-screen relative bg-off-white shadow-[12px_0_24px_-12px_rgba(158,58,68,0.1)] z-10 pt-24 pb-16 md:py-16">
        <div className="max-w-lg w-full mx-auto relative z-10">
          
          <div className={`text-left flex flex-col items-start ${isLogin ? 'mb-12 md:mb-16' : 'mb-8 md:mb-10'}`}>
            <img src="/logo.png" alt="Aphrodite Logo" className={`${isLogin ? 'h-32 md:h-44 mb-8 md:mb-10' : 'h-16 md:h-20 mb-4'} w-auto object-contain -ml-3 transition-all duration-500`} />
            <h2 className={`font-serif italic text-deep-rose mb-2 leading-tight transition-all duration-500 ${isLogin ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'}`}>
              {isLogin ? 'Welcome Back.' : 'Join The Club.'}
            </h2>
            <p className="font-sans text-[11px] tracking-[0.25em] text-neutral-dark/60 uppercase">
              {isLogin ? 'Enter your credentials.' : 'Submit your application.'}
            </p>
          </div>

          {error && <p className="text-red-500 font-sans text-xs tracking-wider mb-4 border border-red-200 bg-red-50 p-3 rounded">{error}</p>}
          {message && <p className="text-green-600 font-sans text-xs tracking-wider mb-4 border border-green-200 bg-green-50 p-3 rounded">{message}</p>}

          <form className={`flex flex-col ${isLogin ? 'space-y-10' : 'space-y-5 md:space-y-4 md:space-y-6'}`} onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="flex flex-col group mb-2">
                  <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-deep-rose mb-1.5 md:mb-3 font-bold">Select Avatar</label>
                  <div className="flex gap-4 overflow-x-auto py-2 pb-4 scrollbar-hide snap-x w-full">
                    {[...Array(8)].map((_, i) => (
                      <button 
                        key={i} 
                        type="button" 
                        onClick={() => setAvatarIndex(i + 1)}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex-shrink-0 border-[1.5px] transition-all p-0.5 snap-center ${avatarIndex === i + 1 ? 'border-deep-rose scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                      >
                        <img src={`/avatar${i + 1}.png`} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover rounded-full mix-blend-multiply" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col group">
                    <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-deep-rose mb-1.5 md:mb-3 font-bold">First Name</label>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-2 md:py-3 focus:outline-none focus:border-deep-rose font-sans text-sm transition-colors text-neutral-dark placeholder:text-neutral-dark/20 w-full"
                      required={!isLogin}
                    />
                  </div>
                  <div className="flex flex-col group">
                    <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-deep-rose mb-1.5 md:mb-3 font-bold">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-2 md:py-3 focus:outline-none focus:border-deep-rose font-sans text-sm transition-colors text-neutral-dark placeholder:text-neutral-dark/20 w-full"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col group">
                    <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-deep-rose mb-1.5 md:mb-3 font-bold">Age</label>
                    <input 
                      type="number" 
                      min="18"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                      className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-2 md:py-3 focus:outline-none focus:border-deep-rose font-sans text-sm transition-colors text-neutral-dark placeholder:text-neutral-dark/20 w-full"
                      required={!isLogin}
                    />
                  </div>
                  <div className="flex flex-col group">
                    <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-deep-rose mb-1.5 md:mb-3 font-bold">Gender</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-2 md:py-3 focus:outline-none focus:border-deep-rose font-sans text-sm transition-colors text-neutral-dark w-full appearance-none rounded-none cursor-pointer"
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
              <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-deep-rose mb-1.5 md:mb-3 font-bold">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-2 md:py-3 focus:outline-none focus:border-deep-rose font-sans text-sm transition-colors text-neutral-dark placeholder:text-neutral-dark/20"
                required
              />
            </div>
            
            <div className="flex flex-col group relative">
               <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-deep-rose mb-1.5 md:mb-3 font-bold">Password</label>
               <input 
                 type={showPassword ? "text" : "password"} 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="••••••••"
                 className="bg-transparent border-b-[1.5px] border-deep-rose/20 py-2 md:py-3 focus:outline-none focus:border-deep-rose font-sans text-sm transition-colors text-neutral-dark placeholder:text-neutral-dark/20 pr-16"
                 required
               />
               <button 
                 type="button" 
                 onClick={() => setShowPassword(!showPassword)} 
                 className="absolute right-0 bottom-4 text-[9px] font-sans uppercase tracking-[0.2em] text-neutral-dark/40 hover:text-primary-pink transition-colors font-bold"
               >
                 {showPassword ? 'Hide' : 'Show'}
               </button>
               {isLogin && (
                 <button type="button" className="absolute right-0 top-0 text-[9px] font-sans uppercase tracking-[0.1em] text-neutral-dark/40 hover:text-primary-pink transition-colors mt-1">
                   Forgot?
                 </button>
               )}
            </div>

            <button 
               type="submit" 
               disabled={loading}
               className={`w-full text-off-white font-sans text-xs uppercase tracking-[0.2em] font-bold py-5 rounded-full transition-all transform shadow-md hover:shadow-xl mt-8 ${loading ? 'bg-deep-rose/70 cursor-not-allowed mx-auto flex justify-center items-center' : 'bg-deep-rose hover:bg-primary-pink hover:-translate-y-1 active:scale-95'}`}
            >
               {loading ? (isLogin ? 'Signing In...' : 'Sending Application...') : (isLogin ? 'Sign In' : 'Apply For Membership')}
            </button>
          </form>

          <div className="mt-12 text-left z-10 border-t border-deep-rose/10 pt-8">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-neutral-dark/50">
              {isLogin ? "Don't have an account?" : "Already a member?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-deep-rose font-bold hover:text-primary-pink transition-colors ml-2 decoration-2 underline-offset-4 hover:underline"
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