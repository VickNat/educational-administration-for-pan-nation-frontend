'use client'

import { Parent } from '@/lib/utils/types';
import { useGetParentById } from '@/queries/parents/queries';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

interface Student {
  id: string;
  userId: string;
  sectionId: string | null;
  parentId: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profile: string | null;
    phoneNumber: string;
    gender: string | null;
    dateOfBirth: string | null;
    role: string;
  };
}

interface ChildrenTabProps {
  id: string;
}

const ChildrenTab = ({ id }: ChildrenTabProps) => {
  const { data, isLoading } = useGetParentById(id);

  const router = useRouter();
  useEffect(() => {
    if (data?.result) {
      console.log('Parent data:', data.result);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading children data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">My Children</h2>
        <p className="text-gray-500">View and manage your children's information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Children List</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {data?.result?.students && data.result.students.length > 0 ? (
              <div className="space-y-4">
                {data.result.students.map((student: Student) => (
                  <Card key={student.id} className="p-4" onClick={() => router.push(`/dashboard/student/${student.id}`)}>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.user.profile || undefined} alt={`${student.user.firstName} ${student.user.lastName}`} />
                        <AvatarFallback>
                          {student.user.firstName[0]}
                          {student.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {student.user.firstName} {student.user.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Email: {student.user.email}
                        </p>
                        {student.user.dateOfBirth && (
                          <p className="text-sm text-gray-500">
                            Date of Birth: {new Date(student.user.dateOfBirth).toLocaleDateString()}
                          </p>
                        )}
                        {student.user.gender && (
                          <p className="text-sm text-gray-500">
                            Gender: {student.user.gender}
                          </p>
                        )}
                        {student.user.phoneNumber && (
                          <p className="text-sm text-gray-500">
                            Phone: {student.user.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No children found
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildrenTab;