'use client';

import { newVerification } from '@/actions/new-verification';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { CardWrapper } from './card-wrapper';

export default function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const onSubmit = () => {
      if (!token) {
        setError('Missing token!');
        return;
      }
      newVerification(token)
        .then((data) => {
          setSuccess(data.success);
          setError(data.error);
        })
        .catch(() => {
          setError('Something went wrong!');
        });
    };
    onSubmit();
  }, [error, success, token]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex flex-col gap-4 items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        {!success && <FormError message={error} />}
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
}
