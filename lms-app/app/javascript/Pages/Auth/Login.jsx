import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { Button, Input, Checkbox } from '@components/UI'

const musicNoteIcon = (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
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

  const features = [
    { icon: '🎵', text: 'Access learning resources' },
    { icon: '📅', text: 'View class schedules' },
    { icon: '📊', text: 'Track your progress' },
    { icon: '💰', text: 'Manage payments' }
  ]

  return (
    <>
      <Head title="Sign In" />
      
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-gold-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent-500/20 rounded-full blur-2xl" />
          </div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-gold-400 rounded-xl flex items-center justify-center text-white">
                <span className="text-2xl font-bold">श</span>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">Shree Sangeetha Aalaya</h1>
                <p className="text-white/60 text-sm">Carnatic Music Institution</p>
              </div>
            </div>

            <div className="max-w-md">
              <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
                Begin Your Musical Journey
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Access your personalized learning dashboard, track your progress, and connect with expert teachers.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-white/80">
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-white/50 text-sm">
                Trusted by 100+ students across Bangalore
              </p>
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-white/70 text-sm">4.9/5 from student reviews</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-12 xl:left-20">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Shree Sangeetha Aalaya. All rights reserved.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white">
                <span className="text-xl font-bold">श</span>
              </div>
              <span className="text-xl font-display font-semibold text-gray-900">Shree Sangeetha Aalaya</span>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-gray-900">Welcome back</h2>
                <p className="text-gray-500 mt-1">Sign in to continue your learning</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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

                <div className="relative">
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <Checkbox
                    label="Remember me"
                    checked={data.remember_me}
                    onChange={(e) => setData('remember_me', e.target.checked)}
                  />
                  <Link 
                    href="/users/password/new"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg"
                  loading={processing}
                >
                  Sign in
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-center text-sm text-gray-500">
                  New student?{' '}
                  <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                    Contact us to enroll
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
