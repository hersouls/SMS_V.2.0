import React, { useState } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ExclamationTriangleIcon, TrashIcon, ExclamationTriangleIcon as AlertTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../components/ui';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'warning' | 'confirmation' | 'deleting'>('warning');
  const [confirmationText, setConfirmationText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleClose = () => {
    if (loading) return;
    setStep('warning');
    setConfirmationText('');
    setError('');
    onClose();
  };

  const handleProceed = () => {
    setStep('confirmation');
  };

  const handleConfirm = async () => {
    if (confirmationText !== 'DELETE') {
      setError('정확히 "DELETE"를 입력해주세요.');
      return;
    }

    setStep('deleting');
    setLoading(true);
    setError('');

    try {
      // Delete user data from all tables
      const userId = user?.id;
      if (!userId) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      // Delete in order to respect foreign key constraints
      const tablesToDelete = [
        'subscription_alarms',
        'subscriptions', 
        'exchange_rates',
        'user_notification_preferences'
      ];

      for (const table of tablesToDelete) {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          console.error(`Error deleting from ${table}:`, deleteError);
        }
      }

      // Delete the user account
      // Note: In a real application, you might want to implement a soft delete
      // or use a server-side function to handle account deletion
      const { error: userDeleteError } = await supabase.auth.admin.deleteUser(userId);
      
      if (userDeleteError) {
        console.error('Account deletion failed:', userDeleteError);
        // For now, we'll just sign out the user since we can't delete the account
        // In a production app, you'd implement proper account deletion
        await supabase.auth.signOut();
        throw new Error('계정 삭제가 완료되었습니다. 로그아웃됩니다.');
      }

      // Close modal and redirect (user will be logged out automatically)
      handleClose();
      
    } catch (error) {
      console.error('계정 삭제 중 오류가 발생했습니다:', error);
      setError('계정 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      setStep('confirmation');
    } finally {
      setLoading(false);
    }
  };

  const dataToBeDeleted = [
    '모든 구독 정보',
    '결제 내역 및 알림 설정',
    '환율 설정',
    '알림 설정',
    '계정 정보'
  ];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg backdrop-blur-sm border border-white/20">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    <span className="sr-only">닫기</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  {step === 'warning' && (
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 break-keep-ko">
                          계정 삭제
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 break-keep-ko">
                            계정을 삭제하면 다음 데이터가 <strong>영구적으로 삭제</strong>됩니다:
                          </p>
                          <ul className="mt-3 text-sm text-gray-600 space-y-1">
                            {dataToBeDeleted.map((item, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <TrashIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span className="break-keep-ko">{item}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm text-red-700 break-keep-ko">
                              <strong>주의:</strong> 이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 'confirmation' && (
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 break-keep-ko">
                          최종 확인
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 break-keep-ko">
                            계정을 삭제하려면 아래에 <strong>"DELETE"</strong>를 입력하세요.
                          </p>
                          <div className="mt-4">
                            <input
                              type="text"
                              value={confirmationText}
                              onChange={(e) => setConfirmationText(e.target.value)}
                              placeholder="DELETE"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              disabled={loading}
                            />
                            {error && (
                              <p className="mt-2 text-sm text-red-600 break-keep-ko">{error}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 'deleting' && (
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 break-keep-ko">
                          계정 삭제 중
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 break-keep-ko">
                            계정과 모든 데이터를 삭제하고 있습니다. 잠시만 기다려주세요...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {step === 'warning' && (
                    <>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleProceed}
                        className="w-full sm:ml-3 sm:w-auto"
                      >
                        계속하기
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        className="mt-3 w-full sm:mt-0 sm:w-auto"
                      >
                        취소
                      </Button>
                    </>
                  )}

                  {step === 'confirmation' && (
                    <>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        loading={loading}
                        disabled={confirmationText !== 'DELETE' || loading}
                        className="w-full sm:ml-3 sm:w-auto"
                      >
                        계정 삭제
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setStep('warning')}
                        disabled={loading}
                        className="mt-3 w-full sm:mt-0 sm:w-auto"
                      >
                        뒤로
                      </Button>
                    </>
                  )}

                  {step === 'deleting' && (
                    <div className="w-full text-center">
                      <p className="text-sm text-gray-600 break-keep-ko">
                        삭제 중입니다...
                      </p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AccountDeletionModal;