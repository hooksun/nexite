"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import ButtonLoading from "@/components/ui/button-loading"
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react"

type AlertDialogState = {
  open: boolean
  content?: ReactNode
  contentProps?: Parameters<typeof AlertDialogContent>[0]
}

const AlertDialogContext = createContext<
  [AlertDialogState, Dispatch<SetStateAction<AlertDialogState>>]
>([{ open: false }, () => {}])

export function AlertDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AlertDialogState>({
    open: false,
    content: null,
  })

  return (
    <AlertDialogContext.Provider value={[state, setState]}>
      {children}
      <AlertDialog
        open={state.open}
        onOpenChange={(open) => setState((s) => ({ ...s, open }))}
      >
        <AlertDialogContent {...state.contentProps}>
          {state.content}
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  )
}

export function useAlertDialog() {
  const [_, setState] = useContext(AlertDialogContext)

  return {
    confirm: ({
      onConfirm,
      media,
      title,
      description,
      confirm = "Confirm",
      destructive = false,
    }: {
      onConfirm: () => unknown
      media?: ReactNode
      title?: ReactNode
      description?: ReactNode
      confirm?: ReactNode
      destructive?: boolean
    }) =>
      setState({
        open: true,
        content: (
          <>
            <AlertDialogHeader>
              {media && <AlertDialogMedia>{media}</AlertDialogMedia>}
              {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
              {description && (
                <AlertDialogDescription>{description}</AlertDialogDescription>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant={destructive ? "destructive" : "default"}
                render={
                  <ButtonLoading
                    onClick={async () => {
                      await onConfirm()
                      setState((s) => ({ ...s, open: false }))
                    }}
                  >
                    {confirm}
                  </ButtonLoading>
                }
              />
            </AlertDialogFooter>
          </>
        ),
      }),
  }
}
