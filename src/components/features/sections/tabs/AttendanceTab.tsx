'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGetTodayAttendance } from '@/queries/attendance/queries';
import { useMarkAttendance } from '@/queries/attendance/mutations';
import { Loader2 } from 'lucide-react';

interface Student {
  id: string;
  userId: string;
  sectionId: string;
  parentId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  attendance: {
    id: string;
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'EXCUSED';
    studentId: string;
    sectionId: string;
  } | null;
}

interface AttendanceTabProps {
  sectionId: string;
  sectionName: string;
  isHomeRoom: boolean;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ sectionId, sectionName, isHomeRoom }) => {
  const { data: attendanceData, isLoading } = useGetTodayAttendance(sectionId);
  const { mutateAsync: markAttendance, isPending } = useMarkAttendance();
  const today = new Date().toISOString().split('T')[0];

  console.log("isHomeRoom", isHomeRoom);

  // Handle attendance marking
  const handleMarkAttendance = async (studentId: string, status: 'PRESENT' | 'ABSENT' | 'EXCUSED') => {
    try {
      await markAttendance({
        data: {
          studentId,
          sectionId,
          date: new Date().toISOString(),
          status
        },
      });
      toast.success('Attendance marked successfully');
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className='shadow-none'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Attendance for {sectionName} - {today}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Attendance Status</TableHead>
                {isHomeRoom && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData?.result.map((student: Student) => (
                <TableRow key={student.id}>
                  <TableCell>{`${student.user.firstName} ${student.user.lastName}`}</TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>
                    {student.attendance ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.attendance.status === 'PRESENT'
                            ? 'bg-green-100 text-green-800'
                            : student.attendance.status === 'ABSENT'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {student.attendance.status}
                      </span>
                    ) : (
                      <span className="text-gray-500">Not marked</span>
                    )}
                  </TableCell>
                  {isHomeRoom && (
                    <TableCell>
                      <Select
                        onValueChange={(value) =>
                          handleMarkAttendance(student.id, value as 'PRESENT' | 'ABSENT' | 'EXCUSED')
                        }
                        defaultValue={student.attendance?.status}
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Mark" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRESENT">Present</SelectItem>
                          <SelectItem value="ABSENT">Absent</SelectItem>
                          <SelectItem value="EXCUSED">Excused</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTab;