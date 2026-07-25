import { CodeToolbar } from './CodeToolbar';
import { CodeEditor } from './CodeEditor';
import { CodeFooter } from './CodeFooter';

export function CodePane() {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-border lg:border-r lg:border-b-0">
      <CodeToolbar />
      <CodeEditor />
      <CodeFooter />
    </section>
  );
}
