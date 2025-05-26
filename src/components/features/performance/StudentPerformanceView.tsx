'use client'

import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { TrendingUp, Award, BookOpen, Target, ArrowLeft } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { useGetStudentPerformance } from "@/queries/performance/queries"
import { useParams, useRouter } from "next/navigation"

const StudentPerformanceView = () => {
  const { studentId } = useParams()
  const router = useRouter()
  const [roster, setRoster] = useState<any[]>([])
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const { data: studentPerformance } = useGetStudentPerformance(studentId as string)

  useEffect(() => {
    if (studentPerformance && Array.isArray(studentPerformance.result)) {
      setRoster(studentPerformance.result)
    }
  }, [studentPerformance])

  // If no data, show empty state
  if (!roster || roster.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-8 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-muted-foreground mb-2">No performance data yet</h2>
        <p className="text-muted-foreground">Performance data will appear here once available.</p>
        <Button variant="ghost" className="mt-8" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    )
  }

  // Prepare data for charts and meta info from roster
  const student = roster[0]?.student
  const current = roster[roster.length - 1]
  const semesterPerformance = roster.map((r: any) => ({
    semester: `Sem ${r.semesterNumber}`,
    average: r.average,
    rank: r.rank,
  }))
  const allSubjects = Array.from(new Set(roster.flatMap((r: any) => r.subjects.map((s: any) => s.subjectName))))
  const subjectWiseData = roster.map((r: any) => {
    const entry: any = { semester: `Sem ${r.semesterNumber}` }
    allSubjects.forEach((subj) => {
      const found = r.subjects.find((s: any) => s.subjectName === subj)
      entry[subj] = found ? found.subjectResult : null
    })
    return entry
  })
  const totalSemesters = roster.length
  const bestAverage = Math.max(...roster.map((r: any) => r.average))
  const worstAverage = Math.min(...roster.map((r: any) => r.average))
  const bestSemester = roster.find((r: any) => r.average === bestAverage)?.semesterNumber
  const worstSemester = roster.find((r: any) => r.average === worstAverage)?.semesterNumber
  const mostImprovedSubject = (() => {
    let maxDiff = Number.NEGATIVE_INFINITY
    let subject = ""
    allSubjects.forEach((subj) => {
      const first = roster[0].subjects.find((s: any) => s.subjectName === subj)?.subjectResult ?? 0
      const last = roster[roster.length - 1].subjects.find((s: any) => s.subjectName === subj)?.subjectResult ?? 0
      const diff = last - first
      if (diff > maxDiff) {
        maxDiff = diff
        subject = subj
      }
    })
    return subject ? { subject, diff: maxDiff } : null
  })()

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fff',
        scrollY: -window.scrollY,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
      const imgWidth = canvas.width * ratio
      const imgHeight = canvas.height * ratio
      pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 20, imgWidth, imgHeight, undefined, 'FAST')
      pdf.save(`${student?.user.firstName || 'student'}_performance.pdf`)
    } catch (err) {
      alert('Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Performance</h1>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
      <div ref={dashboardRef} className="space-y-8">
        {/* Profile and Performance Overview */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Student Profile Card */}
          <Card className="relative overflow-hidden border-0 shadow-none">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
            <div className="relative p-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarImage src={student?.user.profile || "/placeholder.svg"} />
                    <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-white">
                      {student?.user.firstName[0]}
                      {student?.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    #{current.rank}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {student?.user.firstName} {student?.user.lastName}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200">
                      <BookOpen className="w-3 h-3" />
                      {current.section.name}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-200">
                      <Award className="w-3 h-3" />
                      Rank {current.rank}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium border border-amber-200">
                      <Target className="w-3 h-3" />
                      {current.average}% Avg
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Trend Card */}
          <Card className="relative overflow-hidden border-0 shadow-none">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent" />
            <div className="relative p-8">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <h3 className="text-xl font-semibold text-foreground">Performance Trend</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={semesterPerformance} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="url(#colorGradient)"
                    strokeWidth={4}
                    dot={{ r: 6, fill: "#3b82f6", strokeWidth: 3, stroke: "white" }}
                    activeDot={{ r: 8, fill: "#3b82f6" }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-none group hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10" />
            <div className="relative p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Semesters</p>
              <p className="text-3xl font-bold text-foreground">{totalSemesters}</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-none group hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10" />
            <div className="relative p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Best Average</p>
              <p className="text-3xl font-bold text-foreground">{bestAverage}%</p>
              <p className="text-xs text-emerald-600 font-medium">Semester {bestSemester}</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-none group hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/10" />
            <div className="relative p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Lowest Average</p>
              <p className="text-3xl font-bold text-foreground">{worstAverage}%</p>
              <p className="text-xs text-amber-600 font-medium">Semester {worstSemester}</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-none group hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10" />
            <div className="relative p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Most Improved</p>
              <p className="text-lg font-bold text-foreground">{mostImprovedSubject?.subject || "-"}</p>
              <p className="text-xs text-purple-600 font-medium">
                {mostImprovedSubject ? `+${mostImprovedSubject.diff} points` : "No data"}
              </p>
            </div>
          </Card>
        </div>

        {/* Subject Performance Chart */}
        <Card className="relative overflow-hidden border-0 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/30" />
          <div className="relative p-8">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Subject-wise Performance</h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={subjectWiseData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                {allSubjects.map((subj, idx) => (
                  <Bar
                    key={subj}
                    dataKey={subj}
                    fill={["url(#physicsGradient)", "url(#mathGradient)"][idx % 2]}
                    radius={[8, 8, 0, 0]}
                  />
                ))}
                <defs>
                  <linearGradient id="physicsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="mathGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      {/* Export Button */}
      <div className="flex justify-end pt-4">
        <Button
          variant="outline"
          className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300"
          onClick={handleExportPDF}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'Export as PDF'}
        </Button>
      </div>
    </div>
  )
}

export default StudentPerformanceView
