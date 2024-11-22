import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";

interface ToastProps {
  title: string;
  description: string;
  variant?: "success" | "error" | "warning" | "info";
  placement?: "top" | "bottom";
}
export function useInAppNotifications() {
  const toast = useToast();

  const showNotification = (props: ToastProps) => {
    const newId = Math.random().toString();

    toast.show({
      id: newId,
      placement: props.placement || "top",
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action={props.variant || "info"} variant="solid">
            <ToastTitle>{props.title}</ToastTitle>
            <ToastDescription>{props.description}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  return { showNotification };
}
