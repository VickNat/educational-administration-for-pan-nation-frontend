import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ChildrenTab = ({ students, router, parentId }: any) => {
  return (
    <Card className="shadow-none border-none hover:shadow-none">
      <CardHeader className='flex items-center justify-between'>
        <CardTitle>Children</CardTitle>
        <Button onClick={() => router.push('/dashboard/student/add?parentId=' + parentId)}>
          Add Student
        </Button>
      </CardHeader>
      <CardContent>
        {students?.length > 0 ? (
          <div className="space-y-2">
            {students.map((student: any) => (
              <div
                key={student.id}
                className="flex cursor-pointer hover:bg-gray-100 items-center justify-between p-3 rounded-lg border"
                onClick={() => router.push(`/dashboard/student/${student.id}`)}
              >
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
  );
};

export default ChildrenTab; 