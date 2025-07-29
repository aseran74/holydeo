import { UserButton } from '@clerk/clerk-react';

export default function UserDropdown() {
  return (
    <div className="flex items-center">
      <UserButton 
        afterSignOutUrl="/signin"
        appearance={{
          elements: {
            userButtonAvatarBox: "w-10 h-10 rounded-full overflow-hidden",
            userButtonTrigger: "flex items-center gap-3 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors",
            userButtonPopoverCard: "shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800",
            userButtonPopoverActionButton: "hover:bg-gray-100 dark:hover:bg-gray-700",
            userButtonPopoverActionButtonText: "text-gray-700 dark:text-gray-300",
            userButtonPopoverActionButtonIcon: "text-gray-500 dark:text-gray-400"
          }
        }}
      />
    </div>
  );
}
