import { SiGithub } from '@icons-pack/react-simple-icons';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { ModeSwitcher } from '@/components/mode-switcher';

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="ml-auto flex items-center gap-3">
          <a
            href="https://github.com/Kaikaikaifang/divine-agent"
            rel="noreferrer Divine Agent GitHub repository"
            target="_blank"
            className="dark:text-foreground"
          >
            <SiGithub size={18} />
          </a>
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
}
