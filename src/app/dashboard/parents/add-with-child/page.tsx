'use client'

import React, { useState, useRef } from 'react';
import AddParentView from '@/components/features/parents/AddParentView';
import AddStudentsView from '@/components/features/students/AddStudentsView';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const steps = [
  { label: 'Add Parent' },
  { label: 'Add Student' },
];

const AddParentWithChildPage = () => {
  const [step, setStep] = useState<'parent' | 'student'>('parent');
  const [parentId, setParentId] = useState<string | null>(null);
  const [studentAdded, setStudentAdded] = useState(false);
  const [studentKey, setStudentKey] = useState(0); // for resetting AddStudentsView
  const router = useRouter();

  const handleParentAdded = (id: string) => {
    setParentId(id);
    setStep('student');
  };

  // Handler to be passed to AddStudentsView for after student is added
  const handleStudentAdded = () => {
    setStudentAdded(true);
  };

  const handleAddAnotherChild = () => {
    setStudentAdded(false);
    setStudentKey(prev => prev + 1); // force remount to clear form
  };

  const handleGoToParentDetails = () => {
    if (parentId) {
      router.push(`/dashboard/parents/${parentId}`);
    }
  };

  // Step index for UI
  const stepIndex = step === 'parent' ? 0 : 1;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto pt-12">
        {/* Stepper Header */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className={cn(
                'flex flex-col items-center',
                i === stepIndex ? 'text-blue-700 font-bold' : 'text-gray-400 font-medium'
              )}>
                <div className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-full border-2',
                  i === stepIndex ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white border-gray-300'
                )}>
                  {i + 1}
                </div>
                <span className="mt-2 text-xs md:text-sm tracking-wide">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  'w-12 h-1 mx-2 rounded-full',
                  i < stepIndex ? 'bg-blue-600' : 'bg-gray-200'
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Step Content */}
        {step === 'parent' ? (
          <div className="bg-white rounded-lg p-8">
            <AddParentView onParentAdded={handleParentAdded} />
          </div>
        ) : (
          parentId && (
            <div>
              <AddStudentsView key={studentKey} parentId={parentId} onStudentAdded={handleStudentAdded} />
              {studentAdded && (
                <div className="mt-8 flex flex-col items-center gap-4 bg-white/80 rounded-lg p-6 border border-blue-100">
                  <div className="text-green-600 font-semibold text-lg">Student added successfully!</div>
                  <div className="flex gap-4">
                    <Button onClick={handleAddAnotherChild} className="bg-blue-600 hover:bg-blue-700">Add Another Child</Button>
                    <Button variant="ghost" onClick={handleGoToParentDetails}>Go to Parent Details</Button>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AddParentWithChildPage; 