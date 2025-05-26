"use client"

import type React from "react"
import logo from "@/../public/images/logo.png"
import landing from "@/../public/images/landing.png"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  RiUserLine,
  RiTeamLine,
  RiBookLine,
  RiMessage2Line,
  RiCalendarEventLine,
  RiNotification3Line,
  RiFileListLine,
  RiShieldCheckLine,
  RiArrowDownLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiStarFill,
} from "react-icons/ri"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useAuth } from "./context/AuthContext"

const features = [
  {
    icon: <RiUserLine className="h-8 w-8 text-primary" />,
    title: "User Authentication & Authorization",
    description:
      "Secure role-based access control for students, parents, teachers, and directors with email-based authentication.",
  },
  {
    icon: <RiTeamLine className="h-8 w-8 text-primary" />,
    title: "Multi-Role Management",
    description:
      "Comprehensive user management system supporting students, parents, teachers, and administrative staff.",
  },
  {
    icon: <RiBookLine className="h-8 w-8 text-primary" />,
    title: "Academic Management",
    description: "Complete academic tracking including grades, assignments, attendance, and progress reports.",
  },
  {
    icon: <RiMessage2Line className="h-8 w-8 text-primary" />,
    title: "Communication Hub",
    description: "Integrated messaging system for seamless communication between all stakeholders.",
  },
  {
    icon: <RiCalendarEventLine className="h-8 w-8 text-primary" />,
    title: "Event Management",
    description: "Schedule and manage school events, meetings, and important dates with automated notifications.",
  },
  {
    icon: <RiNotification3Line className="h-8 w-8 text-primary" />,
    title: "Real-time Notifications",
    description: "Instant alerts for grades, announcements, events, and important updates.",
  },
  {
    icon: <RiFileListLine className="h-8 w-8 text-primary" />,
    title: "Document Management",
    description: "Centralized storage and sharing of educational resources, assignments, and administrative documents.",
  },
  {
    icon: <RiShieldCheckLine className="h-8 w-8 text-primary" />,
    title: "Data Security",
    description: "Enterprise-grade security ensuring protection of sensitive educational and personal data.",
  },
]

const faqs = [
  {
    question: "How secure is Class Bridge?",
    answer:
      "Class Bridge employs enterprise-grade security measures including encrypted data transmission, secure authentication, and regular security audits to protect sensitive educational information.",
  },
  {
    question: "Can parents track their child's progress?",
    answer:
      "Yes, parents have dedicated access to view their child's grades, attendance, assignments, and receive real-time notifications about their academic progress.",
  },
  {
    question: "Is Class Bridge suitable for all school sizes?",
    answer:
      "Class Bridge is designed to scale from small private schools to large educational institutions, with flexible features that adapt to your needs.",
  },
  {
    question: "How does the communication system work?",
    answer:
      "Our integrated messaging system allows direct communication between teachers, students, parents, and administrators with real-time notifications and message history.",
  },
  {
    question: "Can teachers manage multiple classes?",
    answer:
      "Yes, teachers can efficiently manage multiple classes, track student progress across all subjects, and communicate with students and parents from a single dashboard.",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Principal, Greenwood Elementary",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "Class Bridge has revolutionized how we manage our school. The communication features have improved parent engagement by 300%.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Math Teacher, Lincoln High School",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "The grading system is intuitive and saves me hours each week. Students and parents love the real-time updates.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Parent",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "I can finally stay connected with my child's education. The notifications keep me informed about everything important.",
    rating: 5,
  },
  {
    name: "David Thompson",
    role: "IT Director, Valley School District",
    image: "/placeholder.svg?height=80&width=80",
    quote: "Implementation was seamless, and the security features give us complete peace of mind with student data.",
    rating: 5,
  },
]

const systemFeatures = [
  {
    title: "Student Dashboard",
    description: "Comprehensive view of grades, assignments, and upcoming events",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    title: "Teacher Portal",
    description: "Powerful tools for grade management, communication, and class organization",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    title: "Parent Interface",
    description: "Real-time access to child's academic progress and school communications",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    title: "Admin Control Panel",
    description: "Complete school management with user administration and system analytics",
    image: "/placeholder.svg?height=300&width=500",
  },
]

const timeline = [
  {
    year: "2023",
    title: "Project Inception",
    description: "Class Bridge was conceived as a solution to modernize educational administration.",
  },
  {
    year: "2024 Q1",
    title: "Beta Launch",
    description: "Initial release with core features including user management and communication systems.",
  },
  {
    year: "2024 Q2",
    title: "Enhanced Features",
    description: "Introduction of advanced grading systems and real-time notifications.",
  },
  {
    year: "2024 Q3",
    title: "Mobile Integration",
    description: "Launch of mobile applications for seamless access across all devices.",
  },
]

const navigationItems = [
  { name: "Home", href: "hero" },
  { name: "Features", href: "features" },
  { name: "System", href: "system" },
  { name: "Testimonials", href: "testimonials" },
  { name: "Timeline", href: "timeline" },
  { name: "FAQ", href: "faq" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
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

function Carousel({
  items,
  renderItem,
  autoPlay = true,
  interval = 5000,
}: {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  autoPlay?: boolean
  interval?: number
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, items.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-full p-2 hover:bg-primary/10 transition-colors"
      >
        <RiArrowLeftLine className="h-6 w-6 text-primary" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-full p-2 hover:bg-primary/10 transition-colors"
      >
        <RiArrowRightLine className="h-6 w-6 text-primary" />
      </button>

      <div className="flex justify-center mt-6 space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-primary/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const { user, logout } = useAuth();


  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
              <Image
                src={logo}
                alt="Class Bridge Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Class Bridge
              </h1>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.05 }}>
             {user ? <Button
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
              >
                Dashboard
              </Button> : <Button
                onClick={() => router.push("/auth")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
              >
                Login
              </Button>}
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        id="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-32 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
              >
                Modern Educational Administration
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl mt-12 text-muted-foreground mb-8"
              >
                A comprehensive platform for managing educational institutions with advanced features for communication,
                grading, and student management.
              </motion.p>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.div variants={itemVariants}>
                  <Button
                    onClick={() => router.push("/auth")}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white text-lg px-8 py-6"
                  >
                    Get Started
                  </Button>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    onClick={() => scrollToSection("features")}
                    variant="outline"
                    className="text-lg px-8 py-6 border-primary hover:bg-primary/10"
                  >
                    Learn More <RiArrowDownLine className="ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <Image
                src={landing}
                alt="Educational Dashboard"
                width={600}
                height={500}
                unoptimized
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/50 to-secondary/10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Key Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the powerful tools that make Class Bridge the perfect solution for modern educational
              institutions
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-primary/10 hover:border-primary/30 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* System Features Carousel */}
      <motion.section
        id="system"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/10 to-primary/5"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              System Overview
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our intuitive interfaces designed for every user role in your educational institution
            </p>
          </motion.div>

          <Carousel
            items={systemFeatures}
            renderItem={(feature) => (
              <div className="px-4">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-primary/10 overflow-hidden">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2 text-primary">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </motion.section>

      {/* Testimonials Carousel */}
      <motion.section
        id="testimonials"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-secondary/10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from educators, administrators, and parents who have transformed their educational experience with
              Class Bridge
            </p>
          </motion.div>

          <Carousel
            items={testimonials}
            renderItem={(testimonial) => (
              <div className="px-4">
                <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-primary/10 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <RiStarFill key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-muted-foreground mb-6 italic">"{testimonial.quote}"</blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={80}
                      height={80}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-primary">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section
        id="timeline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/10 to-primary/5"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground">From concept to reality - the evolution of Class Bridge</p>
          </motion.div>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div key={index} variants={itemVariants} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-24 pt-1">
                  <span className="text-primary font-semibold">{item.year}</span>
                </div>
                <div className="flex-grow p-6 bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10">
                  <h3 className="text-xl font-semibold mb-2 text-primary">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        id="faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">Get answers to common questions about Class Bridge</p>
          </motion.div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-primary/10"
              >
                <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-background border-t border-primary/10 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src={logo}
                alt="Class Bridge Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
                Class Bridge
              </span>
            </motion.div>
            <p className="text-muted-foreground text-sm">© 2024 Class Bridge. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
