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
import KofiButton from "kofi-button";

export function IntroModal() {
  const defaultOpen = !window?.location?.search.includes("skipIntro");
  return (
    <div>
      <AlertDialog defaultOpen={defaultOpen}>
        <AlertDialogTrigger asChild>
          <div
            className="text-white cursor-pointer"
            style={{ cursor: "pointer" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer info-btn"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-h-[90vh] overflow-scroll">
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
            <KofiButton
              color="#0a9396"
              title="Tip the dev"
              kofiID="S6S5EMUTW"
            />
            <div className="mb-2 md:mb-0 [&>*]:w-full">
              <AlertDialogAction>Get Started</AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
