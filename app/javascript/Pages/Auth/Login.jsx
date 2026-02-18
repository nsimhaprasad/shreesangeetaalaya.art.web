import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Input, Checkbox } from '@components/UI'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const slideInVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.3, 0.5, 0.3],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember_me: false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/users/sign_in')
  }

  const handleGoogleSignIn = () => {
    window.location.href = '/users/auth/google_oauth2'
  }

  const features = [
    { icon: '🎵', text: 'Access learning resources', delay: 0 },
    { icon: '📅', text: 'View class schedules', delay: 0.1 },
    { icon: '📊', text: 'Track your progress', delay: 0.2 },
    { icon: '💰', text: 'Manage payments', delay: 0.3 }
  ]

  return (
    <>
      <Head title="Sign In" />
      
      <div className="min-h-screen flex overflow-hidden">
        {/* Left Side - Hero Section */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <motion.div 
              className="absolute top-20 left-20 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl"
              animate={pulseAnimation}
            />
            <motion.div 
              className="absolute bottom-20 right-20 w-48 h-48 bg-gold-500/20 rounded-full blur-3xl"
              animate={{
                ...pulseAnimation,
                transition: { ...pulseAnimation.transition, delay: 1 }
              }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent-500/20 rounded-full blur-2xl"
              animate={{
                ...pulseAnimation,
                transition: { ...pulseAnimation.transition, delay: 2 }
              }}
            />
          </div>
          
          {/* Floating Music Notes */}
          <motion.div 
            className="absolute top-32 right-20 text-white/10 text-6xl"
            animate={floatAnimation}
          >
            ♪
          </motion.div>
          <motion.div 
            className="absolute bottom-40 left-20 text-white/10 text-4xl"
            animate={{
              ...floatAnimation,
              transition: { ...floatAnimation.transition, delay: 0.5 }
            }}
          >
            ♫
          </motion.div>
          <motion.div 
            className="absolute top-1/2 right-32 text-white/10 text-5xl"
            animate={{
              ...floatAnimation,
              transition: { ...floatAnimation.transition, delay: 1 }
            }}
          >
            ♬
          </motion.div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
            <motion.div 
              className="flex items-center gap-3 mb-8"
              variants={slideInVariants}
            >
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-primary-400 to-gold-400 rounded-xl flex items-center justify-center text-white"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl font-bold">श</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">Shree Sangeetha Aalaya</h1>
                <p className="text-white/60 text-sm">Carnatic Music Institution</p>
              </div>
            </motion.div>

            <motion.div className="max-w-md" variants={containerVariants}>
              <motion.h2 
                className="text-4xl font-display font-bold text-white mb-4 leading-tight"
                variants={itemVariants}
              >
                Begin Your Musical Journey
              </motion.h2>
              <motion.p 
                className="text-white/70 text-lg mb-8"
                variants={itemVariants}
              >
                Access your personalized learning dashboard, track your progress, and connect with expert teachers.
              </motion.p>

              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={containerVariants}
              >
                {features.map((feature, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex items-center gap-3 text-white/80"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.span 
                      className="text-xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: feature.delay }}
                    >
                      {feature.icon}
                    </motion.span>
                    <span className="text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              className="mt-12 pt-8 border-t border-white/10"
              variants={itemVariants}
            >
              <p className="text-white/50 text-sm">
                Trusted by 100+ students across Bangalore
              </p>
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map((i, idx) => (
                  <motion.svg 
                    key={i} 
                    className="w-5 h-5 text-gold-400"
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    whileHover={{ scale: 1.2, rotate: 72 }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
                <span className="ml-2 text-white/70 text-sm">4.9/5 from student reviews</span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="absolute bottom-8 left-12 xl:left-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Shree Sangeetha Aalaya. All rights reserved.
            </p>
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-full max-w-md">
            <motion.div 
              className="lg:hidden flex items-center justify-center gap-3 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-xl font-bold">श</span>
              </motion.div>
              <span className="text-xl font-display font-semibold text-gray-900">Shree Sangeetha Aalaya</span>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl shadow-soft p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <motion.h2 
                  className="text-2xl font-display font-bold text-gray-900"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Welcome back
                </motion.h2>
                <motion.p 
                  className="text-gray-500 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Sign in to continue your learning
                </motion.p>
              </div>

              {/* Google Sign In Button */}
              <motion.button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 mb-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </motion.button>

              {/* Divider */}
              <motion.div 
                className="relative mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Input
                    label="Email address"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                </motion.div>

                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {showPassword ? (
                        <motion.svg 
                          key="hide"
                          className="w-5 h-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </motion.svg>
                      ) : (
                        <motion.svg 
                          key="show"
                          className="w-5 h-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>

                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Checkbox
                    label="Remember me"
                    checked={data.remember_me}
                    onChange={(e) => setData('remember_me', e.target.checked)}
                  />
                  <Link 
                    href="/users/password/new"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button 
                    type="submit" 
                    fullWidth 
                    size="lg"
                    loading={processing}
                  >
                    Sign in
                  </Button>
                </motion.div>
              </form>

              <motion.div 
                className="mt-6 pt-6 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-center text-sm text-gray-500">
                  New student?{' '}
                  <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                    Contact us to enroll
                  </Link>
                </p>
              </motion.div>
            </motion.div>

            <motion.p 
              className="text-center text-xs text-gray-400 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              By signing in, you agree to our Terms of Service and Privacy Policy
            </motion.p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
