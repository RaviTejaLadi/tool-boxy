import { ALL_KEYFRAMES_CSS } from './helpers';
import { AnimationGeneratorHeader, AnimationGeneratorSidebar, PreviewPane } from './components';

export default function AnimationGenerator() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <style>{ALL_KEYFRAMES_CSS}</style>
      <AnimationGeneratorHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <AnimationGeneratorSidebar />
      </div>
    </div>
  );
}
