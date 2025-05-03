'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { RiArrowLeftLine } from 'react-icons/ri';
import { useGetGradeLevelById } from '@/queries/grade-level/queries';
import { useParams } from 'next/navigation';
import { GradeLevel } from '@/lib/utils/types';

const gradeLevelData = {
  id: "grade001",
  level: "Grade 1",
  subjects: [
    { id: "sub001", name: "Mathematics" },
    { id: "sub002", name: "Science" },
    { id: "sub003", name: "English" },
  ],
};

const GradeLevelDetail = () => {

  const { id } = useParams();
  const { data } = useGetGradeLevelById(id as string);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | null>(null);

  useEffect(() => {
    if (data) {
      setGradeLevel(data.result);
    }
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Paper-like Background Container (No Shadow) */}
      <div className="bg-white rounded-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Grade Level Details</h1>
            {/* <p className="text-sm text-muted-foreground">Grade Levels / Grade Level Details</p> */}
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              variant="ghost"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Link href="/dashboard/grade-level">
                <RiArrowLeftLine className="h-5 w-5 text-gray-600" /> Back
              </Link>
            </Button>
            <Button
              variant="default"
            >
              <Link href={`/dashboard/sections/add?gradeLevelId=${id}`}>Add Section</Link>
            </Button>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-8">
          {/* Level Field */}
          <div>
            <Label htmlFor="level" className="text-sm font-medium text-gray-700">
              Level
            </Label>
            <Input
              id="level"
              type="text"
              value={gradeLevel?.level}
              readOnly
              className="mt-1 bg-gray-50 max-w-md"
            />
          </div>

          {/* Subjects List */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Subjects in {gradeLevel?.level}
            </h2>
            {gradeLevel?.subjectList && gradeLevel?.subjectList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gradeLevel?.subjectList.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {subject.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No subjects assigned to this grade level.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeLevelDetail;