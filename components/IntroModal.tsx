import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function IntroModal() {
  return (
    <div>
      <AlertDialog defaultOpen={true}>
        <AlertDialogContent className="h-[90vh] overflow-scroll">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div>Welcome to Draft Orders!</div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {/* welcome message that describes draft orders, a random order generator */}
              <div className="space-y-2">
                <h2>
                  Draft Orders is a tool to help you generate random draft
                  orders for your fantasy sports league.
                </h2>
                <img src="/screenshot.png" />
                <p>
                  To get started, click the settings to customize the names, and
                  click the &quot;Start Race&quot; button.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Get Started</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
