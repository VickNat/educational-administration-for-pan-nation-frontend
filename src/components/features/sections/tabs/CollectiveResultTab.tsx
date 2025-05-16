'use client'

import { CollectiveResult, Section } from '@/lib/utils/types';
import { useGenerateCollectiveResult } from '@/queries/results/mutations';
import { useGetCollectiveResultBySectionId } from '@/queries/results/queries';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useRouter } from 'next/navigation';

interface CollectiveResultTabProps {
  section: Section;
}

const CollectiveResultTab = ({ section }: CollectiveResultTabProps) => {
  const [collectiveResults, setCollectiveResults] = useState<CollectiveResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: collectiveResultData } = useGetCollectiveResultBySectionId(section.id);
  const { mutateAsync: generateCollectiveResult } = useGenerateCollectiveResult();
  const router = useRouter();
  
  useEffect(() => {
    if (collectiveResultData && collectiveResultData.result) {
      setCollectiveResults(collectiveResultData.result);
    }
  }, [collectiveResultData]);

  const handleGenerateCollectiveResult = async () => {
    try {
      setIsGenerating(true);
      await generateCollectiveResult(section.id);
      toast.success('Collective result generated successfully');
    } catch (error) {
      toast.error(`Failed to generate collective result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }

  if (collectiveResults.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <div className="text-gray-500 text-lg">No collective result found for this section</div>
        <button
          onClick={handleGenerateCollectiveResult}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={isGenerating}
        > 
          {isGenerating ? 'Generating...' : 'Generate Collective Result'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Total Score</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Conduct</TableHead>
            <TableHead>Feedback</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collectiveResults.map((result) => (
            <TableRow key={result.id} className="cursor-pointer" onClick={() => router.push(`/dashboard/student/${result.studentId}?tab=collective-result`)}>
              <TableCell>{result.studentId}</TableCell>
              <TableCell>{result.totalScore}</TableCell>
              <TableCell>{result.rank}</TableCell>
              <TableCell>{result.conduct || '-'}</TableCell>
              <TableCell>{result.feedback || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CollectiveResultTab