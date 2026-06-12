"use client";

// 디자인 시스템 규칙의 확인창.
// 브라우저 기본 confirm/alert 대신 토큰 기반 다이얼로그를 쓴다.
// 파괴적 행위(삭제·차단·탈퇴)는 확인 버튼만 negative 색 허용.

import { createContext, useCallback, useContext, useRef, useState } from "react";

interface DialogOptions {
  danger?: boolean; // 파괴적 행위면 true (확인 버튼이 빨강)
  confirmLabel?: string;
}

interface DialogState {
  message: string;
  type: "confirm" | "alert";
  danger: boolean;
  confirmLabel: string;
}

interface DialogApi {
  confirm: (message: string, opts?: DialogOptions) => Promise<boolean>;
  alert: (message: string) => Promise<void>;
}

const DialogContext = createContext<DialogApi>({
  confirm: async () => false,
  alert: async () => {},
});

export function useDialog() {
  return useContext(DialogContext);
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DialogState | null>(null);
  const resolver = useRef<(v: boolean) => void>(null);

  const open = useCallback(
    (message: string, type: "confirm" | "alert", opts?: DialogOptions) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setState({
          message,
          type,
          danger: opts?.danger ?? true,
          confirmLabel: opts?.confirmLabel ?? "확인",
        });
      }),
    []
  );

  const close = (result: boolean) => {
    resolver.current?.(result);
    setState(null);
  };

  const api: DialogApi = {
    confirm: (message, opts) => open(message, "confirm", opts),
    alert: async (message) => {
      await open(message, "alert");
    },
  };

  return (
    <DialogContext.Provider value={api}>
      {children}
      {state && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5"
          onClick={() => close(false)}
        >
          <div
            className="w-full max-w-[320px] rounded-2xl bg-white p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="whitespace-pre-line text-[15px] leading-[24px]">{state.message}</p>
            <div className="mt-5 flex gap-2">
              {state.type === "confirm" && (
                <button
                  onClick={() => close(false)}
                  className="h-11 flex-1 rounded-xl bg-soft text-[14px] font-semibold"
                >
                  취소
                </button>
              )}
              <button
                onClick={() => close(true)}
                className={`h-11 flex-1 rounded-xl text-[14px] font-semibold text-white ${
                  state.type === "confirm" && state.danger ? "bg-negative" : "bg-ink"
                }`}
              >
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}
