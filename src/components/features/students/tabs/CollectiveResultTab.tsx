import { CollectiveResultByStudent } from '@/lib/utils/types';
import { useGetCollectiveResultByStudentId } from '@/queries/results/queries';
import React, { useEffect, useState } from 'react';
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

interface CollectiveResultTabProps {
  studentId: string;
}

const conductGrades = ['A', 'B', 'C', 'D'];

const CollectiveResultTab = ({ studentId }: CollectiveResultTabProps) => {
  const { data, isLoading, isError } = useGetCollectiveResultByStudentId(studentId);
  const [collectiveResult, setCollectiveResult] = useState<CollectiveResultByStudent | null>(null);
  const { mutateAsync: updateCollectiveResult, isPending } = useUpdateCollectiveResult();

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

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading results...</div>;
  }

  if (isError) {
    return <div className="flex items-center justify-center p-8 text-destructive">Error loading results</div>;
  }

  if (!collectiveResult) {
    return <div className="flex items-center justify-center p-8">No results available</div>;
  }

  const { student, totalScore, rank, conduct, feedback, result } = collectiveResult;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Academic Achievement Certificate</CardTitle>
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">This is to certify that</p>
          <h2 className="text-2xl font-semibold">{`${student?.user?.firstName} ${student?.user?.lastName}`}</h2>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-primary/5">
              <p className="text-sm text-muted-foreground">Total Score</p>
              <p className="text-2xl font-bold">{totalScore}</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <p className="text-sm text-muted-foreground">Class Rank</p>
              <p className="text-2xl font-bold">#{rank}</p>
            </div>
          </div>

          <Formik
            initialValues={{ feedback: feedback || '', conduct: conduct || '' }}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-4">
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
                      {conductGrades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Teacher's Feedback</p>
                  <Field
                    as={Input}
                    name="feedback"
                    placeholder="Enter feedback"
                    className="max-w-md mx-auto"
                  />
                </div>

                <div className="flex justify-center">
                  <Button type="submit" disabled={isPending} className="gap-2">
                    <Save className="h-4 w-4" />
                    {isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Subject-wise Performance
            </h3>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {result.map((subjectResult) => (
                  <div key={subjectResult.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{subjectResult.subject?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Section: {subjectResult.section?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{subjectResult.final}</p>
                      <p className="text-sm text-muted-foreground">Final Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectiveResultTab;