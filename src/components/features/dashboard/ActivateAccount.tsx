import { useAuth } from '@/app/context/AuthContext';
import { useActivateParent } from '@/queries/users/mutations';
import { useActivateTeacher } from '@/queries/users/mutations';
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ActivateAccount = () => {
  const { user } = useAuth();
  const { mutateAsync: activateTeacher, isPending: isActivatingTeacher } = useActivateTeacher();
  const { mutateAsync: activateParent, isPending: isActivatingParent } = useActivateParent();

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (user?.user.role === 'TEACHER') {
      await activateTeacher(
        { input: { password: values.password } },
        {
          onSuccess: () => {
            toast.success('Account activated successfully!');
            window.location.reload();
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to activate account');
          },
        }
      );
    } else if (user?.user.role === 'PARENT') {
      activateParent(
        { input: { password: values.password } },
        {
          onSuccess: () => {
            toast.success('Account activated successfully!');
            window.location.reload();
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to activate account');
          },
        }
      );
    }
  };

  if (!user || user.isActivated || user?.user.role === 'DIRECTOR') {
    return null;
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Activate Your Account</DialogTitle>
          <DialogDescription>
            Please set your password to activate your account.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Field
                  as={Input}
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className={errors.password && touched.password ? 'border-red-500' : ''}
                />
                {errors.password && touched.password && (
                  <div className="text-sm text-red-500">{errors.password}</div>
                )}
              </div>
              <div className="space-y-2">
                <Field
                  as={Input}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className={errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="text-sm text-red-500">{errors.confirmPassword}</div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isActivatingTeacher || isActivatingParent}
              >
                {(isActivatingTeacher || isActivatingParent) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  'Activate Account'
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ActivateAccount;