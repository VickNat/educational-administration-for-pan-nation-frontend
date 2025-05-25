"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../app/context/AuthContext';
import { useUpdateUser } from '@/queries/users/mutations';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadImage } from '@/utils/helper';
import { Camera } from 'lucide-react';

export default function ProfileTab() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.user?.firstName || '');
  const [lastName, setLastName] = useState(user?.user?.lastName || '');
  const [phone, setPhone] = useState(user?.user?.phoneNumber || '');
  const [imagePreview, setImagePreview] = useState<string | null>(user?.user?.profile || null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const updateUser = useUpdateUser();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setFirstName(user?.user?.firstName || '');
    setLastName(user?.user?.lastName || '');
    setPhone(user?.user?.phoneNumber || '');
    setImagePreview(user?.user?.profile || null);
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let profileUrl = user?.user?.profile;

      if (selectedImage) {
        const { error, url } = await uploadImage(selectedImage);
        if (error) {
          toast.error('Failed to upload image: ' + error);
          setIsLoading(false);
          return;
        }
        profileUrl = url;
      }

      await updateUser.mutateAsync({
        input: {
          firstName,
          lastName,
          phoneNumber: phone,
          profile: profileUrl,
        },
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSave}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image Section */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative group">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
              <Image
                src={imagePreview || '/images/logo.png'}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image"
              />
              <Label
                htmlFor="profile-image"
                className="cursor-pointer p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-200"
              >
                <Camera className="w-6 h-6 text-white" />
              </Label>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Click on the camera icon to change your profile picture
          </p>
        </div>

        {/* Form Fields Section */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">First Name</Label>
              <Input
                type="text"
                className="w-full"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Last Name</Label>
              <Input
                type="text"
                className="w-full"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1">Phone</Label>
              <Input
                type="tel"
                className="w-full"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className='flex justify-end pt-4'>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
} 