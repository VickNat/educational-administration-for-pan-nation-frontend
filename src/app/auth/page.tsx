"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { RiLockLine, RiMailLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine } from "react-icons/ri"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import logo from "@/../public/images/logo.png"

function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login, isLoggingIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
      toast.success("Successfully logged in!")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Login failed. Please check your credentials.")
      console.error("Login failed:", error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left side with logo and gradient */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#195cbc] via-[#195cbc] to-[#14b8a6] items-center justify-center p-12 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/15 rounded-full blur-lg"
          />
        </div>

        <Link href="/" className="block relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[250px] text-center"
          >
            <motion.div variants={logoVariants} className=" bg-white rounded-full p-1">
              <Image
                src={logo}
                alt="Class Bridge Logo"
                width={200}
                height={200}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-white text-4xl font-bold mt-6 drop-shadow-lg">
              Class Bridge
            </motion.h1>
            <motion.p variants={itemVariants} className="text-white/90 text-lg mt-2 drop-shadow-md">
              Modern Educational Platform
            </motion.p>
          </motion.div>
        </Link>
      </motion.div>

      {/* Right side with form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #195cbc 2px, transparent 2px), radial-gradient(circle at 75% 75%, #14b8a6 2px, transparent 2px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[400px] relative z-10"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white/80  rounded-2xl p-8 border border-white/20"
          >
            {/* Mobile logo */}
            <motion.div variants={itemVariants} className="md:hidden flex justify-center mb-6">
              <Image
                src="/placeholder.svg?height=80&width=80"
                alt="Class Bridge Logo"
                width={80}
                height={80}
                className="w-20 h-20"
                priority
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8 ">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#195cbc] to-[#14b8a6] bg-clip-text text-transparent">
                Welcome Back!
              </h2>
              <p className="mt-3 text-gray-600">Please sign in to your account to continue</p>
            </motion.div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div variants={itemVariants} className="space-y-6">
                <div>
                  <motion.div whileFocus={{ scale: 1.02 }} className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <RiMailLine className="h-5 w-5 text-gray-400 group-focus-within:text-[#195cbc] transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none relative block w-full px-4 py-4 pl-12 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#195cbc]/20 focus:border-[#195cbc] transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </motion.div>
                </div>

                <div>
                  <motion.div whileFocus={{ scale: 1.02 }} className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <RiLockLine className="h-5 w-5 text-gray-400 group-focus-within:text-[#195cbc] transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="appearance-none relative block w-full px-4 py-4 pl-12 pr-12 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#195cbc]/20 focus:border-[#195cbc] transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <RiEyeOffLine className="h-5 w-5 text-gray-400 hover:text-[#195cbc] transition-colors" />
                      ) : (
                        <RiEyeLine className="h-5 w-5 text-gray-400 hover:text-[#195cbc] transition-colors" />
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoggingIn}
                  className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#195cbc] to-[#14b8a6] hover:from-[#14478a] hover:to-[#0f9688] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#195cbc] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoggingIn ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <RiArrowRightLine className="h-5 w-5" />
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-[#195cbc] transition-colors">
                ← Back to homepage
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function AuthPage() {
  return <AuthForm />
}
