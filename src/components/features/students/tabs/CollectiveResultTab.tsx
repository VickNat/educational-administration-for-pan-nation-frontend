import { CollectiveResultByStudent } from '@/lib/utils/types';
import { useGetCollectiveResultByStudentId } from '@/queries/results/queries';
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Award, Star, Save } from 'lucide-react';
import { useUpdateCollectiveResult } from '@/queries/results/mutations';
import { Formik, Form, Field } from 'formik';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Image from 'next/image';
import logo from '@/../public/images/logo.png';

interface CollectiveResultTabProps {
  studentId: string;
}

const conductGrades = ['A', 'B', 'C', 'D'];

const CollectiveResultTab = ({ studentId }: CollectiveResultTabProps) => {
  const { data, isLoading, isError } = useGetCollectiveResultByStudentId(studentId);
  const [collectiveResult, setCollectiveResult] = useState<CollectiveResultByStudent | null>(null);
  const { mutateAsync: updateCollectiveResult, isPending } = useUpdateCollectiveResult();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data && data.result) {
      setCollectiveResult(data.result);
    }
  }, [data]);

  const handleSubmit = async (values: { feedback: string; conduct: string }) => {
    try {
      await updateCollectiveResult({ collectiveResultId: collectiveResult?.id || '', collectiveResultData: values });
      toast.success('Results updated successfully');
    } catch (error) {
      toast.error('Failed to update results');
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    window.print();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading results...</div>;
  }

  if (isError) {
    return <div className="flex items-center justify-center p-8 text-destructive">Error loading results</div>;
  }

  if (!collectiveResult) {
    return <div className="flex items-center justify-center p-8">No results available</div>;
  }

  const { student, totalScore, rank, conduct, feedback, result, average } = collectiveResult;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Print Button (hidden on print) */}
      <div className="flex justify-end mb-4 print:hidden">
        <Button onClick={handlePrint} variant="outline" className="gap-2 border-primary/40">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-6 0v4m0 0h4m-4 0H8" /></svg>
          Print Certificate
        </Button>
      </div>
      {/* Printable Area */}
      <div ref={printRef} className="print-area bg-white rounded-2xl shadow-xl border-2 border-primary/20 p-6 print:p-0 print:shadow-none print:border-0">
        {/* Logo at the top */}
        <div className="flex flex-col items-center mb-2">
          <Image src={logo} alt="Logo" width={80} height={80} className="mb-2 rounded-full border border-primary/30 bg-white" unoptimized />
        </div>
        <Card className="border-none shadow-none bg-transparent p-0">
          <CardHeader className="text-center space-y-4 pb-6 border-b border-primary/10">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-extrabold tracking-tight font-serif text-primary print:text-black">Academic Achievement Certificate</CardTitle>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <p className="text-gray-600 text-lg font-medium">This is to certify that</p>
            <h2 className="text-2xl font-bold font-serif text-primary print:text-black">{`${student?.user?.firstName} ${student?.user?.lastName}`}</h2>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-gray-600">Total Score</p>
                <p className="text-2xl font-bold text-primary">{totalScore}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-gray-600">Class Rank</p>
                <p className="text-2xl font-bold text-primary">#{rank}</p>
              </div>
            </div>

            <Formik
              initialValues={{ feedback: feedback || '', conduct: conduct || '' }}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-4 print:hidden">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <Select
                      value={values.conduct}
                      onValueChange={(value) => setFieldValue('conduct', value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Conduct" />
                      </SelectTrigger>
                      <SelectContent>
                        {conductGrades && conductGrades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Teacher's Feedback</p>
                    <Field
                      as={Input}
                      name="feedback"
                      placeholder="Enter feedback"
                      className="max-w-md mx-auto"
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button type="submit" disabled={isPending} className="gap-2 bg-primary hover:bg-primary/90">
                      <Save className="h-4 w-4" />
                      {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>

            {/* Show conduct and feedback in print mode */}
            <div className="hidden print:block text-center mt-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-semibold text-gray-700">Conduct:</span>
                <span className="ml-1 text-primary">{conduct || '-'}</span>
              </div>
              <div className="text-center p-2">
                <span className="font-semibold text-gray-700">Teacher's Feedback:</span>
                <span className="ml-1 text-gray-600">{feedback || '-'}</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <Award className="h-5 w-5 text-primary" />
                Subject-wise Performance
              </h3>
              <ScrollArea className="h-[300px] rounded-md border p-4 print:h-auto print:border-none print:p-0">
                <div className="space-y-4">
                  {result && result.map((subjectResult) => (
                    <div key={subjectResult.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 print:bg-transparent print:border-b print:rounded-none">
                      <div>
                        <p className="font-medium text-gray-800">{subjectResult.subject?.name}</p>
                        <p className="text-sm text-gray-600">
                          Section: {subjectResult.section?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{subjectResult.final}</p>
                        <p className="text-sm text-gray-600">Final Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Footer for print: date and signature */}
            <div className="mt-12 flex flex-col items-end print:items-end print:mt-16">
              <div className="text-sm text-gray-600 print:text-black mb-2">Date: {new Date().toLocaleDateString()}</div>
              <div className="border-t border-primary/30 w-40 mt-2"></div>
              <div className="text-sm mt-1 text-gray-600 print:text-black">Signature</div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100vw !important;
            min-height: 100vh !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print\:hidden {
            display: none !important;
          }
          .print\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CollectiveResultTab;