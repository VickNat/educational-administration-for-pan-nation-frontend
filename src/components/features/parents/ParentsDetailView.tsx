'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useGetParentById } from '@/queries/parents/queries';
import { Parent } from '@/lib/utils/types';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { RiArrowLeftLine, RiUserAddLine } from 'react-icons/ri';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ParentsDetailView = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { data } = useGetParentById(id as string);
  const [parentData, setParentData] = useState<Parent>(data?.result);
  const { user } = useAuth();

  useEffect(() => {
    if (data && data?.result) {
      setParentData(data.result);
    }
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parent Details</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            Back
          </Button>
          {(user?.role === 'DIRECTOR' || user?.role === 'TEACHER') && (
            <Button
              variant="default"
              onClick={() => {
                router.push(`/dashboard/student/add?parentId=${id}`);
              }}
              className="flex items-center gap-2"
            >
              <RiUserAddLine className="w-4 h-4" />
              Add Student
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className='shadow-none border-none'>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">First Name</label>
              <div className="text-base">{parentData?.user?.firstName || '-'}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
              <div className="text-base">{parentData?.user?.lastName || '-'}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="text-base">{parentData?.user?.email || '-'}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
              <div className="text-base">{parentData?.user?.phoneNumber || '-'}</div>
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-none border-none'>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            {parentData?.students?.length > 0 ? (
              <div className="space-y-2">
                {parentData.students.map((student: any) => (
                  <div key={student.id} className="flex cursor-pointer hover:bg-gray-100 items-center justify-between p-3 rounded-lg border" onClick={() => router.push(`/dashboard/student/${student.id}`)}>
                    <span className="font-medium">{student.user.firstName} {student.user.lastName}</span>
                    <Badge variant="secondary">Student</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No students assigned
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ParentsDetailView