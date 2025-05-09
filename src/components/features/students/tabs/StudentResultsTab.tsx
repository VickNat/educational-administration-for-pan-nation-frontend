'use client'

import { useGetCollectiveResults, useGetSingleStudentResult } from '@/queries/results/queries';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { RiEditLine, RiDeleteBinLine, RiAddLine } from 'react-icons/ri';
import { Loader2 } from 'lucide-react';
import { Result } from '@/lib/utils/types';

interface StudentResultsTabProps {
  studentId: string;
}

const dummyResults = [
  {
    id: "cklg5z0zr000001l1f8gk9u0z",
    test1: 8.5,
    test2: 4.3,
    mid: 15,
    final: 25,
    assignment: 10,
    quiz: 5,
    teacherId: "cklg5z0zr000001l1f8gk9u0z",
    studentId: "cklg5z0zr000101l1f8gk9u1y", 
    sectionId: "cklg5z0zr000201l1f8gk9u2x",
    subjectId: "cklg5z0zr000301l1f8gk9u3w"
  },
  {
    id: "cklg5z0zr000101l1f8gk9u1y",
    test1: 7.8,
    test2: 8.5,
    mid: 17,
    final: 35,
    assignment: 13,
    quiz: 4,
    teacherId: "cklg5z0zr000001l1f8gk9u0z",
    studentId: "cklg5z0zr000101l1f8gk9u1y",
    sectionId: "cklg5z0zr000201l1f8gk9u2x", 
    subjectId: "cklg5z0zr000401l1f8gk9u4v"
  },
  {
    id: "cklg5z0zr000201l1f8gk9u2x",
    test1: 9.2,
    test2: 9.5,
    mid: 18,
    final: 38,
    assignment: 14,
    quiz: 5,
    teacherId: "cklg5z0zr000001l1f8gk9u0z",
    studentId: "cklg5z0zr000101l1f8gk9u1y",
    sectionId: "cklg5z0zr000201l1f8gk9u2x",
    subjectId: "cklg5z0zr000501l1f8gk9u5u"
  }
]

const StudentResultsTab: React.FC<StudentResultsTabProps> = ({ studentId }) => {
  const router = useRouter();
  const { data, isLoading } = useGetSingleStudentResult(studentId) as { data: { result: any[] } | undefined, isLoading: boolean };
  // const { data: collectiveResults, isLoading: isCollectiveResultsLoading } = useGetCollectiveResults(studentId);
  const [results, setResults] = useState<Result[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [resultToDelete, setResultToDelete] = useState<Result | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // console.log("collectiveResults", collectiveResults);
  console.log("results", results);

  useEffect(() => {
    if (data) {
      setResults(data.result);
    }
  }, [data]);

  const handleEdit = (resultId: string) => {
    router.push(`/dashboard/student/${studentId}/results/${resultId}`);
  };

  const handleRemove = (result: Result) => {
    setResultToDelete(result);
    setIsDeleteDialogOpen(true);
  };

  const confirmRemove = async () => {
    if (!resultToDelete) return;
    setIsRemoving(true);
    try {
      // Call your delete mutation here, e.g., await deleteResult(resultToDelete.id);
      toast.success('Result removed successfully');
      setIsDeleteDialogOpen(false);
      setResultToDelete(null);
    } catch (error) {
      console.error('Error removing result:', error);
      toast.error('Failed to remove result');
    } finally {
      setIsRemoving(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Student Results</h2>
        <Button
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          onClick={() => router.push(`/dashboard/student/${studentId}/results/add`)}
        >
          <RiAddLine className="w-4 h-4" /> Add Result
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Test 1</TableHead>
              <TableHead>Test 2</TableHead>
              <TableHead>Mid</TableHead>
              <TableHead>Final</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(results || []).map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.subject?.name}</TableCell>
                <TableCell>{result.test1}</TableCell>
                <TableCell>{result.test2}</TableCell>
                <TableCell>{result.mid}</TableCell>
                <TableCell>{result.final}</TableCell>
                <TableCell>{result.assignment}</TableCell>
                <TableCell>{result.quiz}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(result.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <RiEditLine className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(result)}
                    className="text-red-600 hover:text-red-800"
                    disabled={isRemoving}
                  >
                    <RiDeleteBinLine className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this result? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setResultToDelete(null);
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmRemove}
              className="bg-red-600 hover:bg-red-700"
              disabled={isRemoving}
            >
              {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentResultsTab;