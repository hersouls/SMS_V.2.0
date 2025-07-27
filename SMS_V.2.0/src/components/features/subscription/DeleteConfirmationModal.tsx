import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subscriptionName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  subscriptionName
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Header */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                    구독 삭제
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="sr-only">닫기</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <div className="mt-2">
                  <p className="text-sm text-gray-500 font-pretendard tracking-ko-normal break-keep-ko">
                    <span className="font-semibold text-gray-900">{subscriptionName}</span> 구독을 삭제하시겠습니까?
                  </p>
                  <p className="mt-2 text-sm text-gray-500 font-pretendard tracking-ko-normal break-keep-ko">
                    이 작업은 되돌릴 수 없습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleConfirm}
              className={cn(
                "font-pretendard font-semibold rounded-lg px-4 py-2",
                "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                "tracking-ko-normal break-keep-ko antialiased",
                "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
                "inline-flex w-full justify-center sm:ml-3 sm:w-auto"
              )}
            >
              삭제
            </button>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "font-pretendard font-semibold rounded-lg px-4 py-2",
                "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                "tracking-ko-normal break-keep-ko antialiased",
                "bg-white hover:bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-gray-500",
                "mt-3 inline-flex w-full justify-center sm:mt-0 sm:w-auto"
              )}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;