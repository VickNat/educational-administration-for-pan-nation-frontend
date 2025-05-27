import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DetailsTab = ({ parentData, user, onShowResetPassword }: any) => {
  return (
    <Card className="shadow-none border-none hover:shadow-none">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Personal Information</CardTitle>
        {user?.user?.role === 'DIRECTOR' && (
          <Button variant="default" onClick={onShowResetPassword}>
            Reset Password
          </Button>
        )}
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Gender</label>
          <div className="text-base">
            {parentData?.user?.gender === 'M' ? 'Male' : parentData?.user?.gender === 'F' ? 'Female' : '-'}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
          <div className="text-base">
            {parentData?.user?.dateOfBirth ? new Date(parentData.user.dateOfBirth).toISOString().split('T')[0] : '-'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsTab; 