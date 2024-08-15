import FloatingShape from "./components/FloatingShape"
import {Routes, Route, Navigate} from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import EmailVerification from './pages/EmailVerification'
import {Toaster} from 'react-hot-toast'
import { useAuthstore } from "./store/authStore"
import {  useEffect } from "react"
import Home from "./pages/Home"
import LoadingSpinner from "./components/LoadingSpinner"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

//protect route
const ProtectRoutes = ({children})=>{

  const {isAuthenticated, user} = useAuthstore()
  if(!isAuthenticated)
   return <Navigate to='/sign-up' replace />

  if(user?.isVerified !== undefined && !user?.isVerified )
    return <Navigate to='/verify-email' replace />
  return children
}

const RedirectAuthUser = ({children})=>{
  const {isAuthenticated, user} = useAuthstore()
  if(isAuthenticated &&  user?.isVerified !== undefined && user?.isVerified)
   return <Navigate to='/' replace />
  return children
}
function App() {

  const {checkAuth, isCheckingAuth} = useAuthstore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  if(isCheckingAuth) return <LoadingSpinner />
 
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>

      <FloatingShape color="bg-green-500" sizes="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" sizes="w-48 h-48" top="70%" left="80%" delay={0} />
      <FloatingShape color="bg-lime-500" sizes="w-32 h-32" top="40%" left="-10%" delay={0} />

      <Routes>
        <Route path="/" element={
          <ProtectRoutes>
            <Home />
          </ProtectRoutes>
        } />
        <Route path="/sign-in" element={<RedirectAuthUser>
          <SignIn />
        </RedirectAuthUser>} />
        <Route path="/sign-up" element={<RedirectAuthUser>
          <SignUp />
        </RedirectAuthUser>} />
        <Route path="/verify-email" element={<RedirectAuthUser>
          <EmailVerification />
        </RedirectAuthUser>} />

        <Route path="/forgot-password" element={<RedirectAuthUser>
          <ForgotPassword />
        </RedirectAuthUser>} />

        <Route path="/reset-password/:token" element={<RedirectAuthUser>
          <ResetPassword />
        </RedirectAuthUser>} />

      </Routes>
      <Toaster />
    </div>

  )
}

export default App
