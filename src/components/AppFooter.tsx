import { ExternalLink } from 'lucide-react';
import {
  PROJECT_LICENSE_NAME,
  PROJECT_LICENSE_URL,
  PROJECT_REPO_URL,
} from '@/utils/projectMeta';

export function AppFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white/92 px-6 py-3 backdrop-blur-sm">
      <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-5">
          Hue Forge is open source. Review the repository and license before reuse or redistribution.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={PROJECT_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-gray-600 transition hover:text-gray-900"
          >
            Open source on GitHub
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={PROJECT_LICENSE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-gray-600 transition hover:text-gray-900"
          >
            {PROJECT_LICENSE_NAME}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
